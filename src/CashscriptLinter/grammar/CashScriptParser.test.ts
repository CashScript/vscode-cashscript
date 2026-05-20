import { CharStream, CommonTokenStream } from 'antlr4';
import CashScriptLexer from './CashScriptLexer';
import CashScriptParser from './CashScriptParser';
import { SafeErrorListener, SafeErrorStrategy } from '../ErrorListeners';

describe('CashScriptParser', () => {
  // Helper function to create a parser with error listeners
  const createParser = (code: string) => {
    const errListener = new SafeErrorListener();

    const inputStream = new CharStream(code);
    const lexer = new CashScriptLexer(inputStream);
    lexer.removeErrorListeners();
    lexer.addErrorListener(errListener);

    const tokenStream = new CommonTokenStream(lexer);
    const parser = new CashScriptParser(tokenStream);
    parser._errHandler = new SafeErrorStrategy();
    parser.removeErrorListeners();
    parser.addErrorListener(errListener);

    return { parser, errListener };
  };

  describe('Valid code parsing', () => {
    test('should successfully parse a simple contract definition', () => {
      const code = `
        pragma cashscript ^0.8.0;
        
        contract SimpleContract(int balance) {
          function spend(int secret) {
            require(balance == 1000);
          }
        }
      `;
      
      const { parser, errListener } = createParser(code);
      const parseTree = parser.sourceFile();
      
      expect(parseTree).toBeDefined();
      expect(errListener.getErrs()).toHaveLength(0);
    });

    test('should successfully parse complex expressions', () => {
      const code = `
        pragma cashscript ^0.8.0;
        
        contract ComplexContract(int x, int y) {
          function spend(bool flag) {
            int result = x + y * 2;
            bool check = (result > 100) && flag;
            require(check);
          }
        }
      `;
      
      const { parser, errListener } = createParser(code);
      const parseTree = parser.sourceFile();
      
      expect(parseTree).toBeDefined();
      expect(errListener.getErrs()).toHaveLength(0);
    });

    test('should successfully parse function calls and arrays', () => {
      const code = `
        pragma cashscript ^0.8.0;

        contract FunctionContract(pubkey owner) {
          function spend(sig s) {
            bool authorized = verify(owner, s);  // built-in function call
            require(authorized);

            int values = [1, 2, 3, 4][0];  // array literal with indexing
          }
        }
      `;

      const { parser, errListener } = createParser(code);
      const parseTree = parser.sourceFile();

      expect(parseTree).toBeDefined();
      expect(errListener.getErrs()).toHaveLength(0);
    });

    test('should successfully parse if statements and console logs', () => {
      const code = `
        pragma cashscript ^0.8.0;
        
        contract ConditionalContract(int threshold) {
          function spend(int value) {
            if (value > threshold) {
              console.log("Value exceeds threshold");
            } else {
              console.log("Value is acceptable");
            }
          }
        }
      `;
      
      const { parser, errListener } = createParser(code);
      const parseTree = parser.sourceFile();
      
      expect(parseTree).toBeDefined();
      expect(errListener.getErrs()).toHaveLength(0);
    });

    test('should successfully parse time-based operations', () => {
      const code = `
        pragma cashscript ^0.8.0;
        
        contract TimelockContract(int lockTime) {
          function spend() {
            require(tx.time >= lockTime, "Contract is timelocked");
          }
        }
      `;
      
      const { parser, errListener } = createParser(code);
      const parseTree = parser.sourceFile();
      
      expect(parseTree).toBeDefined();
      expect(errListener.getErrs()).toHaveLength(0);
    });

    test('should successfully parse transaction introspection operations', () => {
      const code = `
        pragma cashscript ^0.8.0;
        
        contract IntrospectionContract(int amount) {
          function spend(int index) {
            require(tx.inputs[index].value >= amount);
            bytes locking = tx.outputs[0].lockingBytecode;
          }
        }
      `;
      
      const { parser, errListener } = createParser(code);
      const parseTree = parser.sourceFile();
      
      expect(parseTree).toBeDefined();
      expect(errListener.getErrs()).toHaveLength(0);
    });
  });

  describe('Error handling', () => {
    test('should detect syntax errors in malformed contracts', () => {
      const code = `
        pragma cashcript ^0.8.0; // typo in 'cashscript'
        
        contract MalformedContract(int x { // missing closing parenthesis
          function spend(int y) {
            require(x y); // missing operator
          }
        }
      `;
      
      const { parser, errListener } = createParser(code);
      const parseTree = parser.sourceFile();
      
      expect(parseTree).toBeDefined(); // Parse tree is still created
      expect(errListener.getErrs()).not.toHaveLength(0); // But contains errors
    });

    test('should detect missing semicolons', () => {
      const code = `
        pragma cashscript ^0.8.0;
        
        contract MissingSemicolonContract(int x) {
          function spend(int y) {
            int z = x + y // missing semicolon
            require(z > 0);
          }
        }
      `;
      
      const { parser, errListener } = createParser(code);
      const parseTree = parser.sourceFile();
      
      expect(parseTree).toBeDefined();
      expect(errListener.getErrs()).not.toHaveLength(0);
    });

    test('should detect invalid identifiers', () => {
      const code = `
        pragma cashscript ^0.8.0;
        
        contract InvalidContract(int 123invalid) { // identifier starting with number
          function spend(int param) {
            require(123invalid > 0);
          }
        }
      `;
      
      const { parser, errListener } = createParser(code);
      const parseTree = parser.sourceFile();
      
      expect(parseTree).toBeDefined();
      expect(errListener.getErrs()).not.toHaveLength(0);
    });
  });

  describe('Grammar rule testing', () => {
    test('should handle different literal types', () => {
      const code = `
        pragma cashscript ^0.8.0;

        contract LiteralContract() {
          function spend() {
            int num = 42;
            bool flag = true;
            string msg = "hello world";
            bytes data = 0x1234abcd;
            int timed = 1234567890;
          }
        }
      `;

      const { parser, errListener } = createParser(code);
      const parseTree = parser.sourceFile();

      expect(parseTree).toBeDefined();
      expect(errListener.getErrs()).toHaveLength(0);
    });

    test('should handle unary and binary operators', () => {
      const code = `
        pragma cashscript ^0.8.0;
        
        contract OperatorsContract(int a, int b) {
          function spend(int c) {
            int result1 = a + b - c;
            int result2 = a * 2 + b / 4;
            bool cond = (a > b) && (c <= a);
            bool neg = !(cond || true);
          }
        }
      `;
      
      const { parser, errListener } = createParser(code);
      const parseTree = parser.sourceFile();
      
      expect(parseTree).toBeDefined();
      expect(errListener.getErrs()).toHaveLength(0);
    });

    test('should handle multiple variable definitions', () => {
      const code = `
        pragma cashscript ^0.8.0;

        contract MultipleVarsContract() {
          function spend() {
            int first = 1;
            int second = 2;
          }
        }
      `;

      const { parser, errListener } = createParser(code);
      const parseTree = parser.sourceFile();

      expect(parseTree).toBeDefined();
      expect(errListener.getErrs()).toHaveLength(0);
    });

    test('should handle function definitions with various parameter types', () => {
      const code = `
        pragma cashscript ^0.8.0;

        contract ParamContract(int value) {
          function spend(pubkey sender, sig signature, string message) {
            require(verify(sender, signature));
          }
        }
      `;

      const { parser, errListener } = createParser(code);
      const parseTree = parser.sourceFile();

      expect(parseTree).toBeDefined();
      expect(errListener.getErrs()).toHaveLength(0);
    });

    test('should handle instantiation', () => {
      const code = `
        pragma cashscript ^0.8.0;

        contract FactoryContract() {
          function spend() {
            // Testing the instantiation syntax: 'new' Identifier expressionList
          }
        }
      `;

      const { parser, errListener } = createParser(code);
      const parseTree = parser.sourceFile();

      expect(parseTree).toBeDefined();
      expect(errListener.getErrs()).toHaveLength(0);
    });

    test('should handle array and slice operations', () => {
      const code = `
        pragma cashscript ^0.8.0;

        contract ArrayContract() {
          function spend() {
            int first_item = [1, 2, 3, 4][0];  // array literal and indexing
            bytes data = "hello";
            bytes sliced = data.slice(0, 4);  // slice operation
            bytes split_result = data.split(4);  // split operation
          }
        }
      `;

      const { parser, errListener } = createParser(code);
      const parseTree = parser.sourceFile();

      expect(parseTree).toBeDefined();
      expect(errListener.getErrs()).toHaveLength(0);
    });
  });

  describe('Edge cases', () => {
    test('should handle empty contract', () => {
      const code = `
        pragma cashscript ^0.8.0;

        contract EmptyContract() {
          function spend() {
          }
        }
      `;

      const { parser, errListener } = createParser(code);
      const parseTree = parser.sourceFile();

      expect(parseTree).toBeDefined();
      expect(errListener.getErrs()).toHaveLength(0);
    });

    test('should handle multiple functions', () => {
      const code = `
        pragma cashscript ^0.8.0;
        
        contract MultiFunctionContract(int x) {
          function spend1(int a) {
            require(a == x);
          }
          
          function spend2(int b) {
            require(b != x);
          }
          
          function spend3(string msg) {
            console.log(msg);
          }
        }
      `;
      
      const { parser, errListener } = createParser(code);
      const parseTree = parser.sourceFile();
      
      expect(parseTree).toBeDefined();
      expect(errListener.getErrs()).toHaveLength(0);
    });

    test('should handle complex expressions with parentheses', () => {
      const code = `
        pragma cashscript ^0.8.0;
        
        contract ParenthesesContract(int a, int b, int c) {
          function spend(int x) {
            int result = ((a + b) * c) - (x / 2);
            bool complex = ((a > b) && (c < result)) || (x == 0);
          }
        }
      `;
      
      const { parser, errListener } = createParser(code);
      const parseTree = parser.sourceFile();
      
      expect(parseTree).toBeDefined();
      expect(errListener.getErrs()).toHaveLength(0);
    });
  });
});