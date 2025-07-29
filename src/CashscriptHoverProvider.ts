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
    const reg = /(contract|function)\s+(\w+)\s*\([\s\S]*?\)/g;
    const range = getMultilineRegexRangeAroundPosition(document, position, reg);
    if (!range) return null;

    const signature = stripCommentsAndFlatten(document.getText(range));
    return [new vscode.MarkdownString().appendCodeblock(signature)];
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

/**
 * Finds the range of a multiline regex match around a given position.
 *
 * @param document The TextDocument to scan.
 * @param position The position where the match should surround.
 * @param pattern The RegExp pattern (must include the `g` flag if reused).
 * @param maxLines How many lines above and below to scan (default: 20 total).
 * @returns A Range if a match is found that includes the position, otherwise undefined.
 */
export function getMultilineRegexRangeAroundPosition(
  document: vscode.TextDocument,
  position: vscode.Position,
  pattern: RegExp,
  maxLines: number = 20
): vscode.Range | undefined {
  const halfRange = Math.floor(maxLines / 2);
  const startLine = Math.max(0, position.line - halfRange);
  const endLine = Math.min(document.lineCount - 1, position.line + halfRange);

  const lines: string[] = [];
  for (let i = startLine; i <= endLine; i++) {
    lines.push(document.lineAt(i).text);
  }

  const joinedText = lines.join('\n');
  const baseOffset = document.offsetAt(new vscode.Position(startLine, 0));

  // Reset regex state if necessary
  pattern.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(joinedText)) !== null) {
    const matchStartOffset = baseOffset + match.index;
    const matchEndOffset = matchStartOffset + match[0].length;

    const matchStart = document.positionAt(matchStartOffset);
    const matchEnd = document.positionAt(matchEndOffset);

    const matchRange = new vscode.Range(matchStart, matchEnd);

    if (matchRange.contains(position)) {
      return matchRange;
    }

    // Prevent infinite loops with zero-length matches
    if (match.index === pattern.lastIndex) {
      pattern.lastIndex++;
    }
  }

  return undefined;
}

/**
 * Removes comments and flattens a multiline function signature into a single line.
 *
 * @param input The input string, e.g., a function signature match.
 * @returns A cleaned, one-line string.
 */
export function stripCommentsAndFlatten(input: string): string {
  // Remove multiline block comments (/* ... */)
  let output = input.replace(/\/\*[\s\S]*?\*\//g, '');

  // Remove single-line comments (//...)
  output = output.replace(/\/\/.*$/gm, '');

  // Replace newlines and excessive whitespace with a single space
  output = output.replace(/\s+/g, ' ').trim();

  return output;
}
