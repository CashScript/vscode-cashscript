import { Diagnostic, DiagnosticSeverity, Range } from 'vscode-languageserver';

export class SafeErrorListener {
  private errs: Diagnostic[] = [];

  getErrs(): Diagnostic[] {
    return this.errs;
  }

  syntaxError<T>(
    _recognizer: unknown,
    _offendingSymbol: T,
    line: number,
    charPositionInLine: number,
    message: string,
    _e?: unknown,
  ): void {
    const capitalisedMessage = message.charAt(0).toUpperCase() + message.slice(1);

    const range: Range = {
      start: {
        line: line - 1,
        character: charPositionInLine,
      },
      end: {
        line: line - 1,
        character: charPositionInLine,
      },
    };

    const diag = Diagnostic.create(range, capitalisedMessage, DiagnosticSeverity.Error);
    this.errs.push(diag);
  }
}
