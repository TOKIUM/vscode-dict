import * as vscode from 'vscode';
import { DictionaryStorage } from '../storage/DictionaryStorage';
import { DetailedTextDocument } from '../../core/DetailTextDocument';

export class DetailTextDocumentContentProvider implements vscode.TextDocumentContentProvider {
  constructor(
    private readonly storage: DictionaryStorage,
  ) {}

  onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();
  onDidChange = this.onDidChangeEmitter.event;

  reload(uri: vscode.Uri): void {
    this.onDidChangeEmitter.fire(uri);
  }

  provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): vscode.ProviderResult<string> {
    const found = this.storage.get(uri.path);
    if (found === undefined) { return 'Not found'; }
    
    const doc = new DetailedTextDocument(found);
    return doc.text;
  }
}
