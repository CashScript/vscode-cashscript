// Mock the 'vscode' module for Jest testing
const mockedVSCode = {
  // Basic types
  Position: class {
    line: number;
    character: number;

    constructor(line: number, character: number) {
      this.line = line;
      this.character = character;
    }

    isBefore(other: any): boolean { return false; }
    isBeforeOrEqual(other: any): boolean { return false; }
    isAfter(other: any): boolean { return false; }
    isAfterOrEqual(other: any): boolean { return false; }
    isEqual(other: any): boolean { return false; }
    compareTo(other: any): number { return 0; }
    translate(...args: any[]): any { return this; }
    with(...args: any[]): any { return this; }
  },

  Range: class {
    start: any;
    end: any;

    constructor(start: any, end: any) {
      this.start = start;
      this.end = end;
    }

    contains(position: any): boolean { 
      return false; 
    }
  },

  MarkdownString: class {
    value: string;

    constructor(value?: string) {
      this.value = value || '';
    }

    appendCodeblock(code: string): any { 
      return this; 
    }
  },

  Hover: class {
    contents: any;
    range: any;

    constructor(contents: any, range?: any) {
      this.contents = contents;
      this.range = range;
    }
  },

  CancellationToken: {},

  OutputChannel: class {
    name: string;
    
    constructor(name: string = 'test-channel') {
      this.name = name;
    }
    
    appendLine(message: string): void {}
    append(message: string): void {}
    replace(value: string): void {}
    clear(): void {}
    show(preserveFocus?: boolean): void {}
    hide(): void {}
    dispose(): void {}
  },

  TextDocument: class {},

  HoverProvider: class {},

  languages: {
    registerHoverProvider: jest.fn(),
  },

  EndOfLine: {
    LF: 1,  // Line Feed character
    CRLF: 2, // Carriage Return Line Feed
  },

  // Add any other VS Code API elements that might be needed
  Uri: class {
    constructor(...args: any[]) {}
    static file(path: string): any { return { fsPath: path }; }
    static parse(value: string): any { return { toString: () => value }; }
  },

  CompletionItemKind: {
    Field: 5,  // From VS Code API - Field = 5
    Variable: 6,  // From VS Code API - Variable = 6
    Keyword: 14,  // From VS Code API - Keyword = 14
  },

  window: {
    createOutputChannel: (name: string) => new mockedVSCode.OutputChannel(name),
  },

  CompletionItem: class {
    label: string;
    kind?: any;
    detail?: string;
    insertText?: string;
    data?: any;

    constructor(labelOrConfiguration: string | any, kind?: any) {
      if (typeof labelOrConfiguration === 'string') {
        this.label = labelOrConfiguration;
        this.kind = kind;
      } else {
        // If passed an object with configuration
        Object.assign(this, labelOrConfiguration);
      }
    }
  },
};

export = mockedVSCode;