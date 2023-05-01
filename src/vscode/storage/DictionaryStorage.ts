import * as vscode from 'vscode';
import * as dict from '@tokiumjp/dict';
import { DictionaryLoader } from '../../core/DictionaryLoader';
import { SettingLoader } from '../../core/Setting';
import { fromJson, toJson } from '../../core/dict';

export class DictionaryStorage {
  keyPrefix = 'dictionary-';

  constructor(
    private readonly context: vscode.ExtensionContext,
    private readonly settingLoader: SettingLoader,
    private readonly dictionaryLoader: DictionaryLoader,
  ) {}

  get(name: string): dict.Dictionary | undefined {
    const json = this.context.workspaceState.get<string>(`${this.keyPrefix}${name}`);

    if (json === undefined) { return undefined; }

    return fromJson(json);
  }

  getNames(): string[] {
    const keys = this.context.workspaceState.keys();
    return keys.filter((key) => key.startsWith(this.keyPrefix)).map((key) => key.replace(this.keyPrefix, ''));
  }

  reload(): void {
    this.getNames().forEach((name) => this.clear(name));
    const workspacePaths = vscode.workspace.workspaceFolders?.map((folder) => folder.uri.path) ?? [];
    const settings = this.settingLoader.loadFromYaml(workspacePaths);

    const dictionaries = this.dictionaryLoader.load(settings);
    dictionaries.then((ds) => ds.forEach((d) => this.update(d)));
  }

  private clear(name: string): void {
    this.context.workspaceState.update(`${this.keyPrefix}${name}`, undefined);
  }

  private update(dictionary: dict.Dictionary): void {
    this.context.workspaceState.update(`${this.keyPrefix}${dictionary.name.value}`, toJson(dictionary));
  }
}
