import * as assert from "assert";
import { DictionaryLoader } from './DictionaryLoader';
import * as path from 'path';

describe("DictionaryLoader", () => {
  describe("loadFromYaml", () => {
    it("returns a list of dictionaries", () => {
      const notifier = { info: () => {}, warn: () => {}, error: () => {} };
      const loader = new DictionaryLoader(notifier);
      const dictionaries = loader.loadFromYaml([path.join('fixtures', 'valid')]);

      assert.equal(dictionaries.dictionaries.length, 1);
      assert.equal(dictionaries.dictionaries[0].name, "name");
      assert.equal(dictionaries.dictionaries[0].aliases[0], "alias1");
      assert.equal(dictionaries.dictionaries[0].aliases[1], "alias2");
      assert.equal(dictionaries.dictionaries[0].description, "description");
    });

    it("returns an empty list if the yaml is invalid", () => {
      const notifier = { info: () => {}, warn: () => {}, error: () => {} };
      const loader = new DictionaryLoader(notifier);
      const dictionaries = loader.loadFromYaml([path.join('fixtures', 'invalid')]);
      assert.equal(dictionaries.dictionaries.length, 0);
    });
  });
});
