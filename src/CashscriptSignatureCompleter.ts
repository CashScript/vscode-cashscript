import * as vscode from 'vscode';
import { LANGUAGE, TYPECASTS } from './LanguageDesc';

class CashscriptSignatureCompleter implements vscode.SignatureHelpProvider {
  re = /([a-zA-Z0-9]+)\(/g; // regex to get selected word
  constructor(private channel: vscode.OutputChannel = null) {}

  provideSignatureHelp(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.SignatureHelpContext,
  ): vscode.ProviderResult<vscode.SignatureHelp> {
    let range = document.getWordRangeAtPosition(position, this.re);
    let word = document.getText(range).slice(0, -1); // removes the '('

    const sh = new vscode.SignatureHelp();
    const data = LANGUAGE[word] || TYPECASTS[word];
    sh.signatures = [
      new vscode.SignatureInformation(data.codeDesc, new vscode.MarkdownString().appendCodeblock(data.code)),
    ];
    return sh;
  }
}

export default CashscriptSignatureCompleter;
