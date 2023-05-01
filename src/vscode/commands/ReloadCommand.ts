import * as vscode from 'vscode';
import { ExplorerTreeDataProvider } from '../treeViews/ExplorerTreeDataProvider';
import { DictionaryStorage } from '../storage/DictionaryStorage';

export class ReloadCommand {
  static readonly id: string = 'vscode-dict.reload';
  constructor(
    public readonly storage: DictionaryStorage,
    public readonly treeDataProvider: ExplorerTreeDataProvider,
  ) { }

  static from(storage: DictionaryStorage, treeDataProvider: ExplorerTreeDataProvider): ReloadCommand {
    return new ReloadCommand(storage, treeDataProvider);
  }

  register(): vscode.Disposable {
    return vscode.commands.registerCommand(ReloadCommand.id, this.execute);
  }

  async execute(): Promise<void> {
    this.storage.reload();
    this.treeDataProvider.reload();
  }
}
