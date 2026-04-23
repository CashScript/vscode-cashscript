import * as vscode from 'vscode';
import { Range, CompletionItem, CompletionItemKind } from 'vscode';
import { DOT_COMPLETIONS, GLOBAL_FUNCTIONS } from './LanguageDesc';

const SEQUENCE_MEMBERS: CompletionItem[] = [
  { label: 'length', kind: CompletionItemKind.Field },
  { label: 'reverse', kind: CompletionItemKind.Method },
  { label: 'split', kind: CompletionItemKind.Method },
  { label: 'slice', kind: CompletionItemKind.Method },
];

function isSequenceType(type: string): boolean {
  return type === 'bytes' || type === 'string' || /^bytes\d+$/.test(type) || type === 'byte';
}

function getCallReturnType(fn: string): string | null {
  // Type-cast call: the "function" is a type keyword or unsafe cast.
  const castMatch = fn.match(/^(unsafe_)?(int|bool|string|pubkey|sig|datasig|byte|bytes\d*|bytes)$/);
  if (castMatch) {
    const [, unsafe, baseType] = castMatch;
    if (!unsafe) return baseType;
    if (baseType === 'byte') return 'bytes1';
    return baseType;
  }

  const entry = (GLOBAL_FUNCTIONS as Record<string, { code: string } | undefined>)[fn];
  if (!entry) return null;
  const match = entry.code.match(/^(\w+)\s+/);
  return match ? match[1] : null;
}

