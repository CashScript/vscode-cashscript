import * as vscode from 'vscode';
import { Range, CompletionItem, CompletionItemKind } from 'vscode';
import { DOT_COMPLETIONS, GLOBAL_FUNCTIONS } from './LanguageDesc';
import { collectUserSymbols, UserSymbols } from './UserFunctions';
import { blankOutComments, blankOutStrings, documentFilePath } from './utils';

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
    this.userSymbols = null;

    const completions: CompletionItem[] = this.getAllCompletions();
    return completions;
  }

  getAllCompletions(): CompletionItem[] {
    if (this.isDot()) {
      return this.getDotCompletions();
    }

    // Only offer the completion groups that are syntactically valid at the cursor
    const context = this.getCursorContext();
    switch (context.kind) {
      case 'returns-clause':
        return this.getKeywordCompletions(['returns']);
      case 'header-trailing':
        return [];
      case 'type-list':
        // Inside `returns (...)`: only type names are valid
        return this.getKeywordCompletions(TYPE_NAMES);
      case 'parameter-list':
        return this.getKeywordCompletions([...TYPE_NAMES, ...MODIFIERS]);
      case 'contract-body':
        return this.getKeywordCompletions(['function']);
      case 'top-level':
        // Constant definitions and their initialisers (no casts or function calls)
        return [
          ...this.getKeywordCompletions(['pragma', 'cashscript', 'import', 'contract', 'function']),
          ...this.getKeywordCompletions([...TYPE_NAMES, 'constant', ...BOOLEAN_LITERALS]),
          ...this.getUserConstantCompletions(),
          ...this.getUnitCompletions(),
        ];
      case 'function-body':
        return [
          ...this.getVarCompletions(),
          ...this.getKeywordCompletions(
            // `return` is only valid inside top-level (reusable) functions
            context.insideContract ? STATEMENT_KEYWORDS : [...STATEMENT_KEYWORDS, 'return'],
          ),
          ...this.getGlobalFunctionCompletions(),
          ...this.getUserFunctionCompletions(),
          ...this.getUserConstantCompletions(),
          ...this.getOutputCompletions(),
          ...this.getKeywordCompletions([...TYPE_NAMES, ...MODIFIERS, ...BOOLEAN_LITERALS, ...UNSAFE_CASTS]),
          ...this.getUnitCompletions(),
          ...this.getKeywordCompletions(['tx', 'this']),
        ];
    }
  }

  /**
   * Classifies the cursor position by tracking unmatched braces / parens in the
   * (comment- and string-blanked) text before it, and what opened each of them.
   */
  protected getCursorContext(): CursorContext {
    const textBefore = blankOutStrings(blankOutComments(this.text.slice(0, this.offset)));
    // Ignore the partially typed word so `function f() ret` classifies like `function f() `
    const beforeWord = textBefore.replace(/\w*$/, '');

    const braceOpeners: number[] = [];
    const parenOpeners: number[] = [];
    for (let i = 0; i < beforeWord.length; i++) {
      const char = beforeWord[i];
      if (char === '{') braceOpeners.push(i);
      else if (char === '}') braceOpeners.pop();
      else if (char === '(') parenOpeners.push(i);
      else if (char === ')') parenOpeners.pop();
    }

    // Header / returns parens hold declarations; other unclosed parens are
    // expressions and classify like their surrounding block
    if (parenOpeners.length > 0) {
      const beforeParen = beforeWord.slice(0, parenOpeners[parenOpeners.length - 1]);
      if (/\b(function|contract)\s+\w+\s*$/.test(beforeParen)) return { kind: 'parameter-list' };
      if (/\breturns\s*$/.test(beforeParen)) return { kind: 'type-list' };
    }

    if (braceOpeners.length === 0) {
      // Directly after a top-level function's parameter list only `returns` can follow
      if (/\bfunction\s+\w+\s*\([^()]*\)\s*$/.test(beforeWord)) return { kind: 'returns-clause' };
      // After a contract header or a completed returns clause, only `{` can follow
      if (/\b(contract\s+\w+\s*\([^()]*\)|returns\s*(\([^()]*\))?)\s*$/.test(beforeWord)) {
        return { kind: 'header-trailing' };
      }
      return { kind: 'top-level' };
    }

    const openerKinds = braceOpeners.map((position) => classifyBlockOpener(beforeWord.slice(0, position)));
    if (openerKinds[openerKinds.length - 1] === 'contract') return { kind: 'contract-body' };
    return { kind: 'function-body', insideContract: openerKinds.includes('contract') };
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
      if (callMatch) return getCallReturnType(callMatch[1]) ?? this.getUserFunctionReturnType(callMatch[1]);
      return null;
    }

    // Cast: `type(...)` — already handled by the function-call branch above
    // because types like `bytes` / `int` are in neither `GLOBAL_FUNCTIONS` nor
    // our type map; add dedicated handling.
    // (Intentionally no-op — casts return the cast-to type, which we infer via
    //  the member-chain case below if needed.)

    // Identifier → variable or (imported) global constant
    const idMatch = text.match(/(\w+)$/);
    if (idMatch) {
      return this.getVariableTypeMap()[idMatch[1]] ?? this.getGlobalConstantType(idMatch[1]);
    }

    return null;
  }

  protected variableTypeMap: Record<string, string> | null = null;

  protected getVariableTypeMap(): Record<string, string> {
    if (this.variableTypeMap) return this.variableTypeMap;
    const code = blankOutComments(this.text);
    const re = /\b(int|bool|string|pubkey|sig|datasig|byte|bytes\d*)\s+((?:(?:constant|unused)\s+)*)(\w+)/g;
    const map: Record<string, string> = {};
    for (const m of code.matchAll(re)) {
      map[m[3]] = m[1];
    }
    this.variableTypeMap = map;
    return map;
  }

  protected getVarCompletions(): CompletionItem[] {
    const re = /(int|bool|string|pubkey|sig|datasig|byte|bytes|bytes[0-9]+)\s+((?:(?:constant|unused)\s+)*)(\w+)/g;
    const codeOnly = blankOutComments(this.text);
    const completions: CompletionItem[] = [];
    const seen = new Set<string>();
    for (const m of codeOnly.matchAll(re)) {
      // Variables marked `unused` cannot be referenced, so don't suggest them
      if (m[2].includes('unused')) continue;
      if (seen.has(m[3])) continue;
      seen.add(m[3]);
      completions.push({
        label: m[3],
        kind: CompletionItemKind.Variable,
      });
    }

    return completions;
  }

  protected userSymbols: UserSymbols | null = null;

  protected getUserSymbols(): UserSymbols {
    this.userSymbols ??= collectUserSymbols(this.text, documentFilePath(this.doc));
    return this.userSymbols;
  }

  protected getUserFunctionReturnType(fn: string): string | null {
    const userFunction = this.getUserSymbols().functions.find((candidate) => candidate.name === fn);
    // Only single-value returns produce a directly usable expression type
    if (userFunction?.returnTypes.length !== 1) return null;
    return userFunction.returnTypes[0];
  }

  protected getGlobalConstantType(name: string): string | null {
    const constant = this.getUserSymbols().constants.find((candidate) => candidate.name === name);
    return constant?.type ?? null;
  }

  // User-defined functions, both local and imported (CashScript 0.14+)
  protected getUserFunctionCompletions(): CompletionItem[] {
    return this.getUserSymbols().functions.map((userFunction) => ({
      label: userFunction.name,
      kind: CompletionItemKind.Function,
      detail: userFunction.signature,
      documentation: userFunction.importedFrom ? `Imported from '${userFunction.importedFrom}'` : undefined,
    }));
  }

  // Global constants, both local and imported (CashScript 0.14+)
  protected getUserConstantCompletions(): CompletionItem[] {
    return this.getUserSymbols().constants.map((constant) => ({
      label: constant.name,
      kind: CompletionItemKind.Constant,
      detail: constant.declaration,
      documentation: constant.importedFrom ? `Imported from '${constant.importedFrom}'` : undefined,
    }));
  }

  protected getKeywordCompletions(words: string[]): CompletionItem[] {
    return words.map((word) => ({
      label: word,
      kind: CompletionItemKind.Keyword,
    }));
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
    const completions: CompletionItem[] = [];
    for (let i = 0; i < words.length; i++) {
      this.currentIndex += 1;
      completions.push({
        label: words[i],
        kind: CompletionItemKind.Keyword,
      });
    }
    return completions;
  }

  protected getUnitCompletions(): CompletionItem[] {
    const words = ['sats', 'satoshis', 'finney', 'bits', 'bitcoin', 'seconds', 'minutes', 'hours', 'days', 'weeks'];
    return this.getKeywordCompletions(words);
  }
}

const STATEMENT_KEYWORDS = ['if', 'else', 'do', 'while', 'for'];
// Valid as declared types (grammar rule `typeName`): declarations, parameters, returns clauses
const TYPE_NAMES = ['int', 'bool', 'string', 'byte', 'bytes', 'pubkey', 'sig', 'datasig'];
// Valid between a type name and an identifier (grammar rule `modifier`)
const MODIFIERS = ['constant', 'unused'];
const BOOLEAN_LITERALS = ['true', 'false'];
// Cast operators, only valid in expressions — not type names
const UNSAFE_CASTS = ['unsafe_int', 'unsafe_bool', 'unsafe_byte', 'unsafe_bytes'];

type CursorContext =
  | { kind: 'top-level' }
  | { kind: 'returns-clause' }
  | { kind: 'header-trailing' }
  | { kind: 'parameter-list' }
  | { kind: 'type-list' }
  | { kind: 'contract-body' }
  | { kind: 'function-body'; insideContract: boolean };

// Determines which construct opened the block at an unmatched `{`: a contract
// header, a function header, or any other block (if / else / loops)
function classifyBlockOpener(textBeforeBrace: string): 'contract' | 'function' | 'block' {
  const headerMatch = textBeforeBrace.match(/\b(contract|function)\s+\w+\s*\([^()]*\)\s*(returns\s*\([^()]*\))?\s*$/);
  if (!headerMatch) return 'block';
  return headerMatch[1] as 'contract' | 'function';
}
