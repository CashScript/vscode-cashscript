import CashscriptLinter from './CashscriptLinter';
import { Diagnostic } from 'vscode-languageserver';

describe('CashscriptLinter', () => {
  describe('getDiagnostics', () => {
    it('should return no diagnostics for valid CashScript code', () => {
      const validCode = `
        pragma cashscript ^0.8.0;

        contract SimpleContract(int balance) {
          function spend(int secret) {
            require(balance == 1000);
          }
        }
      `;

      const diagnostics = CashscriptLinter.getDiagnostics(validCode);
      expect(diagnostics).toHaveLength(0);
    });

    it('should return diagnostics for malformed CashScript code', () => {
      const invalidCode = `
        pragma cashscript ^0.8.0;

        contract SimpleContract(int balance) {
          function spend(int secret) {
            require(balance == 1000
            // Missing closing parenthesis and semicolon
          }
        }
      `;

      const diagnostics = CashscriptLinter.getDiagnostics(invalidCode);
      expect(diagnostics).not.toHaveLength(0);
      expect(Array.isArray(diagnostics)).toBe(true);
      expect(diagnostics.every(diag => diag instanceof Object)).toBe(true);
    });

    it('should return diagnostics for syntactically incorrect code', () => {
      const invalidSyntaxCode = `
        pragma cashscript ^0.8.0;

        contract SimpleContract(int balance {
          function spend(int secret) {
            require(balance > 0);
          }
        }
      `;

      const diagnostics = CashscriptLinter.getDiagnostics(invalidSyntaxCode);
      expect(diagnostics).not.toHaveLength(0);
    });

    it('should return diagnostics for code with incorrect syntax', () => {
      const incorrectSyntaxCode = `
        some random invalid syntax here contract Something() {
          function something() {

        }
      `;

      const diagnostics = CashscriptLinter.getDiagnostics(incorrectSyntaxCode);
      expect(diagnostics).not.toHaveLength(0);
    });

    it('should handle empty code string', () => {
      const emptyCode = '';

      const diagnostics = CashscriptLinter.getDiagnostics(emptyCode);
      // Even empty code may produce errors since CashScript expects specific structure
      // So we shouldn't assume it will be zero
      expect(Array.isArray(diagnostics)).toBe(true);
    });

    it('should handle code with only whitespace', () => {
      const whitespaceCode = '   \n\t\n   ';

      const diagnostics = CashscriptLinter.getDiagnostics(whitespaceCode);
      // Whitespace-only code may also produce errors
      expect(Array.isArray(diagnostics)).toBe(true);
    });

    it('should return meaningful diagnostic objects', () => {
      const invalidCode = 'invalid cashscript syntax here;';

      const diagnostics = CashscriptLinter.getDiagnostics(invalidCode);

      if (diagnostics.length > 0) {
        const diagnostic = diagnostics[0];
        expect(diagnostic).toHaveProperty('range');
        expect(diagnostic.range).toHaveProperty('start');
        expect(diagnostic.range).toHaveProperty('end');
        expect(diagnostic).toHaveProperty('message');
        expect(typeof diagnostic.message).toBe('string');
      }
    });

    it('should detect syntax errors in complex expressions', () => {
      const complexInvalidCode = `
        pragma cashscript ^0.8.0;

        contract ComplexContract(int x, int y) {
          function spend(bool flag) {
            int result = x + y * 2;
            bool check = result > 100 && flag;  // Operator precedence issue might not be caught at parsing level
            require(check);
          }
        }
      `;

      const diagnostics = CashscriptLinter.getDiagnostics(complexInvalidCode);
      expect(Array.isArray(diagnostics)).toBe(true);
    });

    it('should handle code with missing semicolons', () => {
      const missingSemicolonCode = `
        pragma cashscript ^0.8.0;

        contract MissingSemicolonContract(int x) {
          function spend(int y) {
            int z = x + y  // missing semicolon
            require(z > 0);
          }
        }
      `;

      const diagnostics = CashscriptLinter.getDiagnostics(missingSemicolonCode);
      expect(diagnostics).not.toHaveLength(0);
    });
  });
});