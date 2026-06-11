import { Diagnostic, DiagnosticSeverity, Range } from 'vscode-languageserver';
import { SafeErrorListener } from './ErrorListeners';
import type { CashScriptError, Point } from 'cashc';
import { gtr, intersects, ltr, satisfies } from 'semver';

type CashcModule = Pick<typeof import('cashc'), 'compileString'>;
type CashscriptCompilerVersion = '0.12' | '0.13';
type SourcePoint = Pick<Point, 'line' | 'column'>;

const CASHC_PACKAGES: Record<CashscriptCompilerVersion, string> = {
  '0.12': 'cashc-012',
  '0.13': 'cashc',
};

const CASHC_VERSIONS: Record<CashscriptCompilerVersion, string> = {
  '0.12': '0.12.2',
  '0.13': '0.13.1',
};
const SEMVER_OPTIONS = { includePrerelease: true, loose: true };

// Preserve import() in CommonJS output so VS Code can load cashc's ESM package.
// Note that VS Code extensions *do* support ESM (since April 2025 / v1.100),
// but Cursor does not support this yet, and we do want to support Cursor.
const importCashc = new Function('specifier', 'return import(specifier)') as (
  specifier: string,
) => Promise<CashcModule>;
const cashcModules: Partial<Record<CashscriptCompilerVersion, Promise<CashcModule>>> = {};

function loadCashc(compilerVersion: CashscriptCompilerVersion): Promise<CashcModule> {
  cashcModules[compilerVersion] ??= importCashc(CASHC_PACKAGES[compilerVersion]);
  return cashcModules[compilerVersion];
}

export default class CashscriptLinter {
  static async getDiagnostics(code: string): Promise<Diagnostic[]> {
    const errorListener = new SafeErrorListener();
    const compilerVersion = getCompilerVersion(code);

    try {
      const { compileString } = await loadCashc(compilerVersion);
      compileString(code, { errorListener });
    } catch (error) {
      if (errorListener.getErrs().length === 0) {
        return [diagnosticFromCompilerError(error)];
      }
    }

    return errorListener.getErrs();
  }
}

function getCompilerVersion(code: string): CashscriptCompilerVersion {
  const pragmaRange = code.match(/^\s*pragma\s+cashscript\s+([^;]+);/m)?.[1]?.trim();
  if (!pragmaRange) return '0.13';

  if (supportsPragmaRange('0.13', pragmaRange)) return '0.13';
  if (supportsPragmaRange('0.12', pragmaRange)) return '0.12';

  try {
    if (intersects(pragmaRange, '>=0.13.0 <0.14.0', SEMVER_OPTIONS) || ltr('0.13.0', pragmaRange, SEMVER_OPTIONS)) {
      return '0.13';
    }

    if (intersects(pragmaRange, '>=0.12.0 <0.13.0', SEMVER_OPTIONS) || gtr('0.12.0', pragmaRange, SEMVER_OPTIONS)) {
      return '0.12';
    }
  } catch {
    // Let the latest compiler report malformed pragma ranges.
  }

  return '0.13';
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
