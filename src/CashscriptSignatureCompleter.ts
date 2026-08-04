import * as vscode from 'vscode';
import { LANGUAGE, TYPECASTS } from './LanguageDesc';
import { findUserFunction } from './UserFunctions';
import { documentFilePath } from './utils';

class CashscriptSignatureCompleter implements vscode.SignatureHelpProvider {
  re = /([a-zA-Z0-9]+)\(/g; // regex to get selected word
  constructor(private channel?: vscode.OutputChannel) {}

  provideSignatureHelp(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.SignatureHelpContext,
  ): vscode.ProviderResult<vscode.SignatureHelp> {
    let range = document.getWordRangeAtPosition(position, this.re);
    if (!range) return null;
    let word = document.getText(range).slice(0, -1); // removes the '('

    const data = LANGUAGE[word] || TYPECASTS[word];
    if (data) {
      const sh = new vscode.SignatureHelp();
      sh.signatures = [
        new vscode.SignatureInformation(data.codeDesc, new vscode.MarkdownString().appendCodeblock(data.code)),
      ];
      return sh;
    }

    return this.getUserFunctionSignatureHelp(document, word);
  }

  // Signature help for user-defined functions, both local and imported (CashScript 0.14+)
  getUserFunctionSignatureHelp(document: vscode.TextDocument, word: string): vscode.SignatureHelp | null {
    const userFunction = findUserFunction(document.getText(), word, documentFilePath(document));
    if (!userFunction) return null;

    const documentation = new vscode.MarkdownString().appendCodeblock(userFunction.signature);
    if (userFunction.importedFrom) {
      documentation.appendMarkdown(`Imported from \`${userFunction.importedFrom}\``);
    }

    const signature = new vscode.SignatureInformation(userFunction.signature, documentation);
    signature.parameters = userFunction.parameters.map((parameter) => new vscode.ParameterInformation(parameter));

    const sh = new vscode.SignatureHelp();
    sh.signatures = [signature];
    return sh;
  }
}

export default CashscriptSignatureCompleter;
