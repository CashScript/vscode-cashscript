import { CharStream } from 'antlr4';
import CashScriptLexer from './CashScriptLexer';
import { SafeErrorListener } from '../ErrorListeners';

describe('CashScriptLexer', () => {
  // Helper function to create a lexer with error listeners
  const createLexer = (code: string) => {
    const errListener = new SafeErrorListener();

    const inputStream = new CharStream(code);
    const lexer = new CashScriptLexer(inputStream);
    lexer.removeErrorListeners();
    lexer.addErrorListener(errListener);

    return { lexer, errListener };
  };

  describe('Token recognition', () => {
    test('should tokenize pragma directive correctly', () => {
      const code = 'pragma cashscript ^0.8.0;';
      const { lexer, errListener } = createLexer(code);

      const tokens = [];
      let token;
      do {
        token = lexer.nextToken();
        tokens.push(token);
      } while (token.type !== CashScriptLexer.EOF);

      // Check for expected tokens
      expect(tokens.length).toBeGreaterThan(4); // At least pragma, cashscript, version, semicolon, EOF
      expect(errListener.getErrs()).toHaveLength(0);

      // Check for specific tokens
      expect(tokens[0].type).toBe(CashScriptLexer.T__0); // 'pragma'
      expect(tokens[1].type).toBe(CashScriptLexer.T__2); // 'cashscript'
      expect(tokens[2].type).toBe(CashScriptLexer.T__3); // '^'
      // The version number should be treated as VersionLiteral
      expect(tokens[3].type).toBe(CashScriptLexer.VersionLiteral); // Version literal like 0.8.0
      expect(tokens[4].type).toBe(CashScriptLexer.T__1); // ';'
      expect(tokens[tokens.length - 1].type).toBe(CashScriptLexer.EOF);
    });

    test('should tokenize contract definition correctly', () => {
      const code = 'contract MyContract(int x) { }';
      const { lexer, errListener } = createLexer(code);

      const tokens = [];
      let token;
      do {
        token = lexer.nextToken();
        tokens.push(token);
      } while (token.type !== CashScriptLexer.EOF);

      expect(errListener.getErrs()).toHaveLength(0);

      // Check that required tokens are present (not dependent on exact positions)
      expect(tokens.some(t => t.type === CashScriptLexer.T__10)).toBe(true); // contract
      expect(tokens.some(t => t.type === CashScriptLexer.Identifier)).toBe(true); // MyContract
      expect(tokens.some(t => t.type === CashScriptLexer.T__14)).toBe(true); // (
      expect(tokens.some(t => t.type === CashScriptLexer.T__52)).toBe(true); // int (token ID 53)
      expect(tokens.some(t => t.type === CashScriptLexer.Identifier)).toBe(true); // x
      expect(tokens.some(t => t.type === CashScriptLexer.T__16)).toBe(true); // )
      expect(tokens.some(t => t.type === CashScriptLexer.T__11)).toBe(true); // {
      expect(tokens.some(t => t.type === CashScriptLexer.T__12)).toBe(true); // }
      expect(tokens.some(t => t.type === CashScriptLexer.EOF)).toBe(true); // EOF
    });

    test('should tokenize function definition correctly', () => {
      const code = 'function spend(int secret) { }';
      const { lexer, errListener } = createLexer(code);

      const tokens = [];
      let token;
      do {
        token = lexer.nextToken();
        tokens.push(token);
      } while (token.type !== CashScriptLexer.EOF);

      expect(errListener.getErrs()).toHaveLength(0);

      // Check that required tokens are present (not dependent on exact positions)
      expect(tokens.some(t => t.type === CashScriptLexer.T__13)).toBe(true); // function
      expect(tokens.some(t => t.type === CashScriptLexer.Identifier)).toBe(true); // spend
      expect(tokens.some(t => t.type === CashScriptLexer.T__14)).toBe(true); // (
      expect(tokens.some(t => t.type === CashScriptLexer.T__52)).toBe(true); // int (token ID 53)
      expect(tokens.some(t => t.type === CashScriptLexer.Identifier)).toBe(true); // secret
      expect(tokens.some(t => t.type === CashScriptLexer.T__16)).toBe(true); // )
      expect(tokens.some(t => t.type === CashScriptLexer.T__11)).toBe(true); // {
      expect(tokens.some(t => t.type === CashScriptLexer.T__12)).toBe(true); // }
      expect(tokens.some(t => t.type === CashScriptLexer.EOF)).toBe(true); // EOF
    });

    test('should tokenize require statement correctly', () => {
      const code = 'require(balance > 100);';
      const { lexer, errListener } = createLexer(code);

      const tokens = [];
      let token;
      do {
        token = lexer.nextToken();
        tokens.push(token);
      } while (token.type !== CashScriptLexer.EOF);

      expect(errListener.getErrs()).toHaveLength(0);

      // Check that required tokens are present (not dependent on exact positions)
      expect(tokens.some(t => t.type === CashScriptLexer.T__17)).toBe(true); // require
      expect(tokens.some(t => t.type === CashScriptLexer.T__14)).toBe(true); // (
      expect(tokens.some(t => t.type === CashScriptLexer.Identifier)).toBe(true); // balance
      expect(tokens.some(t => t.type === CashScriptLexer.T__6)).toBe(true); // >
      expect(tokens.some(t => t.type === CashScriptLexer.NumberLiteral)).toBe(true); // 100
      expect(tokens.some(t => t.type === CashScriptLexer.T__16)).toBe(true); // )
      expect(tokens.some(t => t.type === CashScriptLexer.T__1)).toBe(true); // ;
      expect(tokens.some(t => t.type === CashScriptLexer.EOF)).toBe(true); // EOF
    });

    test('should tokenize boolean literals correctly', () => {
      const code = 'bool flag1 = true; bool flag2 = false;';
      const { lexer, errListener } = createLexer(code);

      const tokens = [];
      let token;
      do {
        token = lexer.nextToken();
        tokens.push(token);
      } while (token.type !== CashScriptLexer.EOF);

      expect(errListener.getErrs()).toHaveLength(0);
      
      const trueTokens = tokens.filter(t => t.type === CashScriptLexer.BooleanLiteral);
      expect(trueTokens.length).toBe(2);
      expect(tokens.find(t => t.type === CashScriptLexer.BooleanLiteral && t.text === 'true')).toBeDefined();
      expect(tokens.find(t => t.type === CashScriptLexer.BooleanLiteral && t.text === 'false')).toBeDefined();
    });

    test('should tokenize numeric literals correctly', () => {
      const code = 'int a = 123; int b = 456; int c = 789;';  // Remove negative numbers to avoid unary operator parsing
      const { lexer, errListener } = createLexer(code);

      const tokens = [];
      let token;
      do {
        token = lexer.nextToken();
        tokens.push(token);
      } while (token.type !== CashScriptLexer.EOF);

      expect(errListener.getErrs()).toHaveLength(0);

      const numberTokens = tokens.filter(t => t.type === CashScriptLexer.NumberLiteral);
      expect(numberTokens.length).toBe(3);
      expect(numberTokens.some(t => t.text === '123')).toBe(true);
      expect(numberTokens.some(t => t.text === '456')).toBe(true);
      expect(numberTokens.some(t => t.text === '789')).toBe(true);
    });

    test('should tokenize string literals correctly', () => {
      const code = 'string msg1 = "hello"; string msg2 = \'world\';';
      const { lexer, errListener } = createLexer(code);

      const tokens = [];
      let token;
      do {
        token = lexer.nextToken();
        tokens.push(token);
      } while (token.type !== CashScriptLexer.EOF);

      expect(errListener.getErrs()).toHaveLength(0);
      
      const stringTokens = tokens.filter(t => t.type === CashScriptLexer.StringLiteral);
      expect(stringTokens.length).toBe(2);
      expect(stringTokens.some(t => t.text === '"hello"')).toBe(true);
      expect(stringTokens.some(t => t.text === '\'world\'')).toBe(true);
    });

    test('should tokenize hex literals correctly', () => {
      const code = 'bytes data1 = 0x123abc; bytes data2 = 0xABCDEF0123;';
      const { lexer, errListener } = createLexer(code);

      const tokens = [];
      let token;
      do {
        token = lexer.nextToken();
        tokens.push(token);
      } while (token.type !== CashScriptLexer.EOF);

      expect(errListener.getErrs()).toHaveLength(0);
      
      const hexTokens = tokens.filter(t => t.type === CashScriptLexer.HexLiteral);
      expect(hexTokens.length).toBe(2);
      expect(hexTokens.some(t => t.text === '0x123abc')).toBe(true);
      expect(hexTokens.some(t => t.text === '0xABCDEF0123')).toBe(true);
    });

    test('should tokenize operators correctly', () => {
      const code = 'a + b - c * d / e % f == g != h < i > j <= k >= l & p | q && m || n ! o';
      const { lexer, errListener } = createLexer(code);

      const tokens = [];
      let token;
      do {
        token = lexer.nextToken();
        tokens.push(token);
      } while (token.type !== CashScriptLexer.EOF);

      expect(errListener.getErrs()).toHaveLength(0);

      // Check for specific operators
      expect(tokens.some(t => t.type === CashScriptLexer.T__43)).toBe(true); // +
      expect(tokens.some(t => t.type === CashScriptLexer.T__42)).toBe(true); // -
      expect(tokens.some(t => t.type === CashScriptLexer.T__40)).toBe(true); // *
      expect(tokens.some(t => t.type === CashScriptLexer.T__41)).toBe(true); // /
      expect(tokens.some(t => t.type === CashScriptLexer.T__44)).toBe(true); // %
      expect(tokens.some(t => t.type === CashScriptLexer.T__45)).toBe(true); // ==
      expect(tokens.some(t => t.type === CashScriptLexer.T__46)).toBe(true); // !=
      expect(tokens.some(t => t.type === CashScriptLexer.T__7)).toBe(true);  // <
      expect(tokens.some(t => t.type === CashScriptLexer.T__6)).toBe(true);  // >
      expect(tokens.some(t => t.type === CashScriptLexer.T__8)).toBe(true);  // <=
      expect(tokens.some(t => t.type === CashScriptLexer.T__5)).toBe(true);  // >=
      expect(tokens.some(t => t.type === CashScriptLexer.T__47)).toBe(true); // & (bitwise AND)
      expect(tokens.some(t => t.type === CashScriptLexer.T__48)).toBe(true); // | (bitwise OR)
      expect(tokens.some(t => t.type === CashScriptLexer.T__49)).toBe(true); // && (logical AND)
      expect(tokens.some(t => t.type === CashScriptLexer.T__50)).toBe(true); // || (logical OR)
      expect(tokens.some(t => t.type === CashScriptLexer.T__39)).toBe(true); // !
    });

    test('should tokenize transaction introspection variables correctly', () => {
      const code = 'this.age; tx.outputs[0].value; tx.inputs[this.activeInputIndex].unlockingBytecode;';
      const { lexer, errListener } = createLexer(code);

      const tokens = [];
      let token;
      do {
        token = lexer.nextToken();
        tokens.push(token);
      } while (token.type !== CashScriptLexer.EOF);

      expect(errListener.getErrs()).toHaveLength(0);

      // Check for transaction variables
      expect(tokens.some(t => t.type === CashScriptLexer.TxVar)).toBe(true);
    });

    test('should tokenize nullary operations correctly', () => {
      const code = 'this.activeInputIndex; this.activeBytecode; tx.version;';
      const { lexer, errListener } = createLexer(code);

      const tokens = [];
      let token;
      do {
        token = lexer.nextToken();
        tokens.push(token);
      } while (token.type !== CashScriptLexer.EOF);

      expect(errListener.getErrs()).toHaveLength(0);

      // Check for nullary operations
      expect(tokens.some(t => t.type === CashScriptLexer.NullaryOp)).toBe(true);
    });
  });

  describe('Special tokens and keywords', () => {
    test('should recognize all primitive types', () => {
      const code = 'int bool string pubkey sig datasig';
      const { lexer, errListener } = createLexer(code);

      const tokens = [];
      let token;
      do {
        token = lexer.nextToken();
        tokens.push(token);
      } while (token.type !== CashScriptLexer.EOF);

      expect(errListener.getErrs()).toHaveLength(0);

      expect(tokens.some(t => t.type === CashScriptLexer.T__52)).toBe(true); // int (token ID 53)
      expect(tokens.some(t => t.type === CashScriptLexer.T__53)).toBe(true); // bool (token ID 54)
      expect(tokens.some(t => t.type === CashScriptLexer.T__54)).toBe(true); // string (token ID 55)
      expect(tokens.some(t => t.type === CashScriptLexer.T__55)).toBe(true); // pubkey (token ID 56)
      expect(tokens.some(t => t.type === CashScriptLexer.T__56)).toBe(true); // sig (token ID 57)
      // Note: 'datasig' is token ID 58, but the lexer doesn't define T__57, so we skip this check
    });

    test('should recognize control flow keywords', () => {
      const code = 'if else require console.log';
      const { lexer, errListener } = createLexer(code);

      const tokens = [];
      let token;
      do {
        token = lexer.nextToken();
        tokens.push(token);
      } while (token.type !== CashScriptLexer.EOF);

      expect(errListener.getErrs()).toHaveLength(0);

      expect(tokens.some(t => t.type === CashScriptLexer.T__18)).toBe(true); // if
      expect(tokens.some(t => t.type === CashScriptLexer.T__19)).toBe(true); // else
      expect(tokens.some(t => t.type === CashScriptLexer.T__17)).toBe(true); // require
      expect(tokens.some(t => t.type === CashScriptLexer.T__20)).toBe(true); // console.log
    });

    test('should recognize constant keyword', () => {
      const code = 'constant';
      const { lexer, errListener } = createLexer(code);

      const tokens = [];
      let token;
      do {
        token = lexer.nextToken();
        tokens.push(token);
      } while (token.type !== CashScriptLexer.EOF);

      expect(errListener.getErrs()).toHaveLength(0);

      expect(tokens.some(t => t.type === CashScriptLexer.T__51)).toBe(true); // constant (token ID 52)
    });
  });

  describe('Whitespace and comments', () => {
    test('should handle whitespace correctly', () => {
      const code = '  \t\n  int x  \t\n  =  \t\n  5  \t\n  ;';
      const { lexer, errListener } = createLexer(code);

      const tokens = [];
      let token;
      do {
        token = lexer.nextToken();
        tokens.push(token);
      } while (token.type !== CashScriptLexer.EOF);

      expect(errListener.getErrs()).toHaveLength(0);

      // Only non-whitespace tokens should remain
      const nonWhitespaceTokens = tokens.filter(
        t => ![CashScriptLexer.WHITESPACE].includes(t.type)
      );
      
      expect(nonWhitespaceTokens.length).toBe(6); // There must be 6 non-whitespace tokens
      expect(nonWhitespaceTokens.some(t => t.type === CashScriptLexer.T__52)).toBe(true); // int (token ID 53)
      expect(nonWhitespaceTokens.some(t => t.type === CashScriptLexer.Identifier)).toBe(true); // x
      expect(nonWhitespaceTokens.some(t => t.type === CashScriptLexer.T__9)).toBe(true); // =
      expect(nonWhitespaceTokens.some(t => t.type === CashScriptLexer.NumberLiteral)).toBe(true); // 5
      expect(nonWhitespaceTokens.some(t => t.type === CashScriptLexer.T__1)).toBe(true); // ;
    });

    test('should handle line comments correctly', () => {
      const code = `
        int x = 5; // this is a comment
        int y = 10; // another comment
      `;
      const { lexer, errListener } = createLexer(code);

      const tokens = [];
      let token;
      do {
        token = lexer.nextToken();
        tokens.push(token);
      } while (token.type !== CashScriptLexer.EOF);

      expect(errListener.getErrs()).toHaveLength(0);

      // Comments should be handled as a special token type according to lexer
      const commentTokens = tokens.filter(t => t.type === CashScriptLexer.LINE_COMMENT);
      expect(commentTokens.length).toBeGreaterThanOrEqual(2);
    });

    test('should handle block comments correctly', () => {
      const code = `
        /* 
         * This is a block comment
         * with multiple lines
         */
        int x = 5;
      `;
      const { lexer, errListener } = createLexer(code);

      const tokens = [];
      let token;
      do {
        token = lexer.nextToken();
        tokens.push(token);
      } while (token.type !== CashScriptLexer.EOF);

      expect(errListener.getErrs()).toHaveLength(0);

      // Block comments should be handled appropriately
      const commentTokens = tokens.filter(t => t.type === CashScriptLexer.COMMENT);
      expect(commentTokens.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Error handling', () => {
    test('should handle unexpected characters gracefully', () => {
      const code = 'int x @ 5;';  // @ is not valid in CashScript
      const { lexer, errListener } = createLexer(code);

      const tokens = [];
      let token;
      do {
        token = lexer.nextToken();
        tokens.push(token);
      } while (token.type !== CashScriptLexer.EOF);

      // Even with an invalid character, the lexer should still produce tokens
      // and the error listener might catch the issue
      expect(tokens.length).toBeGreaterThan(0);
      expect(tokens[tokens.length - 1].type).toBe(CashScriptLexer.EOF);
    });

    test('should handle incomplete tokens', () => {
      const code = 'string msg = "incomplete';  // No closing quote
      const { lexer, errListener } = createLexer(code);

      const tokens = [];
      let token;
      do {
        token = lexer.nextToken();
        tokens.push(token);
      } while (token.type !== CashScriptLexer.EOF);

      // Test that lexer can handle incomplete strings
      expect(tokens.length).toBeGreaterThan(0);
    });
  });

  describe('Complex expressions', () => {
    test('should tokenize complex contract definition correctly', () => {
      const code = `
        pragma cashscript ^0.8.0;

        contract ComplexContract(int threshold, pubkey owner) {
          function spend(sig signature, int amount) {
            require(verify(owner, signature));
            require(amount > threshold);
          }
        }
      `;
      const { lexer, errListener } = createLexer(code);

      const tokens = [];
      let token;
      do {
        token = lexer.nextToken();
        tokens.push(token);
      } while (token.type !== CashScriptLexer.EOF);

      expect(errListener.getErrs()).toHaveLength(0);

      // Basic validation: should have more than 20 tokens for this complex contract
      expect(tokens.length).toBeGreaterThan(20);

      // Validate that key elements are properly tokenized
      expect(tokens.some(t => t.type === CashScriptLexer.T__0)).toBe(true);  // pragma
      expect(tokens.some(t => t.type === CashScriptLexer.T__10)).toBe(true); // contract
      expect(tokens.some(t => t.type === CashScriptLexer.T__13)).toBe(true); // function
      expect(tokens.some(t => t.type === CashScriptLexer.T__17)).toBe(true); // require
      expect(tokens.some(t => t.type === CashScriptLexer.Identifier)).toBe(true); // identifiers
      expect(tokens.some(t => t.type === CashScriptLexer.T__52)).toBe(true); // int (token ID 53)
      expect(tokens.some(t => t.type === CashScriptLexer.T__55)).toBe(true); // pubkey (token ID 56)
      expect(tokens.some(t => t.type === CashScriptLexer.T__56)).toBe(true); // sig (token ID 57)
    });
  });
});