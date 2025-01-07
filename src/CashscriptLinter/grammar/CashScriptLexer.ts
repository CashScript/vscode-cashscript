// Generated from src/grammar/CashScript.g4 by ANTLR 4.13.1
// noinspection ES6UnusedImports,JSUnusedGlobalSymbols,JSUnusedLocalSymbols
import {
  ATN,
  ATNDeserializer,
  CharStream,
  DecisionState,
  DFA,
  Lexer,
  LexerATNSimulator,
  RuleContext,
  PredictionContextCache,
  Token,
} from 'antlr4';
export default class CashScriptLexer extends Lexer {
  public static readonly T__0 = 1;
  public static readonly T__1 = 2;
  public static readonly T__2 = 3;
  public static readonly T__3 = 4;
  public static readonly T__4 = 5;
  public static readonly T__5 = 6;
  public static readonly T__6 = 7;
  public static readonly T__7 = 8;
  public static readonly T__8 = 9;
  public static readonly T__9 = 10;
  public static readonly T__10 = 11;
  public static readonly T__11 = 12;
  public static readonly T__12 = 13;
  public static readonly T__13 = 14;
  public static readonly T__14 = 15;
  public static readonly T__15 = 16;
  public static readonly T__16 = 17;
  public static readonly T__17 = 18;
  public static readonly T__18 = 19;
  public static readonly T__19 = 20;
  public static readonly T__20 = 21;
  public static readonly T__21 = 22;
  public static readonly T__22 = 23;
  public static readonly T__23 = 24;
  public static readonly T__24 = 25;
  public static readonly T__25 = 26;
  public static readonly T__26 = 27;
  public static readonly T__27 = 28;
  public static readonly T__28 = 29;
  public static readonly T__29 = 30;
  public static readonly T__30 = 31;
  public static readonly T__31 = 32;
  public static readonly T__32 = 33;
  public static readonly T__33 = 34;
  public static readonly T__34 = 35;
  public static readonly T__35 = 36;
  public static readonly T__36 = 37;
  public static readonly T__37 = 38;
  public static readonly T__38 = 39;
  public static readonly T__39 = 40;
  public static readonly T__40 = 41;
  public static readonly T__41 = 42;
  public static readonly T__42 = 43;
  public static readonly T__43 = 44;
  public static readonly T__44 = 45;
  public static readonly T__45 = 46;
  public static readonly T__46 = 47;
  public static readonly T__47 = 48;
  public static readonly T__48 = 49;
  public static readonly T__49 = 50;
  public static readonly T__50 = 51;
  public static readonly T__51 = 52;
  public static readonly T__52 = 53;
  public static readonly T__53 = 54;
  public static readonly T__54 = 55;
  public static readonly T__55 = 56;
  public static readonly T__56 = 57;
  public static readonly VersionLiteral = 58;
  public static readonly BooleanLiteral = 59;
  public static readonly NumberUnit = 60;
  public static readonly NumberLiteral = 61;
  public static readonly NumberPart = 62;
  public static readonly ExponentPart = 63;
  public static readonly Bytes = 64;
  public static readonly Bound = 65;
  public static readonly StringLiteral = 66;
  public static readonly DateLiteral = 67;
  public static readonly HexLiteral = 68;
  public static readonly TxVar = 69;
  public static readonly NullaryOp = 70;
  public static readonly Identifier = 71;
  public static readonly WHITESPACE = 72;
  public static readonly COMMENT = 73;
  public static readonly LINE_COMMENT = 74;
  public static readonly EOF = Token.EOF;

