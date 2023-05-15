import * as vscode from 'vscode';
import { DictionaryStorage } from '../storage/DictionaryStorage';
import { SummaryTextDocument } from '../../core/SummaryTextDocument';

export class SummaryTextDocumentContentProvider implements vscode.TextDocumentContentProvider {
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
    if (found === undefined) { return ''; }
    
    const doc = new SummaryTextDocument(found);
    return doc.text;
  }
}
