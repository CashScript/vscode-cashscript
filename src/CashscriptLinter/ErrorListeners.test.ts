import { SafeErrorListener, SafeErrorStrategy } from './ErrorListeners';
import { Diagnostic, DiagnosticSeverity, Range } from 'vscode-languageserver';
import { RecognitionException, Recognizer } from 'antlr4';

describe('SafeErrorListener', () => {
  let errorListener: SafeErrorListener;

  beforeEach(() => {
    errorListener = new SafeErrorListener();
  });

  test('should create a singleton instance', () => {
    expect(SafeErrorListener.INSTANCE).toBeInstanceOf(SafeErrorListener);
    expect(SafeErrorListener.INSTANCE).toBe(SafeErrorListener.INSTANCE); // Same instance
  });

  test('should initialize with empty errors array', () => {
    expect(errorListener.getErrs()).toEqual([]);
  });

  test('should add diagnostic on syntaxError', () => {
    const recognizer = {} as Recognizer<any>;
    const offendingSymbol = null;
    const line = 5;
    const charPositionInLine = 10;
    const message = 'test error message';
    const exception = undefined;

    errorListener.syntaxError(recognizer, offendingSymbol, line, charPositionInLine, message, exception);

    const diagnostics = errorListener.getErrs();
    expect(diagnostics).toHaveLength(1);

    const diagnostic = diagnostics[0];
    expect(diagnostic.message).toBe('Test error message'); // Capitalized
    expect(diagnostic.severity).toBe(DiagnosticSeverity.Error);
    
    const expectedRange: Range = {
      start: { line: line - 1, character: charPositionInLine }, // Line is 0-indexed
      end: { line: line - 1, character: charPositionInLine }
    };
    expect(diagnostic.range).toEqual(expectedRange);
  });

  test('should capitalize first letter of error message', () => {
    const recognizer = {} as Recognizer<any>;
    const offendingSymbol = null;
    const line = 1;
    const charPositionInLine = 0;
    const message = 'lowercase error message';
    const exception = undefined;

    errorListener.syntaxError(recognizer, offendingSymbol, line, charPositionInLine, message, exception);

    const diagnostics = errorListener.getErrs();
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toBe('Lowercase error message');
  });

  test('should handle multiple syntax errors', () => {
    const recognizer = {} as Recognizer<any>;
    
    // Add first error
    errorListener.syntaxError(recognizer, null, 1, 5, 'first error', undefined);
    // Add second error
    errorListener.syntaxError(recognizer, null, 2, 10, 'second error', undefined);

    const diagnostics = errorListener.getErrs();
    expect(diagnostics).toHaveLength(2);

    expect(diagnostics[0].message).toBe('First error');
    expect(diagnostics[0].range.start.line).toBe(0); // 1 - 1
    expect(diagnostics[0].range.start.character).toBe(5);

    expect(diagnostics[1].message).toBe('Second error');
    expect(diagnostics[1].range.start.line).toBe(1); // 2 - 1
    expect(diagnostics[1].range.start.character).toBe(10);
  });
});

describe('SafeErrorStrategy', () => {
  test('should create instance', () => {
    const strategy = new SafeErrorStrategy();
    expect(strategy).toBeInstanceOf(SafeErrorStrategy);
  });

  test('should have sync method that returns void/undefined', () => {
    const strategy = new SafeErrorStrategy();
    const parser = {} as any; // Mock parser
    
    const result = strategy.sync(parser);
    expect(result).toBeUndefined(); // sync method returns nothing since it's void
  });
});