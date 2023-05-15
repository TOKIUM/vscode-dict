import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { Notifier } from './Notifier';

export interface Setting {
  location: string;
  source: string[];
}

export class SettingLoader {
  constructor(
    public notifier: Notifier,
  ) {}

  loadFromYaml(workspacePaths: string[]): Setting[] {
    return workspacePaths.map((path) => this.loadSingleYaml(path));
  }

  private loadSingleYaml(path: string): Setting {
    try {
      const yamlFilePath = `${path}/vscode-dict.yml`;
      const text = fs.readFileSync(yamlFilePath, 'utf8');
      const loaded = yaml.load(text) as Setting;
      const withPath = { location: path, source: loaded.source ?? [] };
      return withPath;
    } catch (e) {
      this.notifier.error(`Failed to load vscode-dict.yml.`);
      return { location: path, source: [] };
    }
  }
}
