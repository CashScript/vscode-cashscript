// Mock the 'vscode' module before running tests
jest.mock('vscode', () => {
  // Create mock implementations of commonly used VS Code API objects
  const mockPosition = class {
    constructor(line: number, character: number) {}
    isBefore(other: any): boolean { return false; }
    isBeforeOrEqual(other: any): boolean { return false; }
    isAfter(other: any): boolean { return false; }
    isAfterOrEqual(other: any): boolean { return false; }
    isEqual(other: any): boolean { return false; }
    compareTo(other: any): number { return 0; }
    translate(...args: any[]): any { return this; }
    with(...args: any[]): any { return this; }
  };

  const mockRange = class {
    constructor(start: any, end: any) {}
    contains(position: any): boolean { return false; }
  };

  const mockMarkdownString = class {
    constructor(value?: string) {}
    appendCodeblock(code: string): any { return this; }
  };

  const mockHover = class {
    constructor(contents: any, range?: any) {}
  };

  const mockCancellationToken = {};

  const mockOutputChannel = {
    name: 'test-channel',
    appendLine: jest.fn(),
    append: jest.fn(),
    replace: jest.fn(),
    clear: jest.fn(),
    show: jest.fn(),
    hide: jest.fn(),
    dispose: jest.fn(),
  };

  const mockTextDocument = {
    getWordRangeAtPosition: jest.fn(),
    getText: jest.fn(),
    lineCount: 0,
    lineAt: jest.fn(),
    offsetAt: jest.fn(),
    positionAt: jest.fn(),
  };

  return {
    // Mock the entire VS Code API
    default: {
      Position: mockPosition,
      Range: mockRange,
      MarkdownString: mockMarkdownString,
      Hover: mockHover,
      CancellationToken: mockCancellationToken,
      OutputChannel: mockOutputChannel,
      TextDocument: mockTextDocument,
    },
    Position: mockPosition,
    Range: mockRange,
    MarkdownString: mockMarkdownString,
    Hover: mockHover,
    CancellationToken: mockCancellationToken,
    OutputChannel: mockOutputChannel,
    TextDocument: mockTextDocument,
    HoverProvider: class {},
    languages: {
      registerHoverProvider: jest.fn(),
    }
  };
});