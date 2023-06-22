import * as vscode from 'vscode';
import * as dict from '@tokiumjp/dict';
import { DictionaryStorage } from '../storage/DictionaryStorage';
import { OpenExplorerCommand } from '../commands/OpenExplorerCommand';

type DictionaryTreeData = dict.DictionaryGroup | dict.DictionaryName;

export class ExplorerTreeDataProvider implements vscode.TreeDataProvider<DictionaryTreeData>{

  constructor(
    private readonly storage: DictionaryStorage,
  ) {}

  getTreeItem(element: DictionaryTreeData): vscode.TreeItem | Thenable<vscode.TreeItem> {
    if (element instanceof dict.DictionaryGroup) {
      return new DictionaryGroupTreeItem(element.value);
    } else if (element instanceof dict.DictionaryName) {
      return new DictionaryNameTreeItem(element.value);
    }

    return new vscode.TreeItem('unknown');
  }

  getChildren(element?: DictionaryTreeData | undefined): vscode.ProviderResult<DictionaryTreeData[]> {
    if (element === undefined) {
      const plainNames = this.storage.getNames();
      const items = plainNames.map((name) => this.storage.get(name)).filter((item): item is dict.Dictionary => item !== undefined);
      const groups = items.map((item) => item.group).filter((item): item is dict.DictionaryGroup => item !== undefined);
      const uniqueGroups = groups.reduce((unique, item) => unique.find((v) => v.value === item.value) ? unique : [...unique, item], [] as dict.DictionaryGroup[]); 
      const noGroupItems = items.filter((item) => item.group === undefined).map((item) => item.name);
      return [...uniqueGroups, ...noGroupItems];
    } else if (element instanceof dict.DictionaryGroup) {
      const plainNames = this.storage.getNames();
      const items = plainNames.map((name) => this.storage.get(name)).filter((item): item is dict.Dictionary => item !== undefined);
      const children = items.filter((item) => item.group?.value === element.value);
      const names = children.map((item) => item.name);
      return [...names];
    }

    return [];
  }

  private _onDidChangeTreeData: vscode.EventEmitter<DictionaryTreeData | undefined | void> = new vscode.EventEmitter<DictionaryTreeData | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<DictionaryTreeData | undefined | void> = this._onDidChangeTreeData.event;

  reload(): void {
    this._onDidChangeTreeData.fire();
  }
}

class DictionaryGroupTreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.Collapsed,
  ) {
    super(label, collapsibleState);
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
