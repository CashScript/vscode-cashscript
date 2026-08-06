import {
  createConnection,
  InitializeParams,
  InitializeResult,
  ProposedFeatures,
  TextDocuments,
} from 'vscode-languageserver/node';
import { TextDocument } from 'vscode-languageserver-textdocument';
import CashscriptLinter from './CashscriptLinter/CashscriptLinter';
import { uriToFilePath } from './utils';

let connection = createConnection(ProposedFeatures.all);
let documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

// Debounce per document, latest content wins
const pendingValidations = new Map<string, NodeJS.Timeout>();
const validationDelay = 750; // Delay in ms for checking file

// Initialize connection
connection.onInitialize((params: InitializeParams) => {
  let capabilities = params.capabilities;

  const result: InitializeResult = {
    capabilities: {},
  };

  return result;
});

documents.onDidChangeContent((change) => {
  const uri = change.document.uri;
  clearTimeout(pendingValidations.get(uri));
  pendingValidations.set(
    uri,
    setTimeout(() => {
      pendingValidations.delete(uri);
      validateDocument(change.document);
    }, validationDelay),
  );
});

documents.onDidClose((event) => {
  const uri = event.document.uri;
  clearTimeout(pendingValidations.get(uri));
  pendingValidations.delete(uri);
  connection.sendDiagnostics({ uri, diagnostics: [] });
});

async function validateDocument(textDocument: TextDocument): Promise<void> {
  const code = textDocument.getText();
  const diagnostics = await CashscriptLinter.getDiagnostics(code, uriToFilePath(textDocument.uri));
  connection.sendDiagnostics({
    uri: textDocument.uri,
    diagnostics,
  });
}

// Register Connection
documents.listen(connection);
connection.listen();