  public static readonly channelNames: string[] = ['DEFAULT_TOKEN_CHANNEL', 'HIDDEN'];
  public static readonly literalNames: (string | null)[] = [
    null,
    "'pragma'",
    "';'",
    "'cashscript'",
    "'^'",
    "'~'",
    "'>='",
    "'>'",
    "'<'",
    "'<='",
    "'='",
    "'contract'",
    "'{'",
    "'}'",
    "'function'",
    "'('",
    "','",
    "')'",
    "'require'",
    "'if'",
    "'else'",
    "'console.log'",
    "'new'",
    "'['",
    "']'",
    "'tx.outputs'",
    "'.value'",
    "'.lockingBytecode'",
    "'.tokenCategory'",
    "'.nftCommitment'",
    "'.tokenAmount'",
    "'tx.inputs'",
    "'.outpointTransactionHash'",
    "'.outpointIndex'",
    "'.unlockingBytecode'",
    "'.sequenceNumber'",
    "'.reverse()'",
    "'.length'",
    "'.split'",
    "'!'",
    "'-'",
    "'*'",
    "'/'",
    "'%'",
    "'+'",
    "'=='",
    "'!='",
    "'&'",
    "'|'",
    "'&&'",
    "'||'",
    "'constant'",
    "'int'",
    "'bool'",
    "'string'",
    "'pubkey'",
    "'sig'",
    "'datasig'",
  ];
  public static readonly symbolicNames: (string | null)[] = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    'VersionLiteral',
    'BooleanLiteral',
    'NumberUnit',
    'NumberLiteral',
    'NumberPart',
    'ExponentPart',
    'Bytes',
    'Bound',
    'StringLiteral',
    'DateLiteral',
    'HexLiteral',
    'TxVar',
    'NullaryOp',
    'Identifier',
    'WHITESPACE',
    'COMMENT',
    'LINE_COMMENT',
  ];
  public static readonly modeNames: string[] = ['DEFAULT_MODE'];

  public static readonly ruleNames: string[] = [
    'T__0',
    'T__1',
    'T__2',
    'T__3',
    'T__4',
    'T__5',
    'T__6',
    'T__7',
    'T__8',
    'T__9',
    'T__10',
    'T__11',
    'T__12',
    'T__13',
    'T__14',
    'T__15',
    'T__16',
    'T__17',
    'T__18',
    'T__19',
    'T__20',
    'T__21',
    'T__22',
    'T__23',
    'T__24',
    'T__25',
    'T__26',
    'T__27',
    'T__28',
    'T__29',
    'T__30',
    'T__31',
    'T__32',
    'T__33',
    'T__34',
    'T__35',
    'T__36',
    'T__37',
    'T__38',
    'T__39',
    'T__40',
    'T__41',
    'T__42',
    'T__43',
    'T__44',
    'T__45',
    'T__46',
    'T__47',
    'T__48',
    'T__49',
    'T__50',
    'T__51',
    'T__52',
    'T__53',
    'T__54',
    'T__55',
    'T__56',
    'VersionLiteral',
    'BooleanLiteral',
    'NumberUnit',
    'NumberLiteral',
    'NumberPart',
    'ExponentPart',
    'Bytes',
    'Bound',
    'StringLiteral',
    'DateLiteral',
    'HexLiteral',
    'TxVar',
    'NullaryOp',
    'Identifier',
    'WHITESPACE',
    'COMMENT',
    'LINE_COMMENT',
  ];

  constructor(input: CharStream) {
    super(input);
    this._interp = new LexerATNSimulator(
      this,
      CashScriptLexer._ATN,
      CashScriptLexer.DecisionsToDFA,
      new PredictionContextCache(),
    );
  }

  public get grammarFileName(): string {
    return 'CashScript.g4';
  }

  public get literalNames(): (string | null)[] {
    return CashScriptLexer.literalNames;
  }
  public get symbolicNames(): (string | null)[] {
    return CashScriptLexer.symbolicNames;
  }
  public get ruleNames(): string[] {
    return CashScriptLexer.ruleNames;
  }

  public get serializedATN(): number[] {
    return CashScriptLexer._serializedATN;
  }

  public get channelNames(): string[] {
    return CashScriptLexer.channelNames;
  }

  public get modeNames(): string[] {
    return CashScriptLexer.modeNames;
  }

  public static readonly _serializedATN: number[] = [
    4, 0, 74, 834, 6, -1, 2, 0, 7, 0, 2, 1, 7, 1, 2, 2, 7, 2, 2, 3, 7, 3, 2, 4, 7, 4, 2, 5, 7, 5, 2, 6, 7, 6, 2, 7, 7,
    7, 2, 8, 7, 8, 2, 9, 7, 9, 2, 10, 7, 10, 2, 11, 7, 11, 2, 12, 7, 12, 2, 13, 7, 13, 2, 14, 7, 14, 2, 15, 7, 15, 2,
    16, 7, 16, 2, 17, 7, 17, 2, 18, 7, 18, 2, 19, 7, 19, 2, 20, 7, 20, 2, 21, 7, 21, 2, 22, 7, 22, 2, 23, 7, 23, 2, 24,
    7, 24, 2, 25, 7, 25, 2, 26, 7, 26, 2, 27, 7, 27, 2, 28, 7, 28, 2, 29, 7, 29, 2, 30, 7, 30, 2, 31, 7, 31, 2, 32, 7,
    32, 2, 33, 7, 33, 2, 34, 7, 34, 2, 35, 7, 35, 2, 36, 7, 36, 2, 37, 7, 37, 2, 38, 7, 38, 2, 39, 7, 39, 2, 40, 7, 40,
    2, 41, 7, 41, 2, 42, 7, 42, 2, 43, 7, 43, 2, 44, 7, 44, 2, 45, 7, 45, 2, 46, 7, 46, 2, 47, 7, 47, 2, 48, 7, 48, 2,
    49, 7, 49, 2, 50, 7, 50, 2, 51, 7, 51, 2, 52, 7, 52, 2, 53, 7, 53, 2, 54, 7, 54, 2, 55, 7, 55, 2, 56, 7, 56, 2, 57,
    7, 57, 2, 58, 7, 58, 2, 59, 7, 59, 2, 60, 7, 60, 2, 61, 7, 61, 2, 62, 7, 62, 2, 63, 7, 63, 2, 64, 7, 64, 2, 65, 7,
    65, 2, 66, 7, 66, 2, 67, 7, 67, 2, 68, 7, 68, 2, 69, 7, 69, 2, 70, 7, 70, 2, 71, 7, 71, 2, 72, 7, 72, 2, 73, 7, 73,
    1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1,
    2, 1, 3, 1, 3, 1, 4, 1, 4, 1, 5, 1, 5, 1, 5, 1, 6, 1, 6, 1, 7, 1, 7, 1, 8, 1, 8, 1, 8, 1, 9, 1, 9, 1, 10, 1, 10, 1,
    10, 1, 10, 1, 10, 1, 10, 1, 10, 1, 10, 1, 10, 1, 11, 1, 11, 1, 12, 1, 12, 1, 13, 1, 13, 1, 13, 1, 13, 1, 13, 1, 13,
    1, 13, 1, 13, 1, 13, 1, 14, 1, 14, 1, 15, 1, 15, 1, 16, 1, 16, 1, 17, 1, 17, 1, 17, 1, 17, 1, 17, 1, 17, 1, 17, 1,
    17, 1, 18, 1, 18, 1, 18, 1, 19, 1, 19, 1, 19, 1, 19, 1, 19, 1, 20, 1, 20, 1, 20, 1, 20, 1, 20, 1, 20, 1, 20, 1, 20,
    1, 20, 1, 20, 1, 20, 1, 20, 1, 21, 1, 21, 1, 21, 1, 21, 1, 22, 1, 22, 1, 23, 1, 23, 1, 24, 1, 24, 1, 24, 1, 24, 1,
    24, 1, 24, 1, 24, 1, 24, 1, 24, 1, 24, 1, 24, 1, 25, 1, 25, 1, 25, 1, 25, 1, 25, 1, 25, 1, 25, 1, 26, 1, 26, 1, 26,
    1, 26, 1, 26, 1, 26, 1, 26, 1, 26, 1, 26, 1, 26, 1, 26, 1, 26, 1, 26, 1, 26, 1, 26, 1, 26, 1, 26, 1, 27, 1, 27, 1,
    27, 1, 27, 1, 27, 1, 27, 1, 27, 1, 27, 1, 27, 1, 27, 1, 27, 1, 27, 1, 27, 1, 27, 1, 27, 1, 28, 1, 28, 1, 28, 1, 28,
    1, 28, 1, 28, 1, 28, 1, 28, 1, 28, 1, 28, 1, 28, 1, 28, 1, 28, 1, 28, 1, 28, 1, 29, 1, 29, 1, 29, 1, 29, 1, 29, 1,
    29, 1, 29, 1, 29, 1, 29, 1, 29, 1, 29, 1, 29, 1, 29, 1, 30, 1, 30, 1, 30, 1, 30, 1, 30, 1, 30, 1, 30, 1, 30, 1, 30,
    1, 30, 1, 31, 1, 31, 1, 31, 1, 31, 1, 31, 1, 31, 1, 31, 1, 31, 1, 31, 1, 31, 1, 31, 1, 31, 1, 31, 1, 31, 1, 31, 1,
    31, 1, 31, 1, 31, 1, 31, 1, 31, 1, 31, 1, 31, 1, 31, 1, 31, 1, 31, 1, 32, 1, 32, 1, 32, 1, 32, 1, 32, 1, 32, 1, 32,
    1, 32, 1, 32, 1, 32, 1, 32, 1, 32, 1, 32, 1, 32, 1, 32, 1, 33, 1, 33, 1, 33, 1, 33, 1, 33, 1, 33, 1, 33, 1, 33, 1,
    33, 1, 33, 1, 33, 1, 33, 1, 33, 1, 33, 1, 33, 1, 33, 1, 33, 1, 33, 1, 33, 1, 34, 1, 34, 1, 34, 1, 34, 1, 34, 1, 34,
    1, 34, 1, 34, 1, 34, 1, 34, 1, 34, 1, 34, 1, 34, 1, 34, 1, 34, 1, 34, 1, 35, 1, 35, 1, 35, 1, 35, 1, 35, 1, 35, 1,
    35, 1, 35, 1, 35, 1, 35, 1, 35, 1, 36, 1, 36, 1, 36, 1, 36, 1, 36, 1, 36, 1, 36, 1, 36, 1, 37, 1, 37, 1, 37, 1, 37,
    1, 37, 1, 37, 1, 37, 1, 38, 1, 38, 1, 39, 1, 39, 1, 40, 1, 40, 1, 41, 1, 41, 1, 42, 1, 42, 1, 43, 1, 43, 1, 44, 1,
    44, 1, 44, 1, 45, 1, 45, 1, 45, 1, 46, 1, 46, 1, 47, 1, 47, 1, 48, 1, 48, 1, 48, 1, 49, 1, 49, 1, 49, 1, 50, 1, 50,
    1, 50, 1, 50, 1, 50, 1, 50, 1, 50, 1, 50, 1, 50, 1, 51, 1, 51, 1, 51, 1, 51, 1, 52, 1, 52, 1, 52, 1, 52, 1, 52, 1,
    53, 1, 53, 1, 53, 1, 53, 1, 53, 1, 53, 1, 53, 1, 54, 1, 54, 1, 54, 1, 54, 1, 54, 1, 54, 1, 54, 1, 55, 1, 55, 1, 55,
    1, 55, 1, 56, 1, 56, 1, 56, 1, 56, 1, 56, 1, 56, 1, 56, 1, 56, 1, 57, 4, 57, 512, 8, 57, 11, 57, 12, 57, 513, 1, 57,
    1, 57, 4, 57, 518, 8, 57, 11, 57, 12, 57, 519, 1, 57, 1, 57, 4, 57, 524, 8, 57, 11, 57, 12, 57, 525, 1, 58, 1, 58,
    1, 58, 1, 58, 1, 58, 1, 58, 1, 58, 1, 58, 1, 58, 3, 58, 537, 8, 58, 1, 59, 1, 59, 1, 59, 1, 59, 1, 59, 1, 59, 1, 59,
    1, 59, 1, 59, 1, 59, 1, 59, 1, 59, 1, 59, 1, 59, 1, 59, 1, 59, 1, 59, 1, 59, 1, 59, 1, 59, 1, 59, 1, 59, 1, 59, 1,
    59, 1, 59, 1, 59, 1, 59, 1, 59, 1, 59, 1, 59, 1, 59, 1, 59, 1, 59, 1, 59, 1, 59, 1, 59, 1, 59, 1, 59, 1, 59, 1, 59,
    1, 59, 1, 59, 1, 59, 1, 59, 1, 59, 1, 59, 1, 59, 1, 59, 1, 59, 1, 59, 1, 59, 1, 59, 1, 59, 1, 59, 1, 59, 1, 59, 1,
    59, 3, 59, 596, 8, 59, 1, 60, 3, 60, 599, 8, 60, 1, 60, 1, 60, 3, 60, 603, 8, 60, 1, 61, 4, 61, 606, 8, 61, 11, 61,
    12, 61, 607, 1, 61, 1, 61, 4, 61, 612, 8, 61, 11, 61, 12, 61, 613, 5, 61, 616, 8, 61, 10, 61, 12, 61, 619, 9, 61, 1,
    62, 1, 62, 1, 62, 1, 63, 1, 63, 1, 63, 1, 63, 1, 63, 1, 63, 1, 63, 3, 63, 631, 8, 63, 1, 63, 1, 63, 1, 63, 1, 63, 3,
    63, 637, 8, 63, 1, 64, 1, 64, 5, 64, 641, 8, 64, 10, 64, 12, 64, 644, 9, 64, 1, 65, 1, 65, 1, 65, 1, 65, 5, 65, 650,
    8, 65, 10, 65, 12, 65, 653, 9, 65, 1, 65, 1, 65, 1, 65, 1, 65, 1, 65, 5, 65, 660, 8, 65, 10, 65, 12, 65, 663, 9, 65,
    1, 65, 3, 65, 666, 8, 65, 1, 66, 1, 66, 1, 66, 1, 66, 1, 66, 1, 66, 1, 66, 1, 66, 1, 66, 1, 67, 1, 67, 1, 67, 5, 67,
    680, 8, 67, 10, 67, 12, 67, 683, 9, 67, 1, 68, 1, 68, 1, 68, 1, 68, 1, 68, 1, 68, 1, 68, 1, 68, 1, 68, 1, 68, 1, 68,
    1, 68, 1, 68, 3, 68, 698, 8, 68, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69,
    1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1,
    69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69,
    1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1,
    69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69,
    1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 1, 69, 3,
    69, 794, 8, 69, 1, 70, 1, 70, 5, 70, 798, 8, 70, 10, 70, 12, 70, 801, 9, 70, 1, 71, 4, 71, 804, 8, 71, 11, 71, 12,
    71, 805, 1, 71, 1, 71, 1, 72, 1, 72, 1, 72, 1, 72, 5, 72, 814, 8, 72, 10, 72, 12, 72, 817, 9, 72, 1, 72, 1, 72, 1,
    72, 1, 72, 1, 72, 1, 73, 1, 73, 1, 73, 1, 73, 5, 73, 828, 8, 73, 10, 73, 12, 73, 831, 9, 73, 1, 73, 1, 73, 3, 651,
    661, 815, 0, 74, 1, 1, 3, 2, 5, 3, 7, 4, 9, 5, 11, 6, 13, 7, 15, 8, 17, 9, 19, 10, 21, 11, 23, 12, 25, 13, 27, 14,
    29, 15, 31, 16, 33, 17, 35, 18, 37, 19, 39, 20, 41, 21, 43, 22, 45, 23, 47, 24, 49, 25, 51, 26, 53, 27, 55, 28, 57,
    29, 59, 30, 61, 31, 63, 32, 65, 33, 67, 34, 69, 35, 71, 36, 73, 37, 75, 38, 77, 39, 79, 40, 81, 41, 83, 42, 85, 43,
    87, 44, 89, 45, 91, 46, 93, 47, 95, 48, 97, 49, 99, 50, 101, 51, 103, 52, 105, 53, 107, 54, 109, 55, 111, 56, 113,
    57, 115, 58, 117, 59, 119, 60, 121, 61, 123, 62, 125, 63, 127, 64, 129, 65, 131, 66, 133, 67, 135, 68, 137, 69, 139,
    70, 141, 71, 143, 72, 145, 73, 147, 74, 1, 0, 11, 1, 0, 48, 57, 2, 0, 69, 69, 101, 101, 1, 0, 49, 57, 3, 0, 10, 10,
    13, 13, 34, 34, 3, 0, 10, 10, 13, 13, 39, 39, 2, 0, 88, 88, 120, 120, 3, 0, 48, 57, 65, 70, 97, 102, 2, 0, 65, 90,
    97, 122, 4, 0, 48, 57, 65, 90, 95, 95, 97, 122, 3, 0, 9, 10, 12, 13, 32, 32, 2, 0, 10, 10, 13, 13, 870, 0, 1, 1, 0,
    0, 0, 0, 3, 1, 0, 0, 0, 0, 5, 1, 0, 0, 0, 0, 7, 1, 0, 0, 0, 0, 9, 1, 0, 0, 0, 0, 11, 1, 0, 0, 0, 0, 13, 1, 0, 0, 0,
    0, 15, 1, 0, 0, 0, 0, 17, 1, 0, 0, 0, 0, 19, 1, 0, 0, 0, 0, 21, 1, 0, 0, 0, 0, 23, 1, 0, 0, 0, 0, 25, 1, 0, 0, 0, 0,
    27, 1, 0, 0, 0, 0, 29, 1, 0, 0, 0, 0, 31, 1, 0, 0, 0, 0, 33, 1, 0, 0, 0, 0, 35, 1, 0, 0, 0, 0, 37, 1, 0, 0, 0, 0,
    39, 1, 0, 0, 0, 0, 41, 1, 0, 0, 0, 0, 43, 1, 0, 0, 0, 0, 45, 1, 0, 0, 0, 0, 47, 1, 0, 0, 0, 0, 49, 1, 0, 0, 0, 0,
    51, 1, 0, 0, 0, 0, 53, 1, 0, 0, 0, 0, 55, 1, 0, 0, 0, 0, 57, 1, 0, 0, 0, 0, 59, 1, 0, 0, 0, 0, 61, 1, 0, 0, 0, 0,
    63, 1, 0, 0, 0, 0, 65, 1, 0, 0, 0, 0, 67, 1, 0, 0, 0, 0, 69, 1, 0, 0, 0, 0, 71, 1, 0, 0, 0, 0, 73, 1, 0, 0, 0, 0,
    75, 1, 0, 0, 0, 0, 77, 1, 0, 0, 0, 0, 79, 1, 0, 0, 0, 0, 81, 1, 0, 0, 0, 0, 83, 1, 0, 0, 0, 0, 85, 1, 0, 0, 0, 0,
    87, 1, 0, 0, 0, 0, 89, 1, 0, 0, 0, 0, 91, 1, 0, 0, 0, 0, 93, 1, 0, 0, 0, 0, 95, 1, 0, 0, 0, 0, 97, 1, 0, 0, 0, 0,
    99, 1, 0, 0, 0, 0, 101, 1, 0, 0, 0, 0, 103, 1, 0, 0, 0, 0, 105, 1, 0, 0, 0, 0, 107, 1, 0, 0, 0, 0, 109, 1, 0, 0, 0,
    0, 111, 1, 0, 0, 0, 0, 113, 1, 0, 0, 0, 0, 115, 1, 0, 0, 0, 0, 117, 1, 0, 0, 0, 0, 119, 1, 0, 0, 0, 0, 121, 1, 0, 0,
    0, 0, 123, 1, 0, 0, 0, 0, 125, 1, 0, 0, 0, 0, 127, 1, 0, 0, 0, 0, 129, 1, 0, 0, 0, 0, 131, 1, 0, 0, 0, 0, 133, 1, 0,
    0, 0, 0, 135, 1, 0, 0, 0, 0, 137, 1, 0, 0, 0, 0, 139, 1, 0, 0, 0, 0, 141, 1, 0, 0, 0, 0, 143, 1, 0, 0, 0, 0, 145, 1,
    0, 0, 0, 0, 147, 1, 0, 0, 0, 1, 149, 1, 0, 0, 0, 3, 156, 1, 0, 0, 0, 5, 158, 1, 0, 0, 0, 7, 169, 1, 0, 0, 0, 9, 171,
    1, 0, 0, 0, 11, 173, 1, 0, 0, 0, 13, 176, 1, 0, 0, 0, 15, 178, 1, 0, 0, 0, 17, 180, 1, 0, 0, 0, 19, 183, 1, 0, 0, 0,
    21, 185, 1, 0, 0, 0, 23, 194, 1, 0, 0, 0, 25, 196, 1, 0, 0, 0, 27, 198, 1, 0, 0, 0, 29, 207, 1, 0, 0, 0, 31, 209, 1,
    0, 0, 0, 33, 211, 1, 0, 0, 0, 35, 213, 1, 0, 0, 0, 37, 221, 1, 0, 0, 0, 39, 224, 1, 0, 0, 0, 41, 229, 1, 0, 0, 0,
    43, 241, 1, 0, 0, 0, 45, 245, 1, 0, 0, 0, 47, 247, 1, 0, 0, 0, 49, 249, 1, 0, 0, 0, 51, 260, 1, 0, 0, 0, 53, 267, 1,
    0, 0, 0, 55, 284, 1, 0, 0, 0, 57, 299, 1, 0, 0, 0, 59, 314, 1, 0, 0, 0, 61, 327, 1, 0, 0, 0, 63, 337, 1, 0, 0, 0,
    65, 362, 1, 0, 0, 0, 67, 377, 1, 0, 0, 0, 69, 396, 1, 0, 0, 0, 71, 412, 1, 0, 0, 0, 73, 423, 1, 0, 0, 0, 75, 431, 1,
    0, 0, 0, 77, 438, 1, 0, 0, 0, 79, 440, 1, 0, 0, 0, 81, 442, 1, 0, 0, 0, 83, 444, 1, 0, 0, 0, 85, 446, 1, 0, 0, 0,
    87, 448, 1, 0, 0, 0, 89, 450, 1, 0, 0, 0, 91, 453, 1, 0, 0, 0, 93, 456, 1, 0, 0, 0, 95, 458, 1, 0, 0, 0, 97, 460, 1,
    0, 0, 0, 99, 463, 1, 0, 0, 0, 101, 466, 1, 0, 0, 0, 103, 475, 1, 0, 0, 0, 105, 479, 1, 0, 0, 0, 107, 484, 1, 0, 0,
    0, 109, 491, 1, 0, 0, 0, 111, 498, 1, 0, 0, 0, 113, 502, 1, 0, 0, 0, 115, 511, 1, 0, 0, 0, 117, 536, 1, 0, 0, 0,
    119, 595, 1, 0, 0, 0, 121, 598, 1, 0, 0, 0, 123, 605, 1, 0, 0, 0, 125, 620, 1, 0, 0, 0, 127, 636, 1, 0, 0, 0, 129,
    638, 1, 0, 0, 0, 131, 665, 1, 0, 0, 0, 133, 667, 1, 0, 0, 0, 135, 676, 1, 0, 0, 0, 137, 697, 1, 0, 0, 0, 139, 793,
    1, 0, 0, 0, 141, 795, 1, 0, 0, 0, 143, 803, 1, 0, 0, 0, 145, 809, 1, 0, 0, 0, 147, 823, 1, 0, 0, 0, 149, 150, 5,
    112, 0, 0, 150, 151, 5, 114, 0, 0, 151, 152, 5, 97, 0, 0, 152, 153, 5, 103, 0, 0, 153, 154, 5, 109, 0, 0, 154, 155,
    5, 97, 0, 0, 155, 2, 1, 0, 0, 0, 156, 157, 5, 59, 0, 0, 157, 4, 1, 0, 0, 0, 158, 159, 5, 99, 0, 0, 159, 160, 5, 97,
    0, 0, 160, 161, 5, 115, 0, 0, 161, 162, 5, 104, 0, 0, 162, 163, 5, 115, 0, 0, 163, 164, 5, 99, 0, 0, 164, 165, 5,
    114, 0, 0, 165, 166, 5, 105, 0, 0, 166, 167, 5, 112, 0, 0, 167, 168, 5, 116, 0, 0, 168, 6, 1, 0, 0, 0, 169, 170, 5,
    94, 0, 0, 170, 8, 1, 0, 0, 0, 171, 172, 5, 126, 0, 0, 172, 10, 1, 0, 0, 0, 173, 174, 5, 62, 0, 0, 174, 175, 5, 61,
    0, 0, 175, 12, 1, 0, 0, 0, 176, 177, 5, 62, 0, 0, 177, 14, 1, 0, 0, 0, 178, 179, 5, 60, 0, 0, 179, 16, 1, 0, 0, 0,
    180, 181, 5, 60, 0, 0, 181, 182, 5, 61, 0, 0, 182, 18, 1, 0, 0, 0, 183, 184, 5, 61, 0, 0, 184, 20, 1, 0, 0, 0, 185,
    186, 5, 99, 0, 0, 186, 187, 5, 111, 0, 0, 187, 188, 5, 110, 0, 0, 188, 189, 5, 116, 0, 0, 189, 190, 5, 114, 0, 0,
    190, 191, 5, 97, 0, 0, 191, 192, 5, 99, 0, 0, 192, 193, 5, 116, 0, 0, 193, 22, 1, 0, 0, 0, 194, 195, 5, 123, 0, 0,
    195, 24, 1, 0, 0, 0, 196, 197, 5, 125, 0, 0, 197, 26, 1, 0, 0, 0, 198, 199, 5, 102, 0, 0, 199, 200, 5, 117, 0, 0,
    200, 201, 5, 110, 0, 0, 201, 202, 5, 99, 0, 0, 202, 203, 5, 116, 0, 0, 203, 204, 5, 105, 0, 0, 204, 205, 5, 111, 0,
    0, 205, 206, 5, 110, 0, 0, 206, 28, 1, 0, 0, 0, 207, 208, 5, 40, 0, 0, 208, 30, 1, 0, 0, 0, 209, 210, 5, 44, 0, 0,
    210, 32, 1, 0, 0, 0, 211, 212, 5, 41, 0, 0, 212, 34, 1, 0, 0, 0, 213, 214, 5, 114, 0, 0, 214, 215, 5, 101, 0, 0,
    215, 216, 5, 113, 0, 0, 216, 217, 5, 117, 0, 0, 217, 218, 5, 105, 0, 0, 218, 219, 5, 114, 0, 0, 219, 220, 5, 101, 0,
    0, 220, 36, 1, 0, 0, 0, 221, 222, 5, 105, 0, 0, 222, 223, 5, 102, 0, 0, 223, 38, 1, 0, 0, 0, 224, 225, 5, 101, 0, 0,
    225, 226, 5, 108, 0, 0, 226, 227, 5, 115, 0, 0, 227, 228, 5, 101, 0, 0, 228, 40, 1, 0, 0, 0, 229, 230, 5, 99, 0, 0,
    230, 231, 5, 111, 0, 0, 231, 232, 5, 110, 0, 0, 232, 233, 5, 115, 0, 0, 233, 234, 5, 111, 0, 0, 234, 235, 5, 108, 0,
    0, 235, 236, 5, 101, 0, 0, 236, 237, 5, 46, 0, 0, 237, 238, 5, 108, 0, 0, 238, 239, 5, 111, 0, 0, 239, 240, 5, 103,
    0, 0, 240, 42, 1, 0, 0, 0, 241, 242, 5, 110, 0, 0, 242, 243, 5, 101, 0, 0, 243, 244, 5, 119, 0, 0, 244, 44, 1, 0, 0,
    0, 245, 246, 5, 91, 0, 0, 246, 46, 1, 0, 0, 0, 247, 248, 5, 93, 0, 0, 248, 48, 1, 0, 0, 0, 249, 250, 5, 116, 0, 0,
    250, 251, 5, 120, 0, 0, 251, 252, 5, 46, 0, 0, 252, 253, 5, 111, 0, 0, 253, 254, 5, 117, 0, 0, 254, 255, 5, 116, 0,
    0, 255, 256, 5, 112, 0, 0, 256, 257, 5, 117, 0, 0, 257, 258, 5, 116, 0, 0, 258, 259, 5, 115, 0, 0, 259, 50, 1, 0, 0,
    0, 260, 261, 5, 46, 0, 0, 261, 262, 5, 118, 0, 0, 262, 263, 5, 97, 0, 0, 263, 264, 5, 108, 0, 0, 264, 265, 5, 117,
    0, 0, 265, 266, 5, 101, 0, 0, 266, 52, 1, 0, 0, 0, 267, 268, 5, 46, 0, 0, 268, 269, 5, 108, 0, 0, 269, 270, 5, 111,
    0, 0, 270, 271, 5, 99, 0, 0, 271, 272, 5, 107, 0, 0, 272, 273, 5, 105, 0, 0, 273, 274, 5, 110, 0, 0, 274, 275, 5,
    103, 0, 0, 275, 276, 5, 66, 0, 0, 276, 277, 5, 121, 0, 0, 277, 278, 5, 116, 0, 0, 278, 279, 5, 101, 0, 0, 279, 280,
    5, 99, 0, 0, 280, 281, 5, 111, 0, 0, 281, 282, 5, 100, 0, 0, 282, 283, 5, 101, 0, 0, 283, 54, 1, 0, 0, 0, 284, 285,
    5, 46, 0, 0, 285, 286, 5, 116, 0, 0, 286, 287, 5, 111, 0, 0, 287, 288, 5, 107, 0, 0, 288, 289, 5, 101, 0, 0, 289,
    290, 5, 110, 0, 0, 290, 291, 5, 67, 0, 0, 291, 292, 5, 97, 0, 0, 292, 293, 5, 116, 0, 0, 293, 294, 5, 101, 0, 0,
    294, 295, 5, 103, 0, 0, 295, 296, 5, 111, 0, 0, 296, 297, 5, 114, 0, 0, 297, 298, 5, 121, 0, 0, 298, 56, 1, 0, 0, 0,
    299, 300, 5, 46, 0, 0, 300, 301, 5, 110, 0, 0, 301, 302, 5, 102, 0, 0, 302, 303, 5, 116, 0, 0, 303, 304, 5, 67, 0,
    0, 304, 305, 5, 111, 0, 0, 305, 306, 5, 109, 0, 0, 306, 307, 5, 109, 0, 0, 307, 308, 5, 105, 0, 0, 308, 309, 5, 116,
    0, 0, 309, 310, 5, 109, 0, 0, 310, 311, 5, 101, 0, 0, 311, 312, 5, 110, 0, 0, 312, 313, 5, 116, 0, 0, 313, 58, 1, 0,
    0, 0, 314, 315, 5, 46, 0, 0, 315, 316, 5, 116, 0, 0, 316, 317, 5, 111, 0, 0, 317, 318, 5, 107, 0, 0, 318, 319, 5,
    101, 0, 0, 319, 320, 5, 110, 0, 0, 320, 321, 5, 65, 0, 0, 321, 322, 5, 109, 0, 0, 322, 323, 5, 111, 0, 0, 323, 324,
    5, 117, 0, 0, 324, 325, 5, 110, 0, 0, 325, 326, 5, 116, 0, 0, 326, 60, 1, 0, 0, 0, 327, 328, 5, 116, 0, 0, 328, 329,
    5, 120, 0, 0, 329, 330, 5, 46, 0, 0, 330, 331, 5, 105, 0, 0, 331, 332, 5, 110, 0, 0, 332, 333, 5, 112, 0, 0, 333,
    334, 5, 117, 0, 0, 334, 335, 5, 116, 0, 0, 335, 336, 5, 115, 0, 0, 336, 62, 1, 0, 0, 0, 337, 338, 5, 46, 0, 0, 338,
    339, 5, 111, 0, 0, 339, 340, 5, 117, 0, 0, 340, 341, 5, 116, 0, 0, 341, 342, 5, 112, 0, 0, 342, 343, 5, 111, 0, 0,
    343, 344, 5, 105, 0, 0, 344, 345, 5, 110, 0, 0, 345, 346, 5, 116, 0, 0, 346, 347, 5, 84, 0, 0, 347, 348, 5, 114, 0,
    0, 348, 349, 5, 97, 0, 0, 349, 350, 5, 110, 0, 0, 350, 351, 5, 115, 0, 0, 351, 352, 5, 97, 0, 0, 352, 353, 5, 99, 0,
    0, 353, 354, 5, 116, 0, 0, 354, 355, 5, 105, 0, 0, 355, 356, 5, 111, 0, 0, 356, 357, 5, 110, 0, 0, 357, 358, 5, 72,
    0, 0, 358, 359, 5, 97, 0, 0, 359, 360, 5, 115, 0, 0, 360, 361, 5, 104, 0, 0, 361, 64, 1, 0, 0, 0, 362, 363, 5, 46,
    0, 0, 363, 364, 5, 111, 0, 0, 364, 365, 5, 117, 0, 0, 365, 366, 5, 116, 0, 0, 366, 367, 5, 112, 0, 0, 367, 368, 5,
    111, 0, 0, 368, 369, 5, 105, 0, 0, 369, 370, 5, 110, 0, 0, 370, 371, 5, 116, 0, 0, 371, 372, 5, 73, 0, 0, 372, 373,
    5, 110, 0, 0, 373, 374, 5, 100, 0, 0, 374, 375, 5, 101, 0, 0, 375, 376, 5, 120, 0, 0, 376, 66, 1, 0, 0, 0, 377, 378,
    5, 46, 0, 0, 378, 379, 5, 117, 0, 0, 379, 380, 5, 110, 0, 0, 380, 381, 5, 108, 0, 0, 381, 382, 5, 111, 0, 0, 382,
    383, 5, 99, 0, 0, 383, 384, 5, 107, 0, 0, 384, 385, 5, 105, 0, 0, 385, 386, 5, 110, 0, 0, 386, 387, 5, 103, 0, 0,
    387, 388, 5, 66, 0, 0, 388, 389, 5, 121, 0, 0, 389, 390, 5, 116, 0, 0, 390, 391, 5, 101, 0, 0, 391, 392, 5, 99, 0,
    0, 392, 393, 5, 111, 0, 0, 393, 394, 5, 100, 0, 0, 394, 395, 5, 101, 0, 0, 395, 68, 1, 0, 0, 0, 396, 397, 5, 46, 0,
    0, 397, 398, 5, 115, 0, 0, 398, 399, 5, 101, 0, 0, 399, 400, 5, 113, 0, 0, 400, 401, 5, 117, 0, 0, 401, 402, 5, 101,
    0, 0, 402, 403, 5, 110, 0, 0, 403, 404, 5, 99, 0, 0, 404, 405, 5, 101, 0, 0, 405, 406, 5, 78, 0, 0, 406, 407, 5,
    117, 0, 0, 407, 408, 5, 109, 0, 0, 408, 409, 5, 98, 0, 0, 409, 410, 5, 101, 0, 0, 410, 411, 5, 114, 0, 0, 411, 70,
    1, 0, 0, 0, 412, 413, 5, 46, 0, 0, 413, 414, 5, 114, 0, 0, 414, 415, 5, 101, 0, 0, 415, 416, 5, 118, 0, 0, 416, 417,
    5, 101, 0, 0, 417, 418, 5, 114, 0, 0, 418, 419, 5, 115, 0, 0, 419, 420, 5, 101, 0, 0, 420, 421, 5, 40, 0, 0, 421,
    422, 5, 41, 0, 0, 422, 72, 1, 0, 0, 0, 423, 424, 5, 46, 0, 0, 424, 425, 5, 108, 0, 0, 425, 426, 5, 101, 0, 0, 426,
    427, 5, 110, 0, 0, 427, 428, 5, 103, 0, 0, 428, 429, 5, 116, 0, 0, 429, 430, 5, 104, 0, 0, 430, 74, 1, 0, 0, 0, 431,
    432, 5, 46, 0, 0, 432, 433, 5, 115, 0, 0, 433, 434, 5, 112, 0, 0, 434, 435, 5, 108, 0, 0, 435, 436, 5, 105, 0, 0,
    436, 437, 5, 116, 0, 0, 437, 76, 1, 0, 0, 0, 438, 439, 5, 33, 0, 0, 439, 78, 1, 0, 0, 0, 440, 441, 5, 45, 0, 0, 441,
    80, 1, 0, 0, 0, 442, 443, 5, 42, 0, 0, 443, 82, 1, 0, 0, 0, 444, 445, 5, 47, 0, 0, 445, 84, 1, 0, 0, 0, 446, 447, 5,
    37, 0, 0, 447, 86, 1, 0, 0, 0, 448, 449, 5, 43, 0, 0, 449, 88, 1, 0, 0, 0, 450, 451, 5, 61, 0, 0, 451, 452, 5, 61,
    0, 0, 452, 90, 1, 0, 0, 0, 453, 454, 5, 33, 0, 0, 454, 455, 5, 61, 0, 0, 455, 92, 1, 0, 0, 0, 456, 457, 5, 38, 0, 0,
    457, 94, 1, 0, 0, 0, 458, 459, 5, 124, 0, 0, 459, 96, 1, 0, 0, 0, 460, 461, 5, 38, 0, 0, 461, 462, 5, 38, 0, 0, 462,
    98, 1, 0, 0, 0, 463, 464, 5, 124, 0, 0, 464, 465, 5, 124, 0, 0, 465, 100, 1, 0, 0, 0, 466, 467, 5, 99, 0, 0, 467,
    468, 5, 111, 0, 0, 468, 469, 5, 110, 0, 0, 469, 470, 5, 115, 0, 0, 470, 471, 5, 116, 0, 0, 471, 472, 5, 97, 0, 0,
    472, 473, 5, 110, 0, 0, 473, 474, 5, 116, 0, 0, 474, 102, 1, 0, 0, 0, 475, 476, 5, 105, 0, 0, 476, 477, 5, 110, 0,
    0, 477, 478, 5, 116, 0, 0, 478, 104, 1, 0, 0, 0, 479, 480, 5, 98, 0, 0, 480, 481, 5, 111, 0, 0, 481, 482, 5, 111, 0,
    0, 482, 483, 5, 108, 0, 0, 483, 106, 1, 0, 0, 0, 484, 485, 5, 115, 0, 0, 485, 486, 5, 116, 0, 0, 486, 487, 5, 114,
    0, 0, 487, 488, 5, 105, 0, 0, 488, 489, 5, 110, 0, 0, 489, 490, 5, 103, 0, 0, 490, 108, 1, 0, 0, 0, 491, 492, 5,
    112, 0, 0, 492, 493, 5, 117, 0, 0, 493, 494, 5, 98, 0, 0, 494, 495, 5, 107, 0, 0, 495, 496, 5, 101, 0, 0, 496, 497,
    5, 121, 0, 0, 497, 110, 1, 0, 0, 0, 498, 499, 5, 115, 0, 0, 499, 500, 5, 105, 0, 0, 500, 501, 5, 103, 0, 0, 501,
    112, 1, 0, 0, 0, 502, 503, 5, 100, 0, 0, 503, 504, 5, 97, 0, 0, 504, 505, 5, 116, 0, 0, 505, 506, 5, 97, 0, 0, 506,
    507, 5, 115, 0, 0, 507, 508, 5, 105, 0, 0, 508, 509, 5, 103, 0, 0, 509, 114, 1, 0, 0, 0, 510, 512, 7, 0, 0, 0, 511,
    510, 1, 0, 0, 0, 512, 513, 1, 0, 0, 0, 513, 511, 1, 0, 0, 0, 513, 514, 1, 0, 0, 0, 514, 515, 1, 0, 0, 0, 515, 517,
    5, 46, 0, 0, 516, 518, 7, 0, 0, 0, 517, 516, 1, 0, 0, 0, 518, 519, 1, 0, 0, 0, 519, 517, 1, 0, 0, 0, 519, 520, 1, 0,
    0, 0, 520, 521, 1, 0, 0, 0, 521, 523, 5, 46, 0, 0, 522, 524, 7, 0, 0, 0, 523, 522, 1, 0, 0, 0, 524, 525, 1, 0, 0, 0,
    525, 523, 1, 0, 0, 0, 525, 526, 1, 0, 0, 0, 526, 116, 1, 0, 0, 0, 527, 528, 5, 116, 0, 0, 528, 529, 5, 114, 0, 0,
    529, 530, 5, 117, 0, 0, 530, 537, 5, 101, 0, 0, 531, 532, 5, 102, 0, 0, 532, 533, 5, 97, 0, 0, 533, 534, 5, 108, 0,
    0, 534, 535, 5, 115, 0, 0, 535, 537, 5, 101, 0, 0, 536, 527, 1, 0, 0, 0, 536, 531, 1, 0, 0, 0, 537, 118, 1, 0, 0, 0,
    538, 539, 5, 115, 0, 0, 539, 540, 5, 97, 0, 0, 540, 541, 5, 116, 0, 0, 541, 542, 5, 111, 0, 0, 542, 543, 5, 115, 0,
    0, 543, 544, 5, 104, 0, 0, 544, 545, 5, 105, 0, 0, 545, 596, 5, 115, 0, 0, 546, 547, 5, 115, 0, 0, 547, 548, 5, 97,
    0, 0, 548, 549, 5, 116, 0, 0, 549, 596, 5, 115, 0, 0, 550, 551, 5, 102, 0, 0, 551, 552, 5, 105, 0, 0, 552, 553, 5,
    110, 0, 0, 553, 554, 5, 110, 0, 0, 554, 555, 5, 101, 0, 0, 555, 596, 5, 121, 0, 0, 556, 557, 5, 98, 0, 0, 557, 558,
    5, 105, 0, 0, 558, 559, 5, 116, 0, 0, 559, 596, 5, 115, 0, 0, 560, 561, 5, 98, 0, 0, 561, 562, 5, 105, 0, 0, 562,
    563, 5, 116, 0, 0, 563, 564, 5, 99, 0, 0, 564, 565, 5, 111, 0, 0, 565, 566, 5, 105, 0, 0, 566, 596, 5, 110, 0, 0,
    567, 568, 5, 115, 0, 0, 568, 569, 5, 101, 0, 0, 569, 570, 5, 99, 0, 0, 570, 571, 5, 111, 0, 0, 571, 572, 5, 110, 0,
    0, 572, 573, 5, 100, 0, 0, 573, 596, 5, 115, 0, 0, 574, 575, 5, 109, 0, 0, 575, 576, 5, 105, 0, 0, 576, 577, 5, 110,
    0, 0, 577, 578, 5, 117, 0, 0, 578, 579, 5, 116, 0, 0, 579, 580, 5, 101, 0, 0, 580, 596, 5, 115, 0, 0, 581, 582, 5,
    104, 0, 0, 582, 583, 5, 111, 0, 0, 583, 584, 5, 117, 0, 0, 584, 585, 5, 114, 0, 0, 585, 596, 5, 115, 0, 0, 586, 587,
    5, 100, 0, 0, 587, 588, 5, 97, 0, 0, 588, 589, 5, 121, 0, 0, 589, 596, 5, 115, 0, 0, 590, 591, 5, 119, 0, 0, 591,
    592, 5, 101, 0, 0, 592, 593, 5, 101, 0, 0, 593, 594, 5, 107, 0, 0, 594, 596, 5, 115, 0, 0, 595, 538, 1, 0, 0, 0,
    595, 546, 1, 0, 0, 0, 595, 550, 1, 0, 0, 0, 595, 556, 1, 0, 0, 0, 595, 560, 1, 0, 0, 0, 595, 567, 1, 0, 0, 0, 595,
    574, 1, 0, 0, 0, 595, 581, 1, 0, 0, 0, 595, 586, 1, 0, 0, 0, 595, 590, 1, 0, 0, 0, 596, 120, 1, 0, 0, 0, 597, 599,
    5, 45, 0, 0, 598, 597, 1, 0, 0, 0, 598, 599, 1, 0, 0, 0, 599, 600, 1, 0, 0, 0, 600, 602, 3, 123, 61, 0, 601, 603, 3,
    125, 62, 0, 602, 601, 1, 0, 0, 0, 602, 603, 1, 0, 0, 0, 603, 122, 1, 0, 0, 0, 604, 606, 7, 0, 0, 0, 605, 604, 1, 0,
    0, 0, 606, 607, 1, 0, 0, 0, 607, 605, 1, 0, 0, 0, 607, 608, 1, 0, 0, 0, 608, 617, 1, 0, 0, 0, 609, 611, 5, 95, 0, 0,
    610, 612, 7, 0, 0, 0, 611, 610, 1, 0, 0, 0, 612, 613, 1, 0, 0, 0, 613, 611, 1, 0, 0, 0, 613, 614, 1, 0, 0, 0, 614,
    616, 1, 0, 0, 0, 615, 609, 1, 0, 0, 0, 616, 619, 1, 0, 0, 0, 617, 615, 1, 0, 0, 0, 617, 618, 1, 0, 0, 0, 618, 124,
    1, 0, 0, 0, 619, 617, 1, 0, 0, 0, 620, 621, 7, 1, 0, 0, 621, 622, 3, 123, 61, 0, 622, 126, 1, 0, 0, 0, 623, 624, 5,
    98, 0, 0, 624, 625, 5, 121, 0, 0, 625, 626, 5, 116, 0, 0, 626, 627, 5, 101, 0, 0, 627, 628, 5, 115, 0, 0, 628, 630,
    1, 0, 0, 0, 629, 631, 3, 129, 64, 0, 630, 629, 1, 0, 0, 0, 630, 631, 1, 0, 0, 0, 631, 637, 1, 0, 0, 0, 632, 633, 5,
    98, 0, 0, 633, 634, 5, 121, 0, 0, 634, 635, 5, 116, 0, 0, 635, 637, 5, 101, 0, 0, 636, 623, 1, 0, 0, 0, 636, 632, 1,
    0, 0, 0, 637, 128, 1, 0, 0, 0, 638, 642, 7, 2, 0, 0, 639, 641, 7, 0, 0, 0, 640, 639, 1, 0, 0, 0, 641, 644, 1, 0, 0,
    0, 642, 640, 1, 0, 0, 0, 642, 643, 1, 0, 0, 0, 643, 130, 1, 0, 0, 0, 644, 642, 1, 0, 0, 0, 645, 651, 5, 34, 0, 0,
    646, 647, 5, 92, 0, 0, 647, 650, 5, 34, 0, 0, 648, 650, 8, 3, 0, 0, 649, 646, 1, 0, 0, 0, 649, 648, 1, 0, 0, 0, 650,
    653, 1, 0, 0, 0, 651, 652, 1, 0, 0, 0, 651, 649, 1, 0, 0, 0, 652, 654, 1, 0, 0, 0, 653, 651, 1, 0, 0, 0, 654, 666,
    5, 34, 0, 0, 655, 661, 5, 39, 0, 0, 656, 657, 5, 92, 0, 0, 657, 660, 5, 39, 0, 0, 658, 660, 8, 4, 0, 0, 659, 656, 1,
    0, 0, 0, 659, 658, 1, 0, 0, 0, 660, 663, 1, 0, 0, 0, 661, 662, 1, 0, 0, 0, 661, 659, 1, 0, 0, 0, 662, 664, 1, 0, 0,
    0, 663, 661, 1, 0, 0, 0, 664, 666, 5, 39, 0, 0, 665, 645, 1, 0, 0, 0, 665, 655, 1, 0, 0, 0, 666, 132, 1, 0, 0, 0,
    667, 668, 5, 100, 0, 0, 668, 669, 5, 97, 0, 0, 669, 670, 5, 116, 0, 0, 670, 671, 5, 101, 0, 0, 671, 672, 5, 40, 0,
    0, 672, 673, 1, 0, 0, 0, 673, 674, 3, 131, 65, 0, 674, 675, 5, 41, 0, 0, 675, 134, 1, 0, 0, 0, 676, 677, 5, 48, 0,
    0, 677, 681, 7, 5, 0, 0, 678, 680, 7, 6, 0, 0, 679, 678, 1, 0, 0, 0, 680, 683, 1, 0, 0, 0, 681, 679, 1, 0, 0, 0,
    681, 682, 1, 0, 0, 0, 682, 136, 1, 0, 0, 0, 683, 681, 1, 0, 0, 0, 684, 685, 5, 116, 0, 0, 685, 686, 5, 120, 0, 0,
    686, 687, 5, 46, 0, 0, 687, 688, 5, 97, 0, 0, 688, 689, 5, 103, 0, 0, 689, 698, 5, 101, 0, 0, 690, 691, 5, 116, 0,
    0, 691, 692, 5, 120, 0, 0, 692, 693, 5, 46, 0, 0, 693, 694, 5, 116, 0, 0, 694, 695, 5, 105, 0, 0, 695, 696, 5, 109,
    0, 0, 696, 698, 5, 101, 0, 0, 697, 684, 1, 0, 0, 0, 697, 690, 1, 0, 0, 0, 698, 138, 1, 0, 0, 0, 699, 700, 5, 116, 0,
    0, 700, 701, 5, 104, 0, 0, 701, 702, 5, 105, 0, 0, 702, 703, 5, 115, 0, 0, 703, 704, 5, 46, 0, 0, 704, 705, 5, 97,
    0, 0, 705, 706, 5, 99, 0, 0, 706, 707, 5, 116, 0, 0, 707, 708, 5, 105, 0, 0, 708, 709, 5, 118, 0, 0, 709, 710, 5,
    101, 0, 0, 710, 711, 5, 73, 0, 0, 711, 712, 5, 110, 0, 0, 712, 713, 5, 112, 0, 0, 713, 714, 5, 117, 0, 0, 714, 715,
    5, 116, 0, 0, 715, 716, 5, 73, 0, 0, 716, 717, 5, 110, 0, 0, 717, 718, 5, 100, 0, 0, 718, 719, 5, 101, 0, 0, 719,
    794, 5, 120, 0, 0, 720, 721, 5, 116, 0, 0, 721, 722, 5, 104, 0, 0, 722, 723, 5, 105, 0, 0, 723, 724, 5, 115, 0, 0,
    724, 725, 5, 46, 0, 0, 725, 726, 5, 97, 0, 0, 726, 727, 5, 99, 0, 0, 727, 728, 5, 116, 0, 0, 728, 729, 5, 105, 0, 0,
    729, 730, 5, 118, 0, 0, 730, 731, 5, 101, 0, 0, 731, 732, 5, 66, 0, 0, 732, 733, 5, 121, 0, 0, 733, 734, 5, 116, 0,
    0, 734, 735, 5, 101, 0, 0, 735, 736, 5, 99, 0, 0, 736, 737, 5, 111, 0, 0, 737, 738, 5, 100, 0, 0, 738, 794, 5, 101,
    0, 0, 739, 740, 5, 116, 0, 0, 740, 741, 5, 120, 0, 0, 741, 742, 5, 46, 0, 0, 742, 743, 5, 105, 0, 0, 743, 744, 5,
    110, 0, 0, 744, 745, 5, 112, 0, 0, 745, 746, 5, 117, 0, 0, 746, 747, 5, 116, 0, 0, 747, 748, 5, 115, 0, 0, 748, 749,
    5, 46, 0, 0, 749, 750, 5, 108, 0, 0, 750, 751, 5, 101, 0, 0, 751, 752, 5, 110, 0, 0, 752, 753, 5, 103, 0, 0, 753,
    754, 5, 116, 0, 0, 754, 794, 5, 104, 0, 0, 755, 756, 5, 116, 0, 0, 756, 757, 5, 120, 0, 0, 757, 758, 5, 46, 0, 0,
    758, 759, 5, 111, 0, 0, 759, 760, 5, 117, 0, 0, 760, 761, 5, 116, 0, 0, 761, 762, 5, 112, 0, 0, 762, 763, 5, 117, 0,
    0, 763, 764, 5, 116, 0, 0, 764, 765, 5, 115, 0, 0, 765, 766, 5, 46, 0, 0, 766, 767, 5, 108, 0, 0, 767, 768, 5, 101,
    0, 0, 768, 769, 5, 110, 0, 0, 769, 770, 5, 103, 0, 0, 770, 771, 5, 116, 0, 0, 771, 794, 5, 104, 0, 0, 772, 773, 5,
    116, 0, 0, 773, 774, 5, 120, 0, 0, 774, 775, 5, 46, 0, 0, 775, 776, 5, 118, 0, 0, 776, 777, 5, 101, 0, 0, 777, 778,
    5, 114, 0, 0, 778, 779, 5, 115, 0, 0, 779, 780, 5, 105, 0, 0, 780, 781, 5, 111, 0, 0, 781, 794, 5, 110, 0, 0, 782,
    783, 5, 116, 0, 0, 783, 784, 5, 120, 0, 0, 784, 785, 5, 46, 0, 0, 785, 786, 5, 108, 0, 0, 786, 787, 5, 111, 0, 0,
    787, 788, 5, 99, 0, 0, 788, 789, 5, 107, 0, 0, 789, 790, 5, 116, 0, 0, 790, 791, 5, 105, 0, 0, 791, 792, 5, 109, 0,
    0, 792, 794, 5, 101, 0, 0, 793, 699, 1, 0, 0, 0, 793, 720, 1, 0, 0, 0, 793, 739, 1, 0, 0, 0, 793, 755, 1, 0, 0, 0,
    793, 772, 1, 0, 0, 0, 793, 782, 1, 0, 0, 0, 794, 140, 1, 0, 0, 0, 795, 799, 7, 7, 0, 0, 796, 798, 7, 8, 0, 0, 797,
    796, 1, 0, 0, 0, 798, 801, 1, 0, 0, 0, 799, 797, 1, 0, 0, 0, 799, 800, 1, 0, 0, 0, 800, 142, 1, 0, 0, 0, 801, 799,
    1, 0, 0, 0, 802, 804, 7, 9, 0, 0, 803, 802, 1, 0, 0, 0, 804, 805, 1, 0, 0, 0, 805, 803, 1, 0, 0, 0, 805, 806, 1, 0,
    0, 0, 806, 807, 1, 0, 0, 0, 807, 808, 6, 71, 0, 0, 808, 144, 1, 0, 0, 0, 809, 810, 5, 47, 0, 0, 810, 811, 5, 42, 0,
    0, 811, 815, 1, 0, 0, 0, 812, 814, 9, 0, 0, 0, 813, 812, 1, 0, 0, 0, 814, 817, 1, 0, 0, 0, 815, 816, 1, 0, 0, 0,
    815, 813, 1, 0, 0, 0, 816, 818, 1, 0, 0, 0, 817, 815, 1, 0, 0, 0, 818, 819, 5, 42, 0, 0, 819, 820, 5, 47, 0, 0, 820,
    821, 1, 0, 0, 0, 821, 822, 6, 72, 1, 0, 822, 146, 1, 0, 0, 0, 823, 824, 5, 47, 0, 0, 824, 825, 5, 47, 0, 0, 825,
    829, 1, 0, 0, 0, 826, 828, 8, 10, 0, 0, 827, 826, 1, 0, 0, 0, 828, 831, 1, 0, 0, 0, 829, 827, 1, 0, 0, 0, 829, 830,
    1, 0, 0, 0, 830, 832, 1, 0, 0, 0, 831, 829, 1, 0, 0, 0, 832, 833, 6, 73, 1, 0, 833, 148, 1, 0, 0, 0, 26, 0, 513,
    519, 525, 536, 595, 598, 602, 607, 613, 617, 630, 636, 642, 649, 651, 659, 661, 665, 681, 697, 793, 799, 805, 815,
    829, 2, 6, 0, 0, 0, 1, 0,
  ];

  private static __ATN: ATN;
  public static get _ATN(): ATN {
    if (!CashScriptLexer.__ATN) {
      CashScriptLexer.__ATN = new ATNDeserializer().deserialize(CashScriptLexer._serializedATN);
    }

    return CashScriptLexer.__ATN;
  }

  static DecisionsToDFA = CashScriptLexer._ATN.decisionToState.map(
    (ds: DecisionState, index: number) => new DFA(ds, index),
  );
}
