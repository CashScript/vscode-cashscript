import { CompletionItem, CompletionItemKind } from 'vscode';

interface Data {
  [key: string]: {
    code: string;
    codeDesc: string;
  };
}

// Regex to match: (### (\w+)\(\)\n```solidity\n(.*)\n```\n\n(.*))
let GLOBAL_FUNCTIONS: Data = {
  abs: {
    code: 'int abs(int a)',
    codeDesc: 'Returns the absolute value of argument `a`.',
  },
  min: {
    code: 'int min(int a, int b)',
    codeDesc: 'Returns the minimum value of arguments `a` and `b`.',
  },
  max: {
    code: 'int max(int a, int b)',
    codeDesc: 'Returns the maximum value of arguments `a` and `b`.',
  },
  within: {
    code: 'bool within(int x, int lower, int upper)',
    codeDesc: 'Returns `true` if and only if `x >= lower && x < upper`.',
  },
  ripemd160: {
    code: 'bytes20 ripemd160(any x)',
    codeDesc: 'Returns the RIPEMD-160 hash of argument `x`.',
  },
  sha1: {
    code: 'bytes20 sha1(any x)',
    codeDesc: 'Returns the SHA-1 hash of argument `x`.',
  },
  sha256: {
    code: 'bytes32 sha256(any x)',
    codeDesc: 'Returns the SHA-256 hash of argument `x`.',
  },
  hash160: {
    code: 'bytes20 hash160(any x)',
    codeDesc: 'Returns the RIPEMD-160 hash of the SHA-256 hash of argument `x`.',
  },
  hash256: {
    code: 'bytes32 hash256(any x)',
    codeDesc: 'Returns the double SHA-256 hash of argument `x`.',
  },
  checkSig: {
    code: 'bool checkSig(sig s, pubkey pk)',
    codeDesc:
      'Checks that transaction signature `s` is valid for the current transaction and matches with public key `pk`.',
  },
  checkMultiSig: {
    code: 'bool checkMultiSig(sig[] sigs, pubkey[] pks)',
    codeDesc: 'Performs a multi-signature check using a list of transaction signatures and public keys.',
  },
  checkDataSig: {
    code: 'bool checkDataSig(datasig s, bytes msg, pubkey pk)',
    codeDesc: 'Checks that sig `s` is a valid signature for message `msg` and matches with public key `pk`.',
  },
  require: {
    code: 'require(bool expression, string debugMessage?)',
    codeDesc:
      'Puts a constraint on the `expression` failing the script execution if expression resolves to false. `debugMessage` will be present in the error log of the debug evaluation of the script. Has no effect in production.',
  },
  'console.log': {
    code: 'console.log(...args)',
    codeDesc: 'Logs primitve data or variable values to debug console. Has no effect in production.',
  },
  toPaddedBytes: {
    code: 'bytes toPaddedBytes(int value, int size)',
    codeDesc:
      'Converts an integer `value` to a bytes sequence of length `size`, padded with zero-bytes. Fails at runtime if the integer does not fit into `size` bytes.',
  },
};

let INSTANTIATIONS: Data = {
  LockingBytecodeP2PKH: {
    code: 'new LockingBytecodeP2PKH(bytes20 pkh): bytes25',
    codeDesc: 'Creates new P2PKH locking bytecode for the public key hash `pkh`.',
  },
  LockingBytecodeP2SH20: {
    code: 'new LockingBytecodeP2SH20(bytes20 scriptHash): bytes23',
    codeDesc:
      'Creates new P2SH20 locking bytecode for the script hash, where `scriptHash` is the hash160() of your script.',
  },
  LockingBytecodeP2SH32: {
    code: 'new LockingBytecodeP2SH32(bytes32 scriptHash): bytes35',
    codeDesc:
      'Creates new P2SH32 locking bytecode for the script hash, where `scriptHash` is the hash256() of your script.',
  },
  LockingBytecodeNullData: {
    code: 'new LockingBytecodeNullData(bytes[] chunks): bytes',
    codeDesc: 'Creates new OP_RETURN locking bytecode with `chunks` as its OP_RETURN data.',
  },
};

let STATEMENTS: Data = {};

