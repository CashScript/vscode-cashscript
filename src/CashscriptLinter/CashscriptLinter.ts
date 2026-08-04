import * as fs from 'fs';
import * as path from 'path';
import { Diagnostic, DiagnosticSeverity, Range } from 'vscode-languageserver';
import { SafeErrorListener } from './ErrorListeners';
import type { CashScriptError, Point } from 'cashc';
import { gtr, intersects, ltr, satisfies } from 'semver';
import { blankOutComments, canonicaliseImportPath, MAX_IMPORTED_FILES } from '../utils';

type CashcModule = Pick<typeof import('cashc'), 'compileString'>;
type CashscriptCompilerVersion = '0.12' | '0.13' | '0.14';
type SourcePoint = Pick<Point, 'line' | 'column'>;

// Literal import() calls so the bundler includes each compiler version as a lazy chunk
const CASHC_IMPORTERS: Record<CashscriptCompilerVersion, () => Promise<CashcModule>> = {
  '0.12': () => import('cashc-012'),
  '0.13': () => import('cashc-013'),
  '0.14': () => import('cashc'),
};

const CASHC_VERSIONS: Record<CashscriptCompilerVersion, string> = {
  '0.12': '0.12.2',
  '0.13': '0.13.2',
  '0.14': '0.14.0-next.3',
};
const LATEST_COMPILER_VERSION: CashscriptCompilerVersion = '0.14';
// Versions that predate import directives; newer versions take the full linting path
const PRE_IMPORT_COMPILER_VERSIONS: CashscriptCompilerVersion[] = ['0.12', '0.13'];
const SEMVER_OPTIONS = { includePrerelease: true, loose: true };

const cashcModules: Partial<Record<CashscriptCompilerVersion, Promise<CashcModule>>> = {};

function loadCashc(compilerVersion: CashscriptCompilerVersion): Promise<CashcModule> {
  cashcModules[compilerVersion] ??= CASHC_IMPORTERS[compilerVersion]();
  return cashcModules[compilerVersion];
}

export default class CashscriptLinter {
  /**
   * Compiles the document and converts compilation errors to diagnostics. Imports are
   * resolved from disk relative to `documentPath` (undefined for unsaved documents).
   */
  static async getDiagnostics(code: string, documentPath?: string): Promise<Diagnostic[]> {
    const compilerVersion = getCompilerVersion(code);
    const { compileString } = await loadCashc(compilerVersion);

    // Pre-import compilers lint the document verbatim, so a stray `import` is reported
    // as a parse error rather than as a misleading error from inside the imported file
    if (PRE_IMPORT_COMPILER_VERSIONS.includes(compilerVersion)) {
      return compileAndCollectDiagnostics(compileString, code);
    }

    const files = prefetchImportedFiles(code, documentPath);

    // Errors in imported files carry that file's line numbers, so imports are linted
    // separately (reported on their directive) before the main document compiles
    const importDiagnostics = validateImportedFiles(code, files, compileString);
    if (importDiagnostics.length > 0) return importDiagnostics;

    return compileAndCollectDiagnostics(compileString, code, files);
  }
}

function compileAndCollectDiagnostics(
  compileString: CashcModule['compileString'],
  code: string,
  files?: Record<string, string>,
): Diagnostic[] {
  const errorListener = new SafeErrorListener();
  const { lintCode, stubLine } = files ? appendContractStubIfNeeded(code) : { lintCode: code, stubLine: undefined };

  try {
    compileString(lintCode, { errorListener, files });
  } catch (error) {
    if (errorListener.getErrs().length === 0) {
      return [clampDiagnosticToCode(diagnosticFromCompilerError(error), stubLine, code)];
    }
  }

  return errorListener.getErrs().map((diagnostic) => clampDiagnosticToCode(diagnostic, stubLine, code));
}

// Appended to "library" files (top-level definitions without a contract) so semantic
// analysis runs instead of aborting with MissingContractError; unused globals don't error
const CONTRACT_STUB = 'contract CashscriptLinterStub() { function stub() { require(true); } }';

const TYPE_NAME_PATTERN = 'int|bool|string|pubkey|sig|datasig|byte|bytes\\d*';

function appendContractStubIfNeeded(code: string): { lintCode: string; stubLine?: number } {
  const codeWithoutComments = blankOutComments(code);
  const hasContract = /^\s*contract\b/m.test(codeWithoutComments);
  const hasTopLevelDefinitions =
    /^\s*(function|import)\b/m.test(codeWithoutComments) ||
    new RegExp(`^\\s*(${TYPE_NAME_PATTERN})\\s+constant\\b`, 'm').test(codeWithoutComments);
  if (hasContract || !hasTopLevelDefinitions) return { lintCode: code };

  return { lintCode: `${code}\n${CONTRACT_STUB}`, stubLine: code.split('\n').length };
}

// Remaps diagnostics that point into the appended stub onto the document's last line
function clampDiagnosticToCode(diagnostic: Diagnostic, stubLine: number | undefined, code: string): Diagnostic {
  if (stubLine === undefined || diagnostic.range.start.line < stubLine) return diagnostic;

  const lines = code.split('\n');
  let lastLine = lines.length - 1;
  while (lastLine > 0 && lines[lastLine].trim() === '') lastLine -= 1;

  const range: Range = {
    start: { line: lastLine, character: 0 },
    end: { line: lastLine, character: lines[lastLine].length },
  };

  // An error on the (invisible) stub's 'contract' token means the document is incomplete
  const message = diagnostic.message.includes("'contract'") ? 'Unexpected end of file' : diagnostic.message;

  return { ...diagnostic, range, message };
}

interface ImportStatement {
  path: string;
  range: Range;
}

