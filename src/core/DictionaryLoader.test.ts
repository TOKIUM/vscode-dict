import * as assert from "assert";
import { DictionaryLoader } from './DictionaryLoader';
import * as path from 'path';

describe("DictionaryLoader", () => {
  describe("load", () => {
    it("returns a list of dictionaries", async () => {
      const notifier = { info: () => {}, warn: () => {}, error: () => {} };
      const loader = new DictionaryLoader(notifier);
      const setting = { location: "", source: [path.join('fixtures', 'valid')] };
      const dictionaries = await loader.load([setting]);

      assert.equal(dictionaries.length, 1);
      assert.equal(dictionaries[0].name, "name");
      assert.equal(dictionaries[0].alias[0], "alias1");
      assert.equal(dictionaries[0].alias[1], "alias2");
      assert.equal(dictionaries[0].descriptions[0], "description");
    });

    it("returns an empty list if the yaml is invalid", async () => {
      const notifier = { info: () => {}, warn: () => {}, error: () => {} };
      const loader = new DictionaryLoader(notifier);
      const setting = { location: "", source: [path.join('fixtures', 'invalid')] };
      const dictionaries = await loader.load([setting]);
      assert.equal(dictionaries.values.length, 0);
    });
  });
});