let TYPECASTS: Data = {
  int: {
    code: 'int int( v )',
    codeDesc: 'Converts to int',
  },
  string: {
    code: 'string string( v )',
    codeDesc: 'Converts to string',
  },
  bytes: {
    code: 'bytes bytes( v )',
    codeDesc: 'Converts to an unbounded bytes sequence.',
  },
  bytesN: {
    code: 'bytesN bytesN( v )',
    codeDesc: 'Converts to a bytes sequence of exactly N bytes. Fails at runtime if the value does not fit.',
  },
  bool: {
    code: 'bool bool( v )',
    codeDesc: 'Converts to bool. Integer values are coerced to 1 (truthy) or 0 (false).',
  },
  date: {
    code: 'int date(" YYYY-MM-DDThh:mm:ss ")',
    codeDesc: 'Converts implicit date to timestamp',
  },
  unsafe_int: {
    code: 'unsafe_int unsafe_int( v )',
    codeDesc:
      'Unsafe cast to int: reinterprets the value without type enforcement at runtime. The caller is responsible for ensuring the value is a valid Script number.',
  },
  unsafe_bool: {
    code: 'unsafe_bool unsafe_bool( v )',
    codeDesc:
      'Unsafe cast to bool: reinterprets the value without coercing to 1 / 0. The caller is responsible for ensuring the value is already a valid boolean.',
  },
  unsafe_bytes: {
    code: 'unsafe_bytes unsafe_bytes( v )',
    codeDesc: 'Unsafe cast to unbounded bytes. No runtime length or type enforcement.',
  },
  unsafe_bytesN: {
    code: 'unsafe_bytesN unsafe_bytesN( v )',
    codeDesc:
      'Unsafe cast to a bytes sequence of N bytes. Skips the runtime length check — the caller is responsible for guaranteeing the value is exactly N bytes.',
  },
  unsafe_byte: {
    code: 'unsafe_byte unsafe_byte( v )',
    codeDesc: 'Unsafe cast to a single byte. No runtime length enforcement.',
  },
};

let LANGUAGE: Data = { ...GLOBAL_FUNCTIONS, ...INSTANTIATIONS, ...STATEMENTS, ...TYPECASTS };

// TODO: Add descriptions for all the completions here
let DOT_COMPLETIONS: { [key: string]: CompletionItem[] } = {
  tx: [
    {
      label: 'version',
      kind: CompletionItemKind.Field,
    },
    {
      label: 'locktime',
      kind: CompletionItemKind.Field,
    },
    {
      label: 'inputs',
      kind: CompletionItemKind.Field,
    },
    {
      label: 'outputs',
      kind: CompletionItemKind.Field,
    },
    {
      label: 'time',
      kind: CompletionItemKind.Field,
    },
  ],

  inputs: [
    {
      label: 'length',
      kind: CompletionItemKind.Field,
    },
  ],

  inputs_indexed: [
    {
      label: 'value',
      kind: CompletionItemKind.Field,
    },
    {
      label: 'lockingBytecode',
      kind: CompletionItemKind.Field,
    },
    {
      label: 'outpointTransactionHash',
      kind: CompletionItemKind.Field,
    },
    {
      label: 'outpointIndex',
      kind: CompletionItemKind.Field,
    },
    {
      label: 'unlockingBytecode',
      kind: CompletionItemKind.Field,
    },
    {
      label: 'sequenceNumber',
      kind: CompletionItemKind.Field,
    },
    {
      label: 'tokenCategory',
      kind: CompletionItemKind.Field,
    },
    {
      label: 'nftCommitment',
      kind: CompletionItemKind.Field,
    },
    {
      label: 'tokenAmount',
      kind: CompletionItemKind.Field,
    },
  ],

  outputs: [
    {
      label: 'length',
      kind: CompletionItemKind.Field,
    },
  ],

  outputs_indexed: [
    {
      label: 'value',
      kind: CompletionItemKind.Field,
    },
    {
      label: 'lockingBytecode',
      kind: CompletionItemKind.Field,
    },
    {
      label: 'tokenCategory',
      kind: CompletionItemKind.Field,
    },
    {
      label: 'nftCommitment',
      kind: CompletionItemKind.Field,
    },
    {
      label: 'tokenAmount',
      kind: CompletionItemKind.Field,
    },
  ],

  this: [
    {
      label: 'activeInputIndex',
      kind: CompletionItemKind.Field,
    },
    {
      label: 'activeBytecode',
      kind: CompletionItemKind.Field,
    },
    {
      label: 'age',
      kind: CompletionItemKind.Field,
    }
  ],

  console: [
    {
      label: 'log',
      kind: CompletionItemKind.Field,
    },
  ],
};

export { GLOBAL_FUNCTIONS, INSTANTIATIONS, TYPECASTS, LANGUAGE, DOT_COMPLETIONS };