export default class CashscriptCompletionProvider implements vscode.CompletionItemProvider {
  text = '';
  offset = 0;
  currentIndex = 0;
  doc: vscode.TextDocument;
  pos: vscode.Position;

  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.CompletionContext,
  ): vscode.ProviderResult<vscode.CompletionItem[]> {
    // throw new Error('Method not implemented.');
    this.doc = document;
    this.pos = position;
    this.text = document.getText() || '';
    this.offset = document.offsetAt(position) || 0;
    this.currentIndex = 0;
    this.variableTypeMap = null;

    const completions: CompletionItem[] = this.getAllCompletions();
    return completions;
  }

  getAllCompletions(): CompletionItem[] {
    let completions: CompletionItem[] = [];

    if (this.isDot()) {
      return this.getDotCompletions();
    }

    completions = completions.concat(this.getVarCompletions());
    // completions = completions.concat(this.getConditionalCompletions());
    completions = completions.concat(this.getControlCompletions());
    completions = completions.concat(this.getGlobalFunctionCompletions());
    completions = completions.concat(this.getOutputCompletions());
    completions = completions.concat(this.getTypesCompletions());
    completions = completions.concat(this.getGlobalConstantsCompletions());

    return completions;
  }

  protected getCharRange(begin: number, end: number) {
    return this.text.substring(begin, end);
  }

  protected isDot(): boolean {
    const offset: number = this.doc?.offsetAt(this.pos) || 0;
    const t = this.getCharRange(offset - 1, offset);
    if (t === '.') return true;
    return false;
  }

  protected getDotCompletions(): CompletionItem[] {
    const range: Range = new Range(new vscode.Position(this.pos.line, 0), this.pos);
    const lineText = this.doc.getText(range);
    const beforeDot = lineText.replace(/\.$/, '');

    // 1. Keyword-based completions (tx, this, console, inputs, outputs)
    const kwMatch = beforeDot.match(/(\w+)(\[.+\])?$/);
    if (kwMatch) {
      let keyword = kwMatch[1];
      if (kwMatch[2]) keyword += '_indexed';
      if (DOT_COMPLETIONS[keyword]) return DOT_COMPLETIONS[keyword];
    }

    // 2. Type-based completions for bytes / string / bytesN
    const type = this.resolveExpressionType(beforeDot);
    if (type && isSequenceType(type)) return SEQUENCE_MEMBERS;

    return [];
  }

  protected resolveExpressionType(textBeforeDot: string): string | null {
    const text = textBeforeDot.trimEnd();
    if (!text) return null;

    // String literal
    if (/"[^"]*"$/.test(text) || /'[^']*'$/.test(text)) return 'string';

    // Hex literal
    if (/\b0x[0-9a-fA-F]*$/.test(text)) return 'bytes';

    // Boolean literal
    if (/\b(true|false)$/.test(text)) return 'bool';

    // Decimal literal (CashScript has no floats)
    if (/(^|[^.\w])\d+(_\d+)*([eE]\d+)?$/.test(text)) return 'int';

    // Tuple index: `expr[N]`
    const indexMatch = text.match(/^(.*)\[[^\]]*\]$/);
    if (indexMatch) {
      // `split(...)[N]` returns the same kind of sequence as the receiver.
      // Without a full parser we approximate to bytes (covers the common case).
      const inner = indexMatch[1];
      if (/\.split\s*\([^()]*\)$/.test(inner)) return 'bytes';
      return null;
    }

    // Function call: `fn(...)`
    if (text.endsWith(')')) {
      // Naive: match a flat argument list (no nested parens). Good enough for
      // most source code; deeper nesting falls back to `null`.
      const callMatch = text.match(/(\w+)\s*\([^()]*\)$/);
      if (callMatch) return getCallReturnType(callMatch[1]);
      return null;
    }

    // Cast: `type(...)` — already handled by the function-call branch above
    // because types like `bytes` / `int` are in neither `GLOBAL_FUNCTIONS` nor
    // our type map; add dedicated handling.
    // (Intentionally no-op — casts return the cast-to type, which we infer via
    //  the member-chain case below if needed.)

    // Identifier → variable
    const idMatch = text.match(/(\w+)$/);
    if (idMatch) {
      return this.getVariableTypeMap()[idMatch[1]] ?? null;
    }

    return null;
  }

  protected variableTypeMap: Record<string, string> | null = null;

  protected getVariableTypeMap(): Record<string, string> {
    if (this.variableTypeMap) return this.variableTypeMap;
    const code = stripComments(this.text);
    const re = /\b(int|bool|string|pubkey|sig|datasig|byte|bytes\d*)\s+(?:constant\s+)?(\w+)/g;
    const map: Record<string, string> = {};
    for (const m of code.matchAll(re)) {
      map[m[2]] = m[1];
    }
    this.variableTypeMap = map;
    return map;
  }

  protected getVarCompletions(): CompletionItem[] {
    const re = /(int|bool|string|pubkey|sig|datasig|byte|bytes|bytes[0-9]+)\s+(?:constant\s+)?(\w+)/g;
    const codeOnly = stripComments(this.text);
    const completions: CompletionItem[] = [];
    const seen = new Set<string>();
    for (const m of codeOnly.matchAll(re)) {
      if (seen.has(m[2])) continue;
      seen.add(m[2]);
      completions.push({
        label: m[2],
        kind: CompletionItemKind.Variable,
      });
    }

    return completions;
  }

  protected getControlCompletions(): CompletionItem[] {
    const words = ['pragma', 'cashscript', 'if', 'else', 'do', 'while', 'for'];
    const completions = [];
    for (let i = 0; i < words.length; i++) {
      this.currentIndex += 1;
      completions.push(new CompletionItem(words[i]));
    }
    return completions;
  }

  protected getGlobalFunctionCompletions(): CompletionItem[] {
    return [
      {
        label: 'abs',
        detail: 'int abs(int a): Returns the absolute value of argument a.',
        insertText: 'abs',
        // insertTextFormat: 2,
      },
      {
        label: 'min',
        detail: 'int min(int a, int b): Returns the minimum value of arguments `a` and `b`.',
        insertText: 'min',
        // insertTextFormat:2
      },
      {
        label: 'max',
        detail: 'int max(int a, int b): Returns the maximum value of arguments `a` and `b`.',
        insertText: 'max',
        // insertTextFormat:2
      },
      {
        label: 'within',
        detail: 'bool within(int x, int lower, int upper): Returns `true` if and only if `x >= lower && x < upper`.',
        insertText: 'within',
        // insertTextFormat:2
      },
      {
        label: 'ripemd160',
        detail: 'bytes20 ripemd160(any x): Returns the SHA-1 hash of argument `x`.',
        insertText: 'ripemd160',
        // insertTextFormat:2
      },
      {
        label: 'sha256',
        detail: 'bytes32 sha256(any x): Returns the SHA-256 hash of argument `x`.',
        insertText: 'sha256',
        // insertTextFormat:2
      },
      {
        label: 'sha1',
        detail: 'bytes20 sha1(any x): Returns the SHA-1 hash of argument `x`.',
        insertText: 'sha1',
        // insertTextFormat:2
      },
      {
        label: 'hash160',
        detail: 'bytes20 hash160(any x): Returns the RIPEMD-160 hash of the SHA-256 hash of argument `x`.',
        insertText: 'hash160',
        // insertTextFormat:2
      },
      {
        label: 'hash256',
        detail: 'bytes32 hash256(any x): bytes32 hash256(any x)',
        insertText: 'hash256',
        // insertTextFormat:2
      },
      {
        label: 'checkSig',
        detail:
          'bool checksig(sig s, pubkey pk): Checks that transaction signature `s` is valid for the current transaction and matches with public key `pk`.',
        insertText: 'checkSig',
        // insertTextFormat:2
      },
      {
        label: 'checkMultiSig',
        detail:
          'bool checkMultiSig(sig[] sigs, pubkey[] pks): Performs a multi-signature check using a list of transaction signatures and public keys.',
        insertText: 'checkMultiSig',
        // insertTextFormat:2
      },
      {
        label: 'checkDataSig',
        detail:
          'bool checkDataSig(datasig s, bytes msg, pubkey pk): Checks that sig `s` is a valid signature for message `msg` and matches with public key `pk`.',
        insertText: 'checkDataSig',
        // insertTextFormat:2
      },
      {
        label: 'require',
        detail:
          'require(bool expression, string debugMessage?): Puts a constraint on the `expression` failing the script execution if expression resolves to false. `debugMessage` will be present in the error log of the debug evaluation of the script. Has no effect in production.',
        insertText: 'require',
        // insertTextFormat:2
      },
      {
        label: 'console.log',
        detail:
          'console.log(...args): Logs primitve data or variable values to debug console. Has no effect in production.',
        insertText: 'console.log',
        // insertTextFormat:2
      },
      {
        label: 'date',
        detail: 'int date(string dateString): Converts date string to timestamp',
        insertText: 'date',
        // insertTextFormat:2
      },
      {
        label: 'toPaddedBytes',
        detail:
          'bytes toPaddedBytes(int value, int size): Converts an integer to a zero-padded bytes sequence of length `size`.',
        insertText: 'toPaddedBytes',
      },
    ];
  }

  protected getOutputCompletions(): CompletionItem[] {
    const words = ['LockingBytecodeP2PKH', 'LockingBytecodeP2SH20', 'LockingBytecodeP2SH32', 'LockingBytecodeNullData'];
    const completions = [];
    for (let i = 0; i < words.length; i++) {
      this.currentIndex += 1;
      completions.push({
        label: words[i],
        kind: CompletionItemKind.Keyword,
        data: i + 1,
      });
    }
    return completions;
  }

  protected getTypesCompletions(): CompletionItem[] {
    const words = [
      'int',
      'bool',
      'string',
      'byte',
      'bytes',
      'pubkey',
      'sig',
      'datasig',
      'true',
      'false',
      'constant',
      'unsafe_int',
      'unsafe_bool',
      'unsafe_byte',
      'unsafe_bytes',
    ];
    const completions = [];
    for (let i = 0; i < words.length; i++) {
      this.currentIndex += 1;
      completions.push({
        label: words[i],
        kind: CompletionItemKind.Keyword,
        data: i + 1,
      });
    }
    return completions;
  }

  protected getGlobalConstantsCompletions(): CompletionItem[] {
    const words = [
      'sats',
      'satoshis',
      'finney',
      'bit',
      'bitcoin',
      'seconds',
      'minutes',
      'hours',
      'days',
      'weeks',
      'tx',
    ];
    const completions = [];
    for (let i = 0; i < words.length; i++) {
      this.currentIndex += 1;
      completions.push({
        label: words[i],
        kind: CompletionItemKind.Keyword,
        data: i + 1,
      });
    }
    return completions;
  }
}

/**
 * Replace comment contents with spaces so byte offsets stay aligned while
 * removing any identifiers that live inside `//` or `/* *\/` comments.
 */
function stripComments(text: string): string {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/\/\/[^\n]*/g, (m) => m.replace(/[^\n]/g, ' '));
}
