import * as vscode from 'vscode';
import { DictionaryStorage } from '../storage/DictionaryStorage';

export class SummaryTextDocumentContentProvider implements vscode.TextDocumentContentProvider {
  constructor(
    private readonly storage: DictionaryStorage,
  ) {}

  onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();
  onDidChange = this.onDidChangeEmitter.event;

  provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): vscode.ProviderResult<string> {
    const found = this.storage.get(uri.path);
    if (found === undefined) { return ''; }

    const nameLine = found.alias.length === 0 ? `### ${this.openExplorerCommandLink(found.name.value)}` : `### ${this.openExplorerCommandLink(found.name.value)} (${found.alias.join(', ')})`;
    const descriptionLine = found.descriptions.map((d) => d.value).join('\n');

    return [nameLine, descriptionLine].join('\n');
  }

  private openExplorerCommandLink(name: string): string {
    const label = name;
    const link = 'command:vscode-dict.open-explorer?' + encodeURIComponent(JSON.stringify([name]));

    return `[${label}](${link})`;
  }
}
