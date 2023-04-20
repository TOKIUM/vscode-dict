export class Dictionary {
  constructor(
    public name: string,
    public aliases: string[],
    public description: string,
  ) {}

  public includedIn(sentence: string): boolean {
    const names = [this.name, ...this.aliases];
    return names.some((alias) => sentence.includes(alias));
  }

  public toMarkdown(): string {
    const nameLine = this.aliases.length === 0 ? `### ${this.name}` : `### ${this.name} (${this.aliases.join(', ')})`;
    const descriptionLine = this.description;

    return [nameLine, descriptionLine].join('\n');
  }
}

export class Dictionaries {
  constructor(
    public dictionaries: Dictionary[],
  ) {}

  public includedIn(sentence: string): Dictionaries {
    return new Dictionaries(this.dictionaries.filter((dictionary) => dictionary.includedIn(sentence)));
  }

  public toMarkdown(): string {
    return this.dictionaries.map((dictionary) => dictionary.toMarkdown()).join('\n\n');
  }
}
