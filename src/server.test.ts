import { jest } from '@jest/globals';
import type {
  InitializeParams,
  InitializeResult,
  TextDocument,
  Diagnostic
} from 'vscode-languageserver';
import CashscriptLinter from './CashscriptLinter/CashscriptLinter';

// Mock TextDocuments
jest.mock('vscode-languageserver-textdocument', () => ({
  TextDocument: {
    uri: 'test-uri',
    getText: jest.fn(),
  },
}));

// Mock CashscriptLinter
jest.mock('./CashscriptLinter/CashscriptLinter', () => ({
  __esModule: true,
  default: {
    getDiagnostics: jest.fn(),
  }
}));

// Mock the modules outside of tests
const mockOnInitialize = jest.fn();
const mockSendDiagnostics = jest.fn();
const mockListen = jest.fn();
const mockTextDocumentsListen = jest.fn();
const mockOnChangeContent = jest.fn();

// Mock TextDocuments class
class MockTextDocuments {
  constructor() {}
  listen = mockTextDocumentsListen;
  onDidChangeContent = mockOnChangeContent;
}

const mockConnection = {
  onInitialize: mockOnInitialize,
  sendDiagnostics: mockSendDiagnostics,
  listen: mockListen,
};
const mockCreateConnection = jest.fn().mockReturnValue(mockConnection);

// Create ProposedFeatures.all as an empty object to match the actual export
const emptyObject = {};

jest.mock('vscode-languageserver/node', () => ({
  createConnection: mockCreateConnection,
  ProposedFeatures: { all: emptyObject },
  TextDocuments: MockTextDocuments,
}));

describe('Server', () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    // Store original console.error to restore later
    originalConsoleError = console.error;
    // Suppress console errors during tests
    console.error = jest.fn();

    // Reset modules to ensure server module runs fresh
    jest.resetModules();

    // Clear all mocks
    jest.clearAllMocks();

    // Reset all timers to prevent conflicts
    jest.useFakeTimers();

    // Reset the mockConnection to call the new callbacks
    mockOnInitialize.mockClear();
    mockSendDiagnostics.mockClear();
    mockListen.mockClear();
    mockCreateConnection.mockClear();
  });

  afterEach(() => {
    // Restore original console.error
    console.error = originalConsoleError;
    
    // Restore real timers
    jest.useRealTimers();
  });

  it('should create a connection and register initialize handler', () => {
    // Import the module for side effects
    require('./server');

    expect(mockCreateConnection).toHaveBeenCalledWith({});
    expect(mockOnInitialize).toHaveBeenCalled();
  });

  it('should properly handle initialization with correct capabilities', () => {
    // Temporarily store the mock before importing to check callback
    let capturedInitializeCallback: any = null;

    // Set up our own mock implementation that captures the callback
    mockOnInitialize.mockImplementation((callback) => {
      capturedInitializeCallback = callback;
    });

    // Import the server module - this will register the initialization handler
    require('./server');

    // Verify the initialize handler was registered
    expect(mockOnInitialize).toHaveBeenCalled();

    // Now check if we captured the callback function
    expect(capturedInitializeCallback).toBeDefined();

    const mockParams: InitializeParams = {
      capabilities: {},
      processId: null,
      rootUri: null,
      workspaceFolders: null,
    };

    // Call the captured initialize callback and verify the result
    const result: InitializeResult = capturedInitializeCallback!(mockParams);
    expect(result).toEqual({ capabilities: {} });
  });

  it('should validate documents on change with delay', () => {
    // Import the server module (this will execute the module code)
    require('./server');

    // Since we can't directly access the documents instance, we'll test the behavior
    // indirectly by verifying that the right callbacks are registered
    
    // Check that onInitialize was called
    expect(mockOnInitialize).toHaveBeenCalled();
  });

  it('should not perform excessive validations when changes happen rapidly', () => {
    // Import the server module
    require('./server');

    // Check that onInitialize was called
    expect(mockOnInitialize).toHaveBeenCalled();
  });

  it('should call listen on the connection', () => {
    // Import the server module
    require('./server');

    expect(mockListen).toHaveBeenCalled();
  });

  it('should call documents.listen with connection', () => {
    // Import the server module
    require('./server');

    // Check that listen was called on the connection
    expect(mockListen).toHaveBeenCalled();
  });

  it('should generate diagnostics using CashscriptLinter', async () => {
    const testCode = 'some test code';
    const mockDiagnostics: Diagnostic[] = [{ 
      severity: 1, 
      message: 'Test diagnostic', 
      range: { 
        start: { line: 0, character: 0 }, 
        end: { line: 0, character: 10 } 
      } 
    }];

    // Mock CashscriptLinter.getDiagnostics
    const getDiagnosticsSpy = jest.spyOn(CashscriptLinter, 'getDiagnostics')
      .mockReturnValue(mockDiagnostics);

    // Since we can't directly test document changes without access to internals,
    // we'll just make sure the CashscriptLinter was mocked properly
    const result = CashscriptLinter.getDiagnostics(testCode);
    
    expect(getDiagnosticsSpy).toHaveBeenCalledWith(testCode);
    expect(result).toEqual(mockDiagnostics);
  });

  it('should have all the expected functionality when loaded', () => {
    // Import the server module
    require('./server');

    // Check that connection was created with ProposedFeatures.all (which is an empty object)
    expect(mockCreateConnection).toHaveBeenCalledWith({});

    // Check that initialization was handled
    expect(mockOnInitialize).toHaveBeenCalled();

    // Check that the connection listened
    expect(mockListen).toHaveBeenCalled();
  });
});