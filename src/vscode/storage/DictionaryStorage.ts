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

  async reload(): Promise<void> {
    await Promise.all(this.getNames().map((name) => this.clear(name)));
    const workspacePaths = vscode.workspace.workspaceFolders?.map((folder) => folder.uri.path) ?? [];
    const settings = this.settingLoader.loadFromYaml(workspacePaths);

    const dictionaries = await this.dictionaryLoader.load(settings);
    await Promise.all(dictionaries.map((d) => this.update(d)));
  }

  private async clear(name: string): Promise<void> {
    return await this.context.workspaceState.update(`${this.keyPrefix}${name}`, undefined);
  }

  private async update(dictionary: dict.Dictionary): Promise<void> {
    return await this.context.workspaceState.update(`${this.keyPrefix}${dictionary.name.value}`, toJson(dictionary));
  }
}
