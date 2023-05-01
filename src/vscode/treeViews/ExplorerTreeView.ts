import * as vscode from 'vscode';
import { DictionaryStorage } from '../storage/DictionaryStorage';
import { ExplorerTreeDataProvider } from './ExplorerTreeDataProvider';

export class ExplorerTreeView {
  static readonly id: string = 'vscode-dict-explorer';
  constructor(
    public readonly treeDataProvider: ExplorerTreeDataProvider,
  ) {}

  static from(storage: DictionaryStorage): ExplorerTreeView {
    const treeDataProvider = new ExplorerTreeDataProvider(storage);
    return new ExplorerTreeView(treeDataProvider);
  }

  register(): vscode.Disposable {
    return vscode.window.createTreeView(ExplorerTreeView.id, { treeDataProvider: this.treeDataProvider });
  }
}
