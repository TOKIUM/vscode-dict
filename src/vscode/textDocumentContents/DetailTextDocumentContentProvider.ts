import * as vscode from 'vscode';
import { DictionaryStorage } from '../storage/DictionaryStorage';

export class DetailTextDocumentContentProvider implements vscode.TextDocumentContentProvider {
  constructor(
    private readonly storage: DictionaryStorage,
  ) {}

  onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();
  onDidChange = this.onDidChangeEmitter.event;

  provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): vscode.ProviderResult<string> {
    const found = this.storage.get(uri.path);
    if (found === undefined) { return 'Not found'; }
    const header = '# ' + found.name.value + '\n\n';
    const body = found.descriptions.map((d) => d.value).join('\n') + '\n\n';
    const workspaceUri = vscode.workspace.workspaceFolders?.[0]?.uri;
    const filePath = workspaceUri?.path + '/app/models/payment_requests/report.rb';

    const openCommand = 'command:vscode-dict.open-source?' + encodeURIComponent(JSON.stringify([filePath, 10]));
    const link = `[Open](${openCommand})`;

    return header + body + link;
  }
}
