
import { CashScriptLexer } from './src/CashscriptLinter/grammar/CashScriptLexer.js';
import { CharStreams } from 'antlr4ts';

const code = `
        pragma cashscript ^0.8.0;

        contract ComplexContract(int threshold, pubkey owner) {
          function spend(sig signature, int amount) {
            require(verify(owner, signature));
            require(amount > threshold);
          }
        }
      `;

const chars = new CharStreams.fromString(code);
const lexer = new CashScriptLexer(chars);
lexer.removeErrorListeners();

const tokens = [];
let token;
do {
  token = lexer.nextToken();
  tokens.push({ type: token.type, text: token.text });
} while (token.type !== CashScriptLexer.EOF);

console.log('Tokens:', tokens.map(t => `${t.text}(${t.type})`).join(', '));

