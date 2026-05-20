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

  describe('Whitespace and comments', () => {
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

});