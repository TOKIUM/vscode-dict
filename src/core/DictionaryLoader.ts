import { Notifier } from './Notifier';
import * as dict from "@tokiumjp/dict";
import { Setting } from './Setting';
import { listFiles } from '../util/files';

export class DictionaryLoader {
  constructor (
    public notifier: Notifier,
  ) {}

  async load(settings: Setting[]): Promise<dict.Dictionary[]> {
    const dicts = await Promise.all(settings.flatMap((setting) => this.loadFromSetting(setting)));
    const merged = dict.Dictionary.mergeAll(dicts.flat());
    return merged;
  }

  private async loadFromSetting(setting: Setting): Promise<dict.Dictionary[]> {
    const extractedPath = setting.source.flatMap((p) => listFiles(`${setting.location}/${p}`));
    const texts = await Promise.all(extractedPath.flatMap((path) => dict.CodeText.from(path)));
    const dicts = texts.flatMap((text) => {
      const comments = dict.CodeCommentParser.parse(text.filepath, text.lines);
      return dict.Dictionary.fromComments(comments);
    });
    const merged = dict.Dictionary.mergeAll(dicts);
    return merged;
  }
}
