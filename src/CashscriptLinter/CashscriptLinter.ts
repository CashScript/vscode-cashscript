import { CharStream, CommonTokenStream } from 'antlr4';
import { Diagnostic } from 'vscode-languageserver';
import { SafeErrorListener, SafeErrorStrategy } from './ErrorListeners';
import CashScriptLexer from './grammar/CashScriptLexer';
import CashScriptParser from './grammar/CashScriptParser';

export default class CashscriptLinter {
  static getDiagnostics(code: string): Diagnostic[] {
    const errListener = new SafeErrorListener();

    const inputStream = new CharStream(code);
    const lexer = new CashScriptLexer(inputStream);
    lexer.removeErrorListeners();
    lexer.addErrorListener(errListener);

    const tokenStream = new CommonTokenStream(lexer);
    const parser = new CashScriptParser(tokenStream);
    parser._errHandler = new SafeErrorStrategy();
    parser.removeErrorListeners();
    parser.addErrorListener(errListener);
    const parseTree = parser.sourceFile();

    return errListener.getErrs();
  }
}
