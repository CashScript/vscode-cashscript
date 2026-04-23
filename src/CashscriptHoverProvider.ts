import * as vscode from 'vscode';
import { LANGUAGE, TYPES } from './LanguageDesc';

class CashscriptHoverProvider implements vscode.HoverProvider {
  re = /[a-zA-Z0-9_]+/g; // regex to get selected word
  constructor(private channel: vscode.OutputChannel = null) { }

  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
  ): vscode.ProviderResult<vscode.Hover> {
    let range = document.getWordRangeAtPosition(position, this.re);
    let word = document.getText(range);

    const dotted = getDottedWord(document, position, range, word);
    if (dotted) {
      const annotation = this.getHoverAnnotation(dotted.word);
      if (annotation) return new vscode.Hover(annotation, dotted.range);
    }

    const isTypeDeclaration = !isFollowedByOpenParen(document, range);
    if (isTypeDeclaration) {
      const typeAnnotation = this.getTypeAnnotation(word);
      if (typeAnnotation) return new vscode.Hover(typeAnnotation, range);
    }

    const varTypes = this.getVariableTypes(document, word); // fix this
    if (varTypes) return new vscode.Hover(varTypes, range);

    const annotation = this.getHoverAnnotation(word);
    if (annotation) return new vscode.Hover(annotation, range);

    const miscel = this.getMiscellaneousHovers(document, position);
    if (miscel) return new vscode.Hover(miscel, range);

    return null;
  }

  getTypeAnnotation(word: string): vscode.MarkdownString[] {
    const boundedBytesMatch = word.match(/^bytes(\d+)$/);
    const lookupKey = boundedBytesMatch ? 'bytesN' : word;
    const data = TYPES[lookupKey] || null;
    if (!data) return null;

    const code = boundedBytesMatch ? data.code.replace(/\bbytesN\b/g, word) : data.code;
    const codeDesc = boundedBytesMatch
      ? data.codeDesc.replace(/\bN bytes\b/g, `${boundedBytesMatch[1]} bytes`)
      : data.codeDesc;

    return [new vscode.MarkdownString().appendCodeblock(code), new vscode.MarkdownString(codeDesc)];
  }

  getHoverAnnotation(word: string): vscode.MarkdownString[] {
    const boundedBytesMatch = word.match(/^(unsafe_)?bytes(\d+)$/);
    const lookupKey = boundedBytesMatch ? `${boundedBytesMatch[1] ?? ''}bytesN` : word;

    const data = LANGUAGE[lookupKey] || null;
    if (!data) return null;

    let code = data.code;
    let codeDesc = data.codeDesc;
    if (boundedBytesMatch) {
      const bareBytes = `bytes${boundedBytesMatch[2]}`;
      // Replace the cast-name token first so the bare replacement doesn't clobber it.
      code = code.replace(/unsafe_bytesN/g, word).replace(/bytesN/g, bareBytes);
      codeDesc = codeDesc.replace(/\bN bytes\b/g, `${boundedBytesMatch[2]} bytes`);
    }

    return [new vscode.MarkdownString().appendCodeblock(code), new vscode.MarkdownString(codeDesc)];
  }

  getMiscellaneousHovers(document: vscode.TextDocument, position: vscode.Position): vscode.MarkdownString[] {
    const reg = /(contract|function)\s+(\w+)\s*\([\s\S]*?\)/g;
    const range = findEnclosingMatch(document, position, reg);
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
    const matches = text.match(
      new RegExp(
        `\\b(int|bool|string|pubkey|sig|datasig|byte|bytes\\d*|unsafe_int|unsafe_bool|unsafe_byte|unsafe_bytes\\d*)\\s+(?:constant\\s+)?${variable}\\b`,
      ),
    ); //regex still incomplete
    if (!matches) return null;
    return matches[1];
  }

}

/**
 * True when the character immediately after the word range (ignoring spaces) is `(`.
 * Used to distinguish a type-cast (e.g. `bytes(x)`) from a type-declaration (`bytes ag = ...`).
 */
function isFollowedByOpenParen(document: vscode.TextDocument, range: vscode.Range | undefined): boolean {
  if (!range) return false;
  const lineText = document.lineAt(range.end.line).text;
  const after = lineText.slice(range.end.character);
  return /^\s*\(/.test(after);
}

/**
 * If the hovered word is preceded by `prefix.` (e.g. `console.log`), return the
 * combined dotted identifier and its range. Returns null when the surrounding
 * context isn't a dotted identifier.
 */
function getDottedWord(
  document: vscode.TextDocument,
  position: vscode.Position,
  range: vscode.Range | undefined,
  word: string,
): { word: string; range: vscode.Range } | null {
  if (!range) return null;

  const lineText = document.lineAt(position.line).text;
  const before = lineText.slice(0, range.start.character);
  // Walk backwards through consecutive `identifier.` or `identifier[...].` segments
  // to support paths like `tx.inputs.length` and `tx.inputs[0].value`.
  const prefixMatch = before.match(/((?:[A-Za-z_]\w*(?:\[[^\]]*\])?\.)+)$/);
  if (!prefixMatch) return null;

  const prefix = prefixMatch[1];
  // Normalise array indices to `[]` so lookups hit a single generic entry.
  const normalisedPrefix = prefix.replace(/\[[^\]]*\]/g, '[]');
  const combined = `${normalisedPrefix}${word}`;
  const startChar = range.start.character - prefix.length;
  const combinedRange = new vscode.Range(
    new vscode.Position(position.line, startChar),
    range.end,
  );
  return { word: combined, range: combinedRange };
}

export default CashscriptHoverProvider;

/**
 * Scans the entire document for matches of `pattern` and returns the range of
 * the first match that contains `position`. Comments are blanked out first so
 * syntactically-significant characters inside comments (e.g. a `)` inside a
 * `// ...` line) don't terminate multi-line signature matches early.
 */
export function findEnclosingMatch(
  document: vscode.TextDocument,
  position: vscode.Position,
  pattern: RegExp,
): vscode.Range | undefined {
  const text = blankOutComments(document.getText());

  pattern.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) !== null) {
    const start = document.positionAt(match.index);
    const end = document.positionAt(match.index + match[0].length);
    const range = new vscode.Range(start, end);

    if (range.contains(position)) {
      return range;
    }

    if (match.index === pattern.lastIndex) {
      pattern.lastIndex++;
    }
  }

  return undefined;
}

/**
 * Replace every character inside `//` line comments and `/* *\/` block comments
 * with a space (newlines preserved) so byte offsets stay aligned with the
 * original document while the comment content itself is invisible to regexes.
 */
function blankOutComments(text: string): string {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/\/\/[^\n]*/g, (m) => m.replace(/[^\n]/g, ' '));
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
