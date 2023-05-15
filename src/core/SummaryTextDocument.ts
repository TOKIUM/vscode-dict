import * as dict from '@tokiumjp/dict';
import { OpenExplorerCommand } from '../vscode/commands/OpenExplorerCommand';

export class SummaryTextDocument {
  constructor(
    public readonly value: dict.Dictionary,
  ) {}

  get text(): string {
    return nameLine(this.value) + '\n\n' + descriptionLines(this.value);
  }
}

function nameLine(value: dict.Dictionary): string {
  return value.alias.length === 0 ? `### ${OpenExplorerCommand.link(value.name.value)}` : `### ${OpenExplorerCommand.link(value.name.value)} (${value.alias.map((v) => v.value).join(', ')})`;
}

function descriptionLines(value: dict.Dictionary): string {
  return value.descriptions.map((d) => d.value).join('\n');
}
