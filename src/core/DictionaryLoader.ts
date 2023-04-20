import * as yaml from 'js-yaml';
import * as fs from 'fs';
import { Dictionaries, Dictionary } from './Dictionary';
import { Notifier } from './Notifier';

interface DictionaryEntry {
  name: string | undefined;
  aliases: string[] | undefined;
  description: string | undefined;
}

export class DictionaryLoader {
  constructor (
    public notifier: Notifier,
  ) {}

  loadFromYaml(workspacePaths: string[]): Dictionaries {
    const yamlFilePath = workspacePaths.map((path) => `${path}/dict.yml`);
    return new Dictionaries(yamlFilePath.flatMap((path) => this.loadSingleYaml(path)));
  }

  private loadSingleYaml(path: string): Dictionary[] {
    try {
      const text = fs.readFileSync(path, 'utf8');
      const loaded = yaml.load(text) as DictionaryEntry[];
      const dictionaries = loaded.flatMap((entry) => {
        if (entry.name === undefined) { return []; };
        return new Dictionary(entry.name, entry.aliases ?? [], entry.description ?? '');
      });
      return dictionaries;
    } catch (e) {
      this.notifier.error(`Failed to load dictionary yaml file`);
      return [];
    }
  }
}