function parseImportStatements(code: string): ImportStatement[] {
  const codeWithoutComments = blankOutComments(code);
  const importRegex = /^([ \t]*)(import\s+(["'])(.*?)\3\s*;)/gm;

  return Array.from(codeWithoutComments.matchAll(importRegex)).map((match) => {
    const line = codeWithoutComments.slice(0, match.index).split('\n').length - 1;
    const startCharacter = match[1].length;

    return {
      path: match[4],
      range: {
        start: { line, character: startCharacter },
        end: { line, character: startCharacter + match[2].length },
      },
    };
  });
}

/**
 * Reads the document's import graph from disk, keyed by canonical path for cashc's
 * `files` option. Unreadable files are left out so the compiler reports them in place.
 */
function prefetchImportedFiles(code: string, documentPath?: string): Record<string, string> {
  const files: Record<string, string> = {};
  if (documentPath === undefined) return files;

  const documentDir = path.dirname(documentPath);
  const queue = parseImportStatements(code).map((statement) => canonicaliseImportPath('.', statement.path));

  while (queue.length > 0 && Object.keys(files).length < MAX_IMPORTED_FILES) {
    const canonicalPath = queue.shift();
    if (canonicalPath === undefined) break;
    if (canonicalPath in files) continue;

    let content: string;
    try {
      content = fs.readFileSync(path.resolve(documentDir, canonicalPath), 'utf8');
    } catch {
      continue;
    }

    files[canonicalPath] = content;
    const importDir = path.posix.dirname(canonicalPath);
    for (const statement of parseImportStatements(content)) {
      queue.push(canonicaliseImportPath(importDir, statement.path));
    }
  }

  return files;
}

/**
 * Lints each directly imported file in isolation, reporting its first error as a
 * diagnostic on the corresponding import directive in the main document.
 */
function validateImportedFiles(
  code: string,
  files: Record<string, string>,
  compileString: CashcModule['compileString'],
): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];

  for (const statement of parseImportStatements(code)) {
    const canonicalPath = canonicaliseImportPath('.', statement.path);
    const source = files[canonicalPath];
    // Unreadable imports are reported (with the right location) by the main compile
    if (source === undefined) continue;

    const [firstError] = compileAndCollectDiagnostics(
      compileString,
      source,
      rekeyFilesRelativeTo(canonicalPath, files),
    );
    if (!firstError) continue;

    const message =
      `Imported file '${statement.path}' contains an error at ` +
      `Line ${firstError.range.start.line + 1}, Column ${firstError.range.start.character}: ${firstError.message}`;
    diagnostics.push(Diagnostic.create(statement.range, message, DiagnosticSeverity.Error));
  }

  return diagnostics;
}

// Re-keys the map relative to the imported file's directory so its own imports resolve;
// the file itself stays in the map so cycles surface as the compiler's cyclic-import error
function rekeyFilesRelativeTo(canonicalPath: string, files: Record<string, string>): Record<string, string> {
  const importDir = path.posix.dirname(canonicalPath);

  return Object.fromEntries(
    Object.entries(files).map(([filePath, content]) => [path.posix.relative(importDir, filePath), content]),
  );
}

function getCompilerVersion(code: string): CashscriptCompilerVersion {
  const pragmaRange = code.match(/^\s*pragma\s+cashscript\s+([^;]+);/m)?.[1]?.trim();
  if (!pragmaRange) return LATEST_COMPILER_VERSION;

  if (supportsPragmaRange('0.14', pragmaRange)) return '0.14';
  if (supportsPragmaRange('0.13', pragmaRange)) return '0.13';
  if (supportsPragmaRange('0.12', pragmaRange)) return '0.12';

  try {
    if (intersects(pragmaRange, '>=0.14.0 <0.15.0', SEMVER_OPTIONS) || ltr('0.14.0', pragmaRange, SEMVER_OPTIONS)) {
      return '0.14';
    }

    if (intersects(pragmaRange, '>=0.13.0 <0.14.0', SEMVER_OPTIONS)) {
      return '0.13';
    }

    if (intersects(pragmaRange, '>=0.12.0 <0.13.0', SEMVER_OPTIONS) || gtr('0.12.0', pragmaRange, SEMVER_OPTIONS)) {
      return '0.12';
    }
  } catch {
    // Let the latest compiler report malformed pragma ranges.
  }

  return LATEST_COMPILER_VERSION;
}

function supportsPragmaRange(compilerVersion: CashscriptCompilerVersion, pragmaRange: string): boolean {
  try {
    return satisfies(CASHC_VERSIONS[compilerVersion], pragmaRange, SEMVER_OPTIONS);
  } catch {
    return false;
  }
}

function diagnosticFromCompilerError(error: unknown): Diagnostic {
  const originalMessage = error instanceof Error ? error.message : String(error);
  const message = withoutLocationSuffix(originalMessage);
  const location = (error as Partial<CashScriptError> | null | undefined)?.node?.location;
  const messageLocation = originalMessage.match(/\bat Line (\d+), Column (\d+)$/);
  const fallbackPoint = messageLocation
    ? { line: Number(messageLocation[1]), column: Number(messageLocation[2]) }
    : { line: 1, column: 0 };

  const range: Range = {
    start: pointToPosition(location?.start ?? fallbackPoint),
    end: pointToPosition(location?.end ?? fallbackPoint),
  };

  return Diagnostic.create(range, message, DiagnosticSeverity.Error);
}

function pointToPosition(point: SourcePoint): Range['start'] {
  return {
    line: Math.max(point.line - 1, 0),
    character: Math.max(point.column, 0),
  };
}

function withoutLocationSuffix(message: string): string {
  return message.replace(/\s+at Line \d+, Column \d+$/, '');
}
