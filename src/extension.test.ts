import * as vscode from 'vscode';
import * as path from 'path';
import { activate, deactivate } from './extension';
import { LanguageClient } from 'vscode-languageclient/node';

// Mock the vscode modules
jest.mock('vscode', () => ({
  languages: {
    registerHoverProvider: jest.fn(),
    registerSignatureHelpProvider: jest.fn(),
    registerCompletionItemProvider: jest.fn(),
  },
  workspace: {
    createFileSystemWatcher: jest.fn(() => ({
      onDidCreate: jest.fn(),
      onDidChange: jest.fn(),
      onDidDelete: jest.fn(),
    })),
  },
}));

// Mock the LanguageClient and TransportKind
const mockStart = jest.fn();
const mockStop = jest.fn(() => Promise.resolve());

jest.mock('vscode-languageclient/node', () => {
  return {
    LanguageClient: jest.fn().mockImplementation(() => {
      return {
        start: mockStart,
        stop: mockStop,
      };
    }),
    TransportKind: {
      ipc: 'ipc',
    },
  };
});

// Mock other classes that get instantiated
jest.mock('./CashscriptHoverProvider', () => {
  return {
    default: jest.fn().mockImplementation(() => {
      return {};
    }),
  };
});
jest.mock('./CashscriptSignatureCompleter', () => {
  return {
    default: jest.fn().mockImplementation(() => {
      return {};
    }),
  };
});
jest.mock('./CashscriptCompletionProvider', () => {
  return {
    default: jest.fn().mockImplementation(() => {
      return {};
    }),
  };
});

describe('Extension', () => {
  let mockContext: vscode.ExtensionContext;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    mockStart.mockClear();
    mockStop.mockClear();

    // Create a mock extension context
    mockContext = {
      extensionPath: '/mock/extension/path',
      subscriptions: [],
      workspaceState: {} as vscode.Memento,
      globalState: {} as vscode.Memento,
      globalStoragePath: '',
      logPath: '',
      storageUri: undefined,
      logUri: undefined,
      extensionMode: 1,
      extensionUri: {} as vscode.Uri,
    } as vscode.ExtensionContext;
  });

  afterEach(() => {
    jest.resetModules();
  });

  describe('activate', () => {
    it('should initialize the LanguageClient with correct options', async () => {
      await activate(mockContext);

      // Check that LanguageClient was instantiated with correct parameters
      expect(LanguageClient).toHaveBeenCalledWith(
        'cashscript',
        'Cashscript Language Server',
        expect.objectContaining({
          run: expect.objectContaining({
            module: expect.stringMatching(/server\.js$/),
            transport: 'ipc',
          }),
          debug: expect.objectContaining({
            module: expect.stringMatching(/server\.js$/),
            options: expect.objectContaining({
              execArgv: ['--nolazy', '--inspect=6069'],
            }),
            transport: 'ipc',
          }),
        }),
        expect.objectContaining({
          documentSelector: [{ scheme: 'file', language: 'cashscript' }],
          synchronize: expect.objectContaining({
            fileEvents: expect.any(Object),
          }),
          initializationOptions: '/mock/extension/path',
        })
      );
    });

    it('should register hover provider for cashscript language', async () => {
      const registerHoverProviderSpy = jest.spyOn(vscode.languages, 'registerHoverProvider');

      await activate(mockContext);

      // Check that hover provider was registered
      expect(registerHoverProviderSpy).toHaveBeenCalledWith(
        'cashscript',
        expect.any(Object) // CashscriptHoverProvider instance
      );
    });

    it('should register signature help provider for cashscript language', async () => {
      const registerSignatureHelpProviderSpy = jest.spyOn(vscode.languages, 'registerSignatureHelpProvider');

      await activate(mockContext);

      // Check that signature help provider was registered
      expect(registerSignatureHelpProviderSpy).toHaveBeenCalledWith(
        'cashscript',
        expect.any(Object), // CashscriptSignatureCompleter instance
        '('
      );
    });

    it('should register completion item provider for cashscript language', async () => {
      const registerCompletionItemProviderSpy = jest.spyOn(vscode.languages, 'registerCompletionItemProvider');

      await activate(mockContext);

      // Check that completion item provider was registered
      expect(registerCompletionItemProviderSpy).toHaveBeenCalledWith(
        'cashscript',
        expect.any(Object), // CashscriptCompletionProvider instance
        '.'
      );
    });

    it('should start the LanguageClient', async () => {
      const mockStart = jest.fn();
      (LanguageClient as jest.MockedClass<typeof LanguageClient>).mockImplementation(() => {
        return {
          start: mockStart,
          stop: jest.fn(() => Promise.resolve()),
        } as any;
      });

      await activate(mockContext);

      // Check that the client's start method was called
      expect(mockStart).toHaveBeenCalled();
    });

    it('should create file system watcher with correct pattern', async () => {
      const createFileSystemWatcherSpy = jest.spyOn(vscode.workspace, 'createFileSystemWatcher');

      await activate(mockContext);

      // Check that the file system watcher was created with the correct pattern
      expect(createFileSystemWatcherSpy).toHaveBeenCalledWith('**/.clientrc');
    });
  });

  describe('deactivate', () => {
    beforeEach(() => {
      // Reset the module to ensure clean state for each deactivate test
      jest.resetModules();
    });

    it('should return undefined when client is not initialized', async () => {
      // Import fresh version
      const { deactivate: freshDeactivate } = await import('./extension');

      const result = await freshDeactivate();

      expect(result).toBeUndefined();
    });

    it('should call stop on the client when client is initialized', async () => {
      // Import fresh version
      const { activate: freshActivate, deactivate: freshDeactivate } = await import('./extension');

      // Activate to initialize the client
      await freshActivate(mockContext);

      // Verify start was called
      expect(mockStart).toHaveBeenCalled();

      const result = await freshDeactivate();

      expect(mockStop).toHaveBeenCalled();
      expect(result).toBeUndefined(); // client.stop() returns Promise<void> which resolves to undefined
    });
  });
});