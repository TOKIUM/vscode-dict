import * as assert from 'assert';
import { Dictionary } from './Dictionary';

describe("Dictionary", () => {
  describe("includedIn", () => {
    it("returns true if the sentence includes the name", () => {
      const dictionary = new Dictionary("name", [], "description");
      assert(dictionary.includedIn("name"));
    });
    it("returns true if the sentence includes the alias", () => {
      const dictionary = new Dictionary("name", ["alias"], "description");
      assert(dictionary.includedIn("alias"));
    });
    it("returns false if the sentence does not include the name or alias", () => {
      const dictionary = new Dictionary("name", ["alias"], "description");
      assert(!dictionary.includedIn("other"));
    });
  });
});
