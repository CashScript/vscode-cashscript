import * as vscode from 'vscode';
import { LANGUAGE } from './LanguageDesc';

class CashscriptHoverProvider implements vscode.HoverProvider {
  re = /[a-zA-Z0-9]+/g; // regex to get selected word
  constructor(private channel: vscode.OutputChannel = null) { }

  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
  ): vscode.ProviderResult<vscode.Hover> {
    let range = document.getWordRangeAtPosition(position, this.re);
    let word = document.getText(range);

    const varTypes = this.getVariableTypes(document, word); // fix this
    if (varTypes) return new vscode.Hover(varTypes, range);

    const annotation = this.getHoverAnnotation(word);
    if (annotation) return new vscode.Hover(annotation, range);

    const memberHovers = this.getMemberHovers(document, word);
    if (memberHovers) return new vscode.Hover(memberHovers, range);

    const miscel = this.getMiscellaneousHovers(document, position);
    if (miscel) return new vscode.Hover(miscel, range);

    return null;
  }

  getHoverAnnotation(word: string): vscode.MarkdownString[] {
    const data = LANGUAGE[word] || null;
    if (!data) return null;

    return [new vscode.MarkdownString().appendCodeblock(data.code), new vscode.MarkdownString(data.codeDesc)];
  }

  getMiscellaneousHovers(document: vscode.TextDocument, position: vscode.Position): vscode.MarkdownString[] {
    const reg = /(contract|function)\s+(\w+)\s*\(.*\)/;
    let range = document.getWordRangeAtPosition(position, reg);
    let word = document.getText(range);
    if (word.includes('\n')) return null;

    return [new vscode.MarkdownString().appendCodeblock(word)];
  }

  /*
   * Very bad way to get type annotations, better option: custom Tree Builder
   */
  getVariableTypes(document: vscode.TextDocument, targetWord: string): vscode.MarkdownString[] {
    const type = this.getVariableType(targetWord, document);
    if (!type) return null;
    return [new vscode.MarkdownString().appendCodeblock(`${type} ${targetWord}`)];
  }

  /**
   * Gets the data type of a variable
   *
   * @param variable the variable to be seached for
   * @param document the entire text document
   * @returns a string of the data type
   */
  getVariableType(variable: string, document: vscode.TextDocument) {
    const text = document.getText();
    const matches = text.match(new RegExp(`\\b(int|bool|string|pubkey|sig|datasig|byte|bytes\\d*)\\s+${variable}\\b`)); //regex still incomplete
    if (!matches) return null;
    return matches[1];
  }

  getMemberHovers(document: vscode.TextDocument, word: string) {
    if (word === 'split') {
      return [
        new vscode.MarkdownString().appendCodeblock('[s1, s2] sequence.split(int i)'),
        new vscode.MarkdownString(
          'Splits the sequence at the specified index and returns a tuple with the two resulting sequences.',
        ),
      ];
    } else if (word === 'reverse') {
      return [
        new vscode.MarkdownString().appendCodeblock('any sequence.reverse()'),
        new vscode.MarkdownString('Reverses the sequence.'),
      ];
    } else if (word === 'slice') {
      return [
        new vscode.MarkdownString().appendCodeblock('any sequence.slice(int start, int end)'),
        new vscode.MarkdownString('Returns a new sequence containing the elements from start to end.'),
      ];
    }

    return null;
  }
}

export default CashscriptHoverProvider;
