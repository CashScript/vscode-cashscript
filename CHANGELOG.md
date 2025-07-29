# Change Log

All notable changes to the "vscode-cashscript" extension will be documented in this file.

## v0.5.0

- Add support for CashScript v0.11.0
  - Add `slice` function
  - Rename `tx.age` property to `this.age`
  - Add some missing completions & highlighting
  - Fix hover information for contract and function signatures

## v0.4.0

- Add support for CashScript v0.10.0
  - Add `console.log` statements
  - Add optional failure message to `require` statements
  - Add support for underscores in numbers and scientific notation

## v0.3.0

- Add support for CashScript v0.8.0
  - Add token properties to inputs and outputs
  - Remove 'OutputX' in favour of 'LockingBytecodeX'
- Remove 'Compilation' functionality due to ESM incompatibilties
- Small fixes and refactors
- Update examples

## 0.2.0

- Add support for CashScript v0.7.0
  - Updated to new Native Introspection functionality
  - Added tuple destructuring
  - Added new `constant` keyword
  - Added `*` operator

## 0.1.2

- Added tx to completion provider and syntax highlighting
- added byte alias for bytes1

## 0.1.1

- Fixed language grammar to have comprehensive highlighting
- Added janky HoverProvider for variable types
- Added split/reverse to hover provider

## 0.1.0

Initial release of vscode-cashscript. Features:

- Syntax Highlighting
- Auto-Completion
- Snippets
- Linting
- Contract Compilation (press F5 or click "Compile Contract")
  Would like to implement tests and other sustainability features before bumping version
