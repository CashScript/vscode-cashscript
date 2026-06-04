import { Diagnostic, DiagnosticSeverity, Range } from 'vscode-languageserver';
import { SafeErrorListener } from './ErrorListeners';
import type { CashScriptError, Point } from 'cashc';

type CashcModule = Pick<typeof import('cashc'), 'compileString'>;
type SourcePoint = Pick<Point, 'line' | 'column'>;

// Preserve import() in CommonJS output so VS Code can load cashc's ESM package.
// Note that VS Code extensions *do* support ESM (since April 2025 / v1.100),
// but Cursor does not support this yet, and we do want to support Cursor.
const importCashc = new Function('return import("cashc")') as () => Promise<CashcModule>;
let cashcModule: Promise<CashcModule>;

async function loadCashc(): Promise<CashcModule> {
  cashcModule ??= importCashc();
  return cashcModule;
}
export default class CashscriptLinter {
  static async getDiagnostics(code: string): Promise<Diagnostic[]> {
    const errorListener = new SafeErrorListener();

    try {
      const { compileString } = await loadCashc();
      compileString(code, { errorListener });
    } catch (error) {
      if (errorListener.getErrs().length === 0) {
        return [diagnosticFromCompilerError(error)];
      }
    }

    return errorListener.getErrs();
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
