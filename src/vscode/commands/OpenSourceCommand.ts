import * as vscode from 'vscode';

export class OpenSourceCommand {
  static readonly id: string = 'vscode-dict.open-source';

  register(): vscode.Disposable {
    return vscode.commands.registerCommand(OpenSourceCommand.id, this.execute);
  }

  async execute(filePath: string, line: number): Promise<void> {
    const uri = vscode.Uri.file(filePath);
    vscode.commands.executeCommand('vscode.open', uri, { selection: new vscode.Range(line, 0, line, 0)});
  }
}
