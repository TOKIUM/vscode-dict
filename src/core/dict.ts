import * as dict from '@tokiumjp/dict';

export function isIncludedIn(sentence: string, dictionary: dict.Dictionary): boolean {
  const names = [dictionary.name.value, ...dictionary.alias.map((alias) => alias.value)];
  const included = names.some((name) => sentence.includes(name));
  return included;
}

export function includedIn(sentence: string, dictionaries: dict.Dictionary[]): dict.Dictionary[] {
  return dictionaries.filter((v) => isIncludedIn(sentence, v));
}

export function toJson(dictionary: dict.Dictionary): string {
  const name = nameToJson(dictionary.name);
  const alias = dictionary.alias.map(aliasToJson);
  const descriptions = dictionary.descriptions.map(descriptionToJson);
  const features = dictionary.features.map(featureToJson);

  return JSON.stringify({ name, alias, descriptions, features });
}

function targetToJson(target: dict.DictionaryTarget): any {
  return { targetName: target.targetName, targetType: target.targetType, targetLine: target.targetLine, targetFilePath: target.targetFilePath };
}

function nameToJson(name: dict.DictionaryName): any {
  return { target: targetToJson(name.target), value: name.value };
}

function aliasToJson(alias: dict.DictionaryAlias): any {
  return { value: alias.value };
}

function descriptionToJson(description: dict.DictionaryDescription): any {
  return { target: targetToJson(description.target), value: description.value };
}

function featureNameToJson(name: dict.DictionaryFeatureName): any {
  return { target: targetToJson(name.target), value: name.value };
}

function featureDescriptionToJson(description: dict.DictionaryFeatureDescription): any {
  return { target: targetToJson(description.target), value: description.value };
}

function featureToJson(feature: dict.DictionaryFeature): any {
  return { name: featureNameToJson(feature.name), descriptions: feature.descriptions.map(featureDescriptionToJson) };
}

export function fromJson(json: string): dict.Dictionary {
  const parsed = JSON.parse(json);
  const name = nameFromJson(parsed.name);
  const alias = parsed.alias.map(aliasFromJson);
  const descriptions = parsed.descriptions.map(descriptionFromJson);
  const features = parsed.features.map(featureFromJson);

  return new dict.Dictionary(name, alias, descriptions, features);
}

function targetFromJson(json: any): dict.DictionaryTarget {
  return new dict.DictionaryTarget(json.targetName, json.targetType, json.targetLine, json.targetFilePath);
}

function nameFromJson(json: any): dict.DictionaryName {
  return new dict.DictionaryName(targetFromJson(json.target), json.value);
}

function aliasFromJson(json: any): dict.DictionaryAlias {
  return new dict.DictionaryAlias(json.value);
}

function descriptionFromJson(json: any): dict.DictionaryDescription {
  return new dict.DictionaryDescription(targetFromJson(json.target), json.value);
}

function featureNameFromJson(json: any): dict.DictionaryFeatureName {
  return new dict.DictionaryFeatureName(targetFromJson(json.target), json.value);
}

function featureDescriptionFromJson(json: any): dict.DictionaryFeatureDescription {
  return new dict.DictionaryFeatureDescription(targetFromJson(json.target), json.value);
}

function featureFromJson(json: any): dict.DictionaryFeature {
  const name = featureNameFromJson(json.name);
  const descriptions = json.descriptions.map(featureDescriptionFromJson);
  return new dict.DictionaryFeature(name, descriptions);
}
