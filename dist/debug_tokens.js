"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var antlr4_1 = require("antlr4");
var CashScriptLexer_1 = require("./src/CashscriptLinter/grammar/CashScriptLexer");
var debugLexer = function (code) {
    console.log("Code: ".concat(code));
    console.log('Tokens:');
    var inputStream = new antlr4_1.CharStream(code);
    var lexer = new CashScriptLexer_1.default(inputStream);
    var token;
    var i = 0;
    do {
        token = lexer.nextToken();
        console.log("  [".concat(i, "] type=").concat(token.type, ", text='").concat(token.text, "'"));
        i++;
    } while (token.type !== CashScriptLexer_1.default.EOF);
    console.log('');
};
// Debug various test cases
debugLexer('pragma cashscript ^0.8.0;');
debugLexer('contract MyContract(int x) { }');
debugLexer('function spend(int secret) { }');
debugLexer('require(balance > 100);');
debugLexer('a + b - c * d / e % f == g != h < i > j <= k >= l && m || n ! o');
debugLexer('int bool string pubkey sig datasig');
debugLexer('constant');
debugLexer('  int x = 5  ;  ');
