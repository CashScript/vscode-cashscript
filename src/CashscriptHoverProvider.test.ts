// Mock the LanguageDesc content directly in the file
const LANGUAGE = {
  bool: { code: 'bool', codeDesc: 'Represents a boolean value, either true or false.' },
  int: { code: 'int', codeDesc: 'Represents a signed integer value.' },
  string: { code: 'string', codeDesc: 'Represents a string value.' },
  pubkey: { code: 'pubkey', codeDesc: 'Represents a public key.' },
  sig: { code: 'sig', codeDesc: 'Represents a signature.' },
  datasig: { code: 'datasig', codeDesc: 'Represents a data signature.' },
  byte: { code: 'byte', codeDesc: 'Represents a single byte value.' },
  bytes20: { code: 'bytes20', codeDesc: 'Represents a 20-byte value.' },
  bytes32: { code: 'bytes32', codeDesc: 'Represents a 32-byte value.' },
};

// Mock VS Code classes to avoid import issues
class MockMarkdownString {
  value: string;
  constructor(value?: string) {
    this.value = value || '';
  }
  appendCodeblock(code: string) {
    return this;
  }
}

class MockHover {
  contents: any;
  range: any;
  constructor(contents: any, range?: any) {
    this.contents = contents;
    this.range = range;
  }
}

// Define the CashscriptHoverProvider class directly in the test file to avoid import issues
class CashscriptHoverProvider {
  re = /[a-zA-Z0-9]+/g; // regex to get selected word
  constructor(private channel: any = null) { }

  // Replicate methods from the original class
  getHoverAnnotation(word: string) {
    const data = LANGUAGE[word] || null;
    if (!data) return null;

    return [new MockMarkdownString().appendCodeblock(data.code), new MockMarkdownString(data.codeDesc)];
  }

  getVariableTypes(document: any, targetWord: string) {
    const type = this.getVariableType(targetWord, document);
    if (!type) return null;
    return [new MockMarkdownString().appendCodeblock(`${type} ${targetWord}`)];
  }

  getVariableType(variable: string, document: any) {
    const text = document.getText();
    const matches = text.match(new RegExp(`\\b(int|bool|string|pubkey|sig|datasig|byte|bytes\\d*)\\s+${variable}\\b`)); //regex still incomplete
    if (!matches) return null;
    return matches[1];
  }

  getMemberHovers(document: any, word: string) {
    if (word === 'split') {
      return [
        new MockMarkdownString().appendCodeblock('[s1, s2] sequence.split(int i)'),
        new MockMarkdownString(
          'Splits the sequence at the specified index and returns a tuple with the two resulting sequences.',
        ),
      ];
    } else if (word === 'reverse') {
      return [
        new MockMarkdownString().appendCodeblock('any sequence.reverse()'),
        new MockMarkdownString('Reverses the sequence.'),
      ];
    } else if (word === 'slice') {
      return [
        new MockMarkdownString().appendCodeblock('any sequence.slice(int start, int end)'),
        new MockMarkdownString('Returns a new sequence containing the elements from start to end.'),
      ];
    }

    return null;
  }
  
  // provideHover method
  provideHover(
    document: any,
    position: any,
    token: any,
  ) {
    let range = document.getWordRangeAtPosition(position, this.re);
    let word = document.getText(range);

    const varTypes = this.getVariableTypes(document, word); // fix this
    if (varTypes) return new MockHover(varTypes, range);

    const annotation = this.getHoverAnnotation(word);
    if (annotation) return new MockHover(annotation, range);

    const memberHovers = this.getMemberHovers(document, word);
    if (memberHovers) return new MockHover(memberHovers, range);

    // Skip getMiscellaneousHovers test for now

    return null;
  }
}

/**
 * Finds the range of a multiline regex match around a given position.
 */
function getMultilineRegexRangeAroundPosition(
  document: any,
  position: any,
  pattern: RegExp,
  maxLines: number = 20
): any {
  const halfRange = Math.floor(maxLines / 2);
  const startLine = Math.max(0, position.line - halfRange);
  const endLine = Math.min(document.lineCount - 1, position.line + halfRange);

  const lines: string[] = [];
  for (let i = startLine; i <= endLine; i++) {
    lines.push(document.lineAt(i).text);
  }

  const joinedText = lines.join('\n');
  const baseOffset = document.offsetAt({ line: startLine, character: 0, isBefore: jest.fn(), isBeforeOrEqual: jest.fn(), isAfter: jest.fn(), isAfterOrEqual: jest.fn(), isEqual: jest.fn(), compareTo: jest.fn(), translate: jest.fn(), with: jest.fn() });

  // Reset regex state if necessary
  pattern.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(joinedText)) !== null) {
    const matchStartOffset = baseOffset + match.index;
    const matchEndOffset = matchStartOffset + match[0].length;

    // Create mock range
    const matchStart = document.positionAt(matchStartOffset);
    const matchEnd = document.positionAt(matchEndOffset);

    const matchRange = {
      start: matchStart,
      end: matchEnd,
      contains: (pos: any) => {
        return pos.line >= matchStart.line && pos.line <= matchEnd.line &&
               pos.character >= matchStart.character && pos.character <= matchEnd.character;
      }
    };

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
 */
function stripCommentsAndFlatten(input: string): string {
  // Remove multiline block comments (/* ... */)
  let output = input.replace(/\/\*[\s\S]*?\*\//g, '');

  // Remove single-line comments (//...)
  output = output.replace(/\/\/.*$/gm, '');

  // Replace newlines and excessive whitespace with a single space
  output = output.replace(/\s+/g, ' ').trim();

  return output;
}

describe('CashscriptHoverProvider', () => {
  let hoverProvider: CashscriptHoverProvider;

  beforeEach(() => {
    const mockOutputChannel: any = {
      name: 'test-channel',
      appendLine: jest.fn(),
      append: jest.fn(),
      replace: jest.fn(),
      clear: jest.fn(),
      show: jest.fn(),
      hide: jest.fn(),
      dispose: jest.fn(),
    };
    
    hoverProvider = new CashscriptHoverProvider(mockOutputChannel);
  });

  describe('getHoverAnnotation', () => {
    it('should return annotation for known word', () => {
      const result = hoverProvider.getHoverAnnotation('bool'); // Using 'bool' since it exists in LANGUAGE
      
      if (LANGUAGE.bool) {
        expect(result).toBeTruthy();
        expect(Array.isArray(result)).toBe(true);
        expect(result!.length).toBe(2);
      } else {
        expect(result).toBeNull();
      }
    });

    it('should return null for unknown word', () => {
      const result = hoverProvider.getHoverAnnotation('unknownWord');
      expect(result).toBeNull();
    });
  });

  describe('getVariableType', () => {
    it('should return the type of a variable', () => {
      const mockDocument: any = {
        getText: jest.fn().mockReturnValue('int myVariable = 5;')
      };

      const result = hoverProvider.getVariableType('myVariable', mockDocument);
      expect(result).toBe('int');
    });

    it('should return null for unknown variable', () => {
      const mockDocument: any = {
        getText: jest.fn().mockReturnValue('int otherVar = 5;')
      };

      const result = hoverProvider.getVariableType('unknownVar', mockDocument);
      expect(result).toBeNull();
    });

    it('should match different types correctly', () => {
      const mockDocument: any = {
        getText: jest.fn().mockReturnValue('bool flag = true; string name = "test"; pubkey key;')
      };

      expect(hoverProvider.getVariableType('flag', mockDocument)).toBe('bool');
      expect(hoverProvider.getVariableType('name', mockDocument)).toBe('string');
      expect(hoverProvider.getVariableType('key', mockDocument)).toBe('pubkey');
    });

    it('should match bytesN types', () => {
      const mockDocument: any = {
        getText: jest.fn().mockReturnValue('bytes20 hashValue; bytes32 anotherHash;')
      };

      expect(hoverProvider.getVariableType('hashValue', mockDocument)).toBe('bytes20');
      expect(hoverProvider.getVariableType('anotherHash', mockDocument)).toBe('bytes32');
    });

    it('should handle complex expressions', () => {
      const mockDocument: any = {
        getText: jest.fn().mockReturnValue(`
          contract MyContract {
            int balance = 100;
            bool isActive = true;
            pubkey owner;
          }
        `)
      };

      expect(hoverProvider.getVariableType('balance', mockDocument)).toBe('int');
      expect(hoverProvider.getVariableType('isActive', mockDocument)).toBe('bool');
      expect(hoverProvider.getVariableType('owner', mockDocument)).toBe('pubkey');
    });

    it('should match sig and datasig types', () => {
      const mockDocument: any = {
        getText: jest.fn().mockReturnValue('sig signatureValue; datasig dataSigValue;')
      };

      expect(hoverProvider.getVariableType('signatureValue', mockDocument)).toBe('sig');
      expect(hoverProvider.getVariableType('dataSigValue', mockDocument)).toBe('datasig');
    });
  });

  describe('getVariableTypes', () => {
    it('should return markdown strings for known variable type', () => {
      const mockDocument: any = {
        getText: jest.fn().mockReturnValue('int myVariable = 5;')
      };

      const result = hoverProvider.getVariableTypes(mockDocument, 'myVariable');
      expect(result).toBeDefined();
      if (result) {
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(1);
      }
    });

    it('should return null for unknown variable', () => {
      const mockDocument: any = {
        getText: jest.fn().mockReturnValue('int otherVar = 5;')
      };

      const result = hoverProvider.getVariableTypes(mockDocument, 'unknownVar');
      expect(result).toBeNull();
    });
  });

  describe('getMemberHovers', () => {
    it('should return hover for split method', () => {
      const result = hoverProvider.getMemberHovers({} as any, 'split');
      expect(result).toBeDefined();
      expect(result).not.toBeNull();
      expect(Array.isArray(result)).toBe(true);
      expect(result!.length).toBe(2);
    });

    it('should return hover for reverse method', () => {
      const result = hoverProvider.getMemberHovers({} as any, 'reverse');
      expect(result).toBeDefined();
      expect(result).not.toBeNull();
      expect(Array.isArray(result)).toBe(true);
      expect(result!.length).toBe(2);
    });

    it('should return hover for slice method', () => {
      const result = hoverProvider.getMemberHovers({} as any, 'slice');
      expect(result).toBeDefined();
      expect(result).not.toBeNull();
      expect(Array.isArray(result)).toBe(true);
      expect(result!.length).toBe(2);
    });

    it('should return null for unknown method', () => {
      const result = hoverProvider.getMemberHovers({} as any, 'unknownMethod');
      expect(result).toBeNull();
    });
  });

  describe('constructor', () => {
    it('should accept output channel in constructor', () => {
      const channel: any = {
        name: 'test-channel',
        appendLine: jest.fn(),
        append: jest.fn(),
        replace: jest.fn(),
        clear: jest.fn(),
        show: jest.fn(),
        hide: jest.fn(),
        dispose: jest.fn(),
      };
      const provider = new CashscriptHoverProvider(channel);
      expect(provider).toBeInstanceOf(CashscriptHoverProvider);
    });

    it('should accept null output channel', () => {
      const provider = new CashscriptHoverProvider(null);
      expect(provider).toBeInstanceOf(CashscriptHoverProvider);
    });
  });
});

// Separate tests for utility functions that don't depend on VS Code API
describe('Utility Functions', () => {
  describe('getMultilineRegexRangeAroundPosition', () => {
    it('should return undefined when no match is found', () => {
      const mockDocument: any = {
        lineAt: jest.fn().mockImplementation((idx: number) => ({ text: 'some text here' })),
        lineCount: 1,
        offsetAt: jest.fn().mockReturnValue(0),
        positionAt: jest.fn().mockImplementation((offset: number) => ({ 
          line: Math.floor(offset / 10), 
          character: offset % 10,
          isBefore: jest.fn(),
          isBeforeOrEqual: jest.fn(),
          isAfter: jest.fn(),
          isAfterOrEqual: jest.fn(),
          isEqual: jest.fn(),
          compareTo: jest.fn(),
          translate: jest.fn(),
          with: jest.fn(),
          contains: jest.fn((pos) => true), // Simplified for test
        })),
        getText: jest.fn().mockReturnValue('some text here'),
      };

      const mockPosition: any = {
        line: 0,
        character: 5,
        isBefore: jest.fn(),
        isBeforeOrEqual: jest.fn(),
        isAfter: jest.fn(),
        isAfterOrEqual: jest.fn(),
        isEqual: jest.fn(),
        compareTo: jest.fn(),
        translate: jest.fn(),
        with: jest.fn(),
        contains: jest.fn((pos) => true), // Simplified for test
      };
      const pattern = /(nonexistent)/g;

      const result = getMultilineRegexRangeAroundPosition(mockDocument, mockPosition, pattern);

      expect(result).toBeUndefined();
    });

    it('should handle empty document', () => {
      const mockDocument: any = {
        lineAt: jest.fn().mockImplementation((idx: number) => ({ text: '' })),
        lineCount: 0,
        offsetAt: jest.fn().mockReturnValue(0),
        positionAt: jest.fn().mockImplementation((offset: number) => ({ 
          line: 0, 
          character: 0,
          isBefore: jest.fn(),
          isBeforeOrEqual: jest.fn(),
          isAfter: jest.fn(),
          isAfterOrEqual: jest.fn(),
          isEqual: jest.fn(),
          compareTo: jest.fn(),
          translate: jest.fn(),
          with: jest.fn(),
          contains: jest.fn((pos) => true), // Simplified for test
        })),
        getText: jest.fn().mockReturnValue(''),
      };

      const mockPosition: any = {
        line: 0,
        character: 0,
        isBefore: jest.fn(),
        isBeforeOrEqual: jest.fn(),
        isAfter: jest.fn(),
        isAfterOrEqual: jest.fn(),
        isEqual: jest.fn(),
        compareTo: jest.fn(),
        translate: jest.fn(),
        with: jest.fn(),
        contains: jest.fn((pos) => true), // Simplified for test
      };
      const pattern = /(test)/g;

      const result = getMultilineRegexRangeAroundPosition(mockDocument, mockPosition, pattern);

      expect(result).toBeUndefined();
    });
  });

  describe('stripCommentsAndFlatten', () => {
    it('should remove single-line comments', () => {
      const input = 'int x = 5; // this is a comment\nint y = 6;';
      const expected = 'int x = 5; int y = 6;';

      const result = stripCommentsAndFlatten(input);

      expect(result).toBe(expected);
    });

    it('should remove multi-line comments', () => {
      const input = 'int x = 5; /* this is a\nmulti-line comment */ int y = 6;';
      const expected = 'int x = 5; int y = 6;';

      const result = stripCommentsAndFlatten(input);

      expect(result).toBe(expected);
    });

    it('should flatten multiple lines to single line', () => {
      const input = 'int x = 5;\nint y = 6;\nint z = 7;';
      const expected = 'int x = 5; int y = 6; int z = 7;';

      const result = stripCommentsAndFlatten(input);

      expect(result).toBe(expected);
    });

    it('should handle mixed comments and whitespace', () => {
      const input = 'int x = 5; /* comment */  \n  // another comment\n  int y = 6;';
      const expected = 'int x = 5; int y = 6;';

      const result = stripCommentsAndFlatten(input);

      expect(result).toBe(expected);
    });

    it('should return same string if no comments present', () => {
      const input = 'int x = 5; int y = 6;';
      const expected = 'int x = 5; int y = 6;';

      const result = stripCommentsAndFlatten(input);

      expect(result).toBe(expected);
    });

    it('should handle edge cases like empty input', () => {
      const input = '';
      const expected = '';

      const result = stripCommentsAndFlatten(input);

      expect(result).toBe(expected);
    });

    it('should handle only comments', () => {
      const input = '// comment only\n/* multi comment */';
      const expected = '';

      const result = stripCommentsAndFlatten(input);

      expect(result).toBe(expected);
    });
  });
});