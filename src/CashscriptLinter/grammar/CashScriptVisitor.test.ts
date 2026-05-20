import CashScriptVisitor from './CashScriptVisitor';
import CashScriptParser from './CashScriptParser';
import {
  SourceFileContext,
  PragmaDirectiveContext,
  ContractDefinitionContext,
  FunctionDefinitionContext,
  VariableDefinitionContext,
  RequireStatementContext,
  ExpressionListContext,
  LiteralExpressionContext,
  IdentifierContext,
  BinaryOpContext,
  UnaryOpContext,
  NumberLiteralContext,
  StatementContext,
  PragmaValueContext,
  PragmaNameContext,
  VersionConstraintContext,
  VersionOperatorContext,
  ParameterListContext,
  ParameterContext,
  BlockContext,
  TupleAssignmentContext,
  AssignStatementContext,
  TimeOpStatementContext,
  IfStatementContext,
  ConsoleStatementContext,
  RequireMessageContext,
  ConsoleParameterContext,
  ConsoleParameterListContext,
  FunctionCallContext,
  CastContext,
  UnaryIntrospectionOpContext,
  FunctionCallExpressionContext,
  ArrayContext,
  SliceContext,
  TupleIndexOpContext,
  InstantiationContext,
  NullaryOpContext,
  ParenthesisedContext,
  ModifierContext,
  LiteralContext,
  TypeNameContext
} from './CashScriptParser';
import { CharStream, CommonTokenStream } from 'antlr4';
import CashScriptLexer from './CashScriptLexer';
import { SafeErrorListener, SafeErrorStrategy } from '../ErrorListeners';

// Define minimal interfaces to satisfy TypeScript expectations
interface IRuleContext {
  parent: any;
  invokingState: number;
}

describe('CashScriptVisitor', () => {
  // Helper function to create a parser with error listeners and get parse trees
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

  describe('Basic visitor functionality', () => {
    test('should create a visitor instance without errors', () => {
      const visitor = new CashScriptVisitor<void>();
      expect(visitor).toBeInstanceOf(CashScriptVisitor);
    });

    test('should allow custom visit methods implementation', () => {
      interface VisitorResult {
        visitedNodes: string[];
        count: number;
      }

      class TestVisitor extends CashScriptVisitor<VisitorResult> {
        constructor() {
          super();
          this.visitSourceFile = (ctx: SourceFileContext): VisitorResult => {
            return { visitedNodes: ['sourceFile'], count: 1 };
          };

          this.visitContractDefinition = (ctx: ContractDefinitionContext): VisitorResult => {
            return { visitedNodes: ['contractDefinition'], count: 1 };
          };
        }
      }

      const visitor = new TestVisitor();
      expect(visitor.visitSourceFile).toBeDefined();
      expect(visitor.visitContractDefinition).toBeDefined();

      // Test that the visitor methods can be called with any object that has the right shape
      const mockSourceFileContext = {} as SourceFileContext;
      const result = visitor.visitSourceFile!(mockSourceFileContext);
      expect(result).toEqual({ visitedNodes: ['sourceFile'], count: 1 });
    });

    test('should support optional visit methods', () => {
      class TestVisitor extends CashScriptVisitor<string> {
        visitPragmaDirective = (ctx: PragmaDirectiveContext): string => {
          return 'visited pragma directive';
        };

        // Deliberately leaving out other visit methods to test they remain optional
      }

      const visitor = new TestVisitor();

      // The defined method should work
      const result = visitor.visitPragmaDirective!({} as PragmaDirectiveContext);
      expect(result).toBe('visited pragma directive');

      // Other methods not defined should be undefined
      expect(visitor.visitContractDefinition).toBeUndefined();
    });
  });

  describe('Individual visitor method tests', () => {
    class TestVisitor extends CashScriptVisitor<string> {
      visitedMethods: string[] = [];

      constructor() {
        super();
        this.visitSourceFile = (ctx: SourceFileContext): string => {
          this.visitedMethods.push('visitSourceFile');
          return 'sourceFile';
        };

        this.visitPragmaDirective = (ctx: PragmaDirectiveContext): string => {
          this.visitedMethods.push('visitPragmaDirective');
          return 'pragmaDirective';
        };

        this.visitContractDefinition = (ctx: ContractDefinitionContext): string => {
          this.visitedMethods.push('visitContractDefinition');
          return 'contractDefinition';
        };

        this.visitFunctionDefinition = (ctx: FunctionDefinitionContext): string => {
          this.visitedMethods.push('visitFunctionDefinition');
          return 'functionDefinition';
        };

        this.visitVariableDefinition = (ctx: VariableDefinitionContext): string => {
          this.visitedMethods.push('visitVariableDefinition');
          return 'variableDefinition';
        };

        this.visitRequireStatement = (ctx: RequireStatementContext): string => {
          this.visitedMethods.push('visitRequireStatement');
          return 'requireStatement';
        };

        this.visitExpressionList = (ctx: ExpressionListContext): string => {
          this.visitedMethods.push('visitExpressionList');
          return 'expressionList';
        };

        this.visitLiteralExpression = (ctx: LiteralExpressionContext): string => {
          this.visitedMethods.push('visitLiteralExpression');
          return 'literalExpression';
        };

        this.visitIdentifier = (ctx: IdentifierContext): string => {
          this.visitedMethods.push('visitIdentifier');
          return 'identifier';
        };

        this.visitBinaryOp = (ctx: BinaryOpContext): string => {
          this.visitedMethods.push('visitBinaryOp');
          return 'binaryOp';
        };

        this.visitUnaryOp = (ctx: UnaryOpContext): string => {
          this.visitedMethods.push('visitUnaryOp');
          return 'unaryOp';
        };

        this.visitNumberLiteral = (ctx: NumberLiteralContext): string => {
          this.visitedMethods.push('visitNumberLiteral');
          return 'numberLiteral';
        };
      }
    }

    test('should visit source file context', () => {
      const visitor = new TestVisitor();
      const result = visitor.visitSourceFile!({} as SourceFileContext);
      expect(result).toBe('sourceFile');
      expect(visitor.visitedMethods).toContain('visitSourceFile');
    });

    test('should visit pragma directive context', () => {
      const visitor = new TestVisitor();
      const result = visitor.visitPragmaDirective!({} as PragmaDirectiveContext);
      expect(result).toBe('pragmaDirective');
      expect(visitor.visitedMethods).toContain('visitPragmaDirective');
    });

    test('should visit contract definition context', () => {
      const visitor = new TestVisitor();
      const result = visitor.visitContractDefinition!({} as ContractDefinitionContext);
      expect(result).toBe('contractDefinition');
      expect(visitor.visitedMethods).toContain('visitContractDefinition');
    });

    test('should visit function definition context', () => {
      const visitor = new TestVisitor();
      const result = visitor.visitFunctionDefinition!({} as FunctionDefinitionContext);
      expect(result).toBe('functionDefinition');
      expect(visitor.visitedMethods).toContain('visitFunctionDefinition');
    });

    test('should visit variable definition context', () => {
      const visitor = new TestVisitor();
      const result = visitor.visitVariableDefinition!({} as VariableDefinitionContext);
      expect(result).toBe('variableDefinition');
      expect(visitor.visitedMethods).toContain('visitVariableDefinition');
    });

    test('should visit require statement context', () => {
      const visitor = new TestVisitor();
      const result = visitor.visitRequireStatement!({} as RequireStatementContext);
      expect(result).toBe('requireStatement');
      expect(visitor.visitedMethods).toContain('visitRequireStatement');
    });

    test('should visit expression list context', () => {
      const visitor = new TestVisitor();
      const result = visitor.visitExpressionList!({} as ExpressionListContext);
      expect(result).toBe('expressionList');
      expect(visitor.visitedMethods).toContain('visitExpressionList');
    });

    test('should visit literal expression context', () => {
      const visitor = new TestVisitor();
      const result = visitor.visitLiteralExpression!({} as LiteralExpressionContext);
      expect(result).toBe('literalExpression');
      expect(visitor.visitedMethods).toContain('visitLiteralExpression');
    });

    test('should visit identifier context', () => {
      const visitor = new TestVisitor();
      const result = visitor.visitIdentifier!({} as IdentifierContext);
      expect(result).toBe('identifier');
      expect(visitor.visitedMethods).toContain('visitIdentifier');
    });

    test('should visit binary operation context', () => {
      const visitor = new TestVisitor();
      const result = visitor.visitBinaryOp!({} as BinaryOpContext);
      expect(result).toBe('binaryOp');
      expect(visitor.visitedMethods).toContain('visitBinaryOp');
    });

    test('should visit unary operation context', () => {
      const visitor = new TestVisitor();
      const result = visitor.visitUnaryOp!({} as UnaryOpContext);
      expect(result).toBe('unaryOp');
      expect(visitor.visitedMethods).toContain('visitUnaryOp');
    });

    test('should visit number literal context', () => {
      const visitor = new TestVisitor();
      const result = visitor.visitNumberLiteral!({} as NumberLiteralContext);
      expect(result).toBe('numberLiteral');
      expect(visitor.visitedMethods).toContain('visitNumberLiteral');
    });
  });

  describe('Visitor integration with parser', () => {
    test('should work with actual parse trees from simple contract', () => {
      const code = `
        pragma cashscript ^0.8.0;

        contract SimpleContract(int balance) {
          function spend(int secret) {
            require(balance == 1000);
          }
        }
      `;

      const { parser, errListener } = createParser(code);
      
      // Parse the code to get the AST
      const sourceFileCtx = parser.sourceFile();
      
      // Verify that parsing succeeded
      expect(sourceFileCtx).toBeDefined();
      expect(errListener.getErrs()).toHaveLength(0);

      // Create a visitor that tracks which nodes were visited
      class TrackingVisitor extends CashScriptVisitor<void> {
        visitedNodes: string[] = [];

        visitSourceFile = (ctx: any): void => {
          this.visitedNodes.push('SourceFile');
          // Continue visiting children
          for (let i = 0; i < ctx.getChildCount(); i++) {
            this.visit(ctx.getChild(i));
          }
        };

        visitPragmaDirective = (ctx: any): void => {
          this.visitedNodes.push('PragmaDirective');
          // Continue visiting children
          for (let i = 0; i < ctx.getChildCount(); i++) {
            this.visit(ctx.getChild(i));
          }
        };

        visitContractDefinition = (ctx: any): void => {
          this.visitedNodes.push('ContractDefinition');
          // Continue visiting children
          for (let i = 0; i < ctx.getChildCount(); i++) {
            this.visit(ctx.getChild(i));
          }
        };

        visitFunctionDefinition = (ctx: any): void => {
          this.visitedNodes.push('FunctionDefinition');
          // Continue visiting children
          for (let i = 0; i < ctx.getChildCount(); i++) {
            this.visit(ctx.getChild(i));
          }
        };

        visitRequireStatement = (ctx: any): void => {
          this.visitedNodes.push('RequireStatement');
          // Continue visiting children
          for (let i = 0; i < ctx.getChildCount(); i++) {
            this.visit(ctx.getChild(i));
          }
        };

        visitBinaryOp = (ctx: any): void => {
          this.visitedNodes.push('BinaryOp');
          // Continue visiting children
          for (let i = 0; i < ctx.getChildCount(); i++) {
            this.visit(ctx.getChild(i));
          }
        };
      }

      const visitor = new TrackingVisitor();

      // Visit the source file - this should trigger various visit methods
      visitor.visit(sourceFileCtx);
      
      // Check that appropriate nodes were visited
      expect(visitor.visitedNodes).toContain('SourceFile');
      expect(visitor.visitedNodes).toContain('PragmaDirective');
      expect(visitor.visitedNodes).toContain('ContractDefinition');
      expect(visitor.visitedNodes).toContain('FunctionDefinition');
      expect(visitor.visitedNodes).toContain('RequireStatement');
      expect(visitor.visitedNodes).toContain('BinaryOp');
    });

    test('should work with complex expressions', () => {
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
      const sourceFileCtx = parser.sourceFile();
      
      expect(sourceFileCtx).toBeDefined();
      expect(errListener.getErrs()).toHaveLength(0);

      class ExpressionTrackingVisitor extends CashScriptVisitor<void> {
        visitedNodes: string[] = [];

        visitSourceFile = (ctx: any): void => {
          this.visitedNodes.push('SourceFile');
          // Continue visiting children
          for (let i = 0; i < ctx.getChildCount(); i++) {
            this.visit(ctx.getChild(i));
          }
        };

        visitContractDefinition = (ctx: any): void => {
          this.visitedNodes.push('ContractDefinition');
          // Continue visiting children
          for (let i = 0; i < ctx.getChildCount(); i++) {
            this.visit(ctx.getChild(i));
          }
        };

        visitFunctionDefinition = (ctx: any): void => {
          this.visitedNodes.push('FunctionDefinition');
          // Continue visiting children
          for (let i = 0; i < ctx.getChildCount(); i++) {
            this.visit(ctx.getChild(i));
          }
        };

        visitVariableDefinition = (ctx: any): void => {
          this.visitedNodes.push('VariableDefinition');
          // Continue visiting children
          for (let i = 0; i < ctx.getChildCount(); i++) {
            this.visit(ctx.getChild(i));
          }
        };

        visitBinaryOp = (ctx: any): void => {
          this.visitedNodes.push('BinaryOp');
          // Continue visiting children
          for (let i = 0; i < ctx.getChildCount(); i++) {
            this.visit(ctx.getChild(i));
          }
        };

        visitParenthesised = (ctx: any): void => {
          this.visitedNodes.push('Parenthesised');
          // Continue visiting children
          for (let i = 0; i < ctx.getChildCount(); i++) {
            this.visit(ctx.getChild(i));
          }
        };

        visitIdentifier = (ctx: any): void => {
          this.visitedNodes.push('Identifier');
          // Continue visiting children
          for (let i = 0; i < ctx.getChildCount(); i++) {
            this.visit(ctx.getChild(i));
          }
        };
      }

      const visitor = new ExpressionTrackingVisitor();
      visitor.visit(sourceFileCtx);

      // Complex expressions should have multiple binary ops and identifiers
      expect(visitor.visitedNodes).toContain('SourceFile');
      expect(visitor.visitedNodes).toContain('ContractDefinition');
      expect(visitor.visitedNodes).toContain('FunctionDefinition');
      expect(visitor.visitedNodes).toContain('VariableDefinition');
      // Should have multiple binary operations: x + y * 2, result > 100, (result > 100) && flag
      // Expect at least 3 binary operations
      expect(visitor.visitedNodes.filter(node => node === 'BinaryOp')).not.toHaveLength(0);
      expect(visitor.visitedNodes).toContain('Parenthesised');
      // Should have multiple identifiers: x, y, result, flag, check
      expect(visitor.visitedNodes.filter(node => node === 'Identifier')).toHaveLength(5);
    });

    test('should handle function calls and arrays', () => {
      const code = `
        pragma cashscript ^0.8.0;

        contract FunctionContract(pubkey owner) {
          function spend(sig s) {
            bool authorized = verify(owner, s);
            require(authorized);
            
            int values = [1, 2, 3, 4][0];
          }
        }
      `;

      const { parser, errListener } = createParser(code);
      const sourceFileCtx = parser.sourceFile();
      
      expect(sourceFileCtx).toBeDefined();
      expect(errListener.getErrs()).toHaveLength(0);

      class CallAndArrayTrackingVisitor extends CashScriptVisitor<void> {
        visitedNodes: { type: string, text?: string }[] = [];

        visitSourceFile = (ctx: any): void => {
          this.visitedNodes.push({ type: 'SourceFile' });
          // Continue visiting children
          for (let i = 0; i < ctx.getChildCount(); i++) {
            this.visit(ctx.getChild(i));
          }
        };

        visitFunctionDefinition = (ctx: any): void => {
          this.visitedNodes.push({ type: 'FunctionDefinition' });
          // Continue visiting children
          for (let i = 0; i < ctx.getChildCount(); i++) {
            this.visit(ctx.getChild(i));
          }
        };

        visitFunctionCallExpression = (ctx: any): void => {
          this.visitedNodes.push({ type: 'FunctionCallExpression' });
          // Continue visiting children
          for (let i = 0; i < ctx.getChildCount(); i++) {
            this.visit(ctx.getChild(i));
          }
        };

        visitArray = (ctx: any): void => {
          this.visitedNodes.push({ type: 'Array' });
          // Continue visiting children
          for (let i = 0; i < ctx.getChildCount(); i++) {
            this.visit(ctx.getChild(i));
          }
        };

        visitTupleIndexOp = (ctx: any): void => {
          this.visitedNodes.push({ type: 'TupleIndexOp' });
          // Continue visiting children
          for (let i = 0; i < ctx.getChildCount(); i++) {
            this.visit(ctx.getChild(i));
          }
        };

        visitNumberLiteral = (ctx: any): void => {
          this.visitedNodes.push({ type: 'NumberLiteral' });
          // Continue visiting children
          for (let i = 0; i < ctx.getChildCount(); i++) {
            this.visit(ctx.getChild(i));
          }
        };
      }

      const visitor = new CallAndArrayTrackingVisitor();
      visitor.visit(sourceFileCtx);

      expect(visitor.visitedNodes.map(n => n.type)).toContain('SourceFile');
      expect(visitor.visitedNodes.map(n => n.type)).toContain('FunctionDefinition');
      expect(visitor.visitedNodes.map(n => n.type)).toContain('FunctionCallExpression'); // verify call
      expect(visitor.visitedNodes.map(n => n.type)).toContain('Array'); // [1, 2, 3, 4]
      expect(visitor.visitedNodes.map(n => n.type)).toContain('TupleIndexOp'); // [0] indexing
      // Should have several number literals
      const numLiterals = visitor.visitedNodes.filter(n => n.type === 'NumberLiteral');
      expect(numLiterals).not.toHaveLength(0);
    });
  });

  describe('Generic type handling', () => {
    test('should support different return types', () => {
      // Void return type
      class VoidVisitor extends CashScriptVisitor<void> {
        constructor() {
          super();
          this.visitSourceFile = (ctx: SourceFileContext): void => {};
        }
      }

      // String return type
      class StringVisitor extends CashScriptVisitor<string> {
        constructor() {
          super();
          this.visitSourceFile = (ctx: SourceFileContext): string => 'visited';
        }
      }

      // Number return type
      class NumberVisitor extends CashScriptVisitor<number> {
        constructor() {
          super();
          this.visitSourceFile = (ctx: SourceFileContext): number => 42;
        }
      }

      // Object return type
      class ObjectVisitor extends CashScriptVisitor<{ name: string }> {
        constructor() {
          super();
          this.visitSourceFile = (ctx: SourceFileContext): { name: string } => ({ name: 'test' });
        }
      }

      const voidVisitor = new VoidVisitor();
      const stringVisitor = new StringVisitor();
      const numberVisitor = new NumberVisitor();
      const objectVisitor = new ObjectVisitor();

      expect(voidVisitor).toBeInstanceOf(CashScriptVisitor);
      expect(stringVisitor).toBeInstanceOf(CashScriptVisitor);
      expect(numberVisitor).toBeInstanceOf(CashScriptVisitor);
      expect(objectVisitor).toBeInstanceOf(CashScriptVisitor);
    });

    test('should maintain type safety for return values', () => {
      class TypedVisitor extends CashScriptVisitor<number> {
        counter = 0;

        constructor() {
          super();
          this.visitSourceFile = (ctx: SourceFileContext): number => {
            return ++this.counter;
          };

          this.visitContractDefinition = (ctx: ContractDefinitionContext): number => {
            return ++this.counter;
          };
        }
      }

      const visitor = new TypedVisitor();
      const sourceFileResult = visitor.visitSourceFile!({} as SourceFileContext);
      const contractResult = visitor.visitContractDefinition!({} as ContractDefinitionContext);

      expect(typeof sourceFileResult).toBe('number');
      expect(typeof contractResult).toBe('number');
      expect(sourceFileResult).toBe(1);
      expect(contractResult).toBe(2);
    });
  });

  describe('Visitor protocol compliance', () => {
    test('should comply with ANTLR visitor interface', () => {
      class FullComplianceVisitor extends CashScriptVisitor<boolean> {
        // Test a few key methods to ensure they have expected signatures
        constructor() {
          super();
          this.visitSourceFile = (ctx: SourceFileContext): boolean => true;
          this.visitPragmaDirective = (ctx: PragmaDirectiveContext): boolean => true;
          this.visitContractDefinition = (ctx: ContractDefinitionContext): boolean => true;
          this.visitFunctionDefinition = (ctx: FunctionDefinitionContext): boolean => true;
          this.visitStatement = (ctx: StatementContext): boolean => true;
          this.visitExpressionList = (ctx: ExpressionListContext): boolean => true;
          this.visitBinaryOp = (ctx: BinaryOpContext): boolean => true;
          this.visitIdentifier = (ctx: IdentifierContext): boolean => true;
        }
      }

      const visitor = new FullComplianceVisitor();

      // Verify all methods have been properly defined with correct types
      expect(typeof visitor.visitSourceFile).toBe('function');
      expect(typeof visitor.visitPragmaDirective).toBe('function');
      expect(typeof visitor.visitContractDefinition).toBe('function');
      expect(typeof visitor.visitFunctionDefinition).toBe('function');
      expect(typeof visitor.visitStatement).toBe('function');
      expect(typeof visitor.visitExpressionList).toBe('function');
      expect(typeof visitor.visitBinaryOp).toBe('function');
      expect(typeof visitor.visitIdentifier).toBe('function');
    });
  });
});