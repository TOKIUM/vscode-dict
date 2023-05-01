import * as vscode from 'vscode';
import * as dict from '@tokiumjp/dict';
import { DictionaryStorage } from '../storage/DictionaryStorage';
import { OpenExplorerCommand } from '../commands/OpenExplorerCommand';

export class ExplorerTreeDataProvider implements vscode.TreeDataProvider<dict.Dictionary>{

  constructor(
    private readonly storage: DictionaryStorage,
  ) {}

  getTreeItem(element: dict.Dictionary): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return new DictionaryNameTreeItem(element.name.value);
  }

  getChildren(element?: dict.Dictionary | undefined): vscode.ProviderResult<dict.Dictionary[]> {
    if (element === undefined) {
      const names = this.storage.getNames();
      const items = names.map((name) => this.storage.get(name)).filter((item): item is dict.Dictionary => item !== undefined);
      return items;
    }

    return [];
  }

  private _onDidChangeTreeData: vscode.EventEmitter<dict.Dictionary | undefined | void> = new vscode.EventEmitter<dict.Dictionary | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<dict.Dictionary | undefined | void> = this._onDidChangeTreeData.event;

  reload(): void {
    this._onDidChangeTreeData.fire();
  }
}

class DictionaryNameTreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
  ) {
    super(label);
  }
  command = {
    command: OpenExplorerCommand.id,
    title: '',
    arguments: [this.label],
  };
}
