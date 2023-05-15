import * as dict from '@tokiumjp/dict';

function linkedTarget(target: dict.DictionaryTarget): string {
  return 'command:vscode-dict.open-source?' + encodeURIComponent(JSON.stringify([target.targetFilePath, target.targetLine]));
}

function linkedNameLine(name: dict.DictionaryName): string {
  return `# [${name.value}](${linkedTarget(name.target)})` + '\n\n';
}

function linkedDescriptionLine(description: dict.DictionaryDescription): string {
  return `${description.value}[[ref](${linkedTarget(description.target)})]`;
}

function linkedDescriptionLines(descriptions: dict.DictionaryDescription[]): string {
  return descriptions.map(linkedDescriptionLine).join('\n\n') + '\n\n';
}

function linkedFeatureNameLine(name: dict.DictionaryFeatureName): string {
  return `## [${name.value}](${linkedTarget(name.target)})`;
}

function linkedFeatureDescriptionLine(description: dict.DictionaryFeatureDescription): string {
  return `${description.value}[[ref](${linkedTarget(description.target)})]`;
}

function linkedFeatureDescriptionLines(descriptions: dict.DictionaryFeatureDescription[]): string {
  return descriptions.map(linkedFeatureDescriptionLine).join('\n\n') + '\n\n';
}

function linkedFeatureLine(feature: dict.DictionaryFeature): string {
  const nameLine = linkedFeatureNameLine(feature.name);
  const descriptionLines = linkedFeatureDescriptionLines(feature.descriptions);

  return `${nameLine}\n${descriptionLines}`;
}

function linkedFeatureLines(features: dict.DictionaryFeature[]): string {
  return features.map(linkedFeatureLine).join('\n\n') + '\n\n';
}

export class DetailedTextDocument {
  constructor(
    public readonly value: dict.Dictionary,
  ) {}

  get text(): string {
    return linkedNameLine(this.value.name) + linkedDescriptionLines(this.value.descriptions) + linkedFeatureLines(this.value.features);
  }
}