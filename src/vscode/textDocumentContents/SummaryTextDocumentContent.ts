import * as vscode from 'vscode';
import { DictionaryStorage } from '../storage/DictionaryStorage';
import { SummaryTextDocumentContentProvider } from './SummaryTextDocumentContentProvider';

export class SummaryTextDocumentContent {
  static readonly scheme: string = 'vscode-dict-summary';

  constructor(
    public readonly provider: SummaryTextDocumentContentProvider,
  ) {}

  static from(storage: DictionaryStorage): SummaryTextDocumentContent {
    const provider = new SummaryTextDocumentContentProvider(storage);
    return new SummaryTextDocumentContent(provider);
  }

  static uri(word: string): vscode.Uri {
    return vscode.Uri.parse(SummaryTextDocumentContent.scheme + ':' + word);
  }

  register(): vscode.Disposable {
    return vscode.workspace.registerTextDocumentContentProvider(SummaryTextDocumentContent.scheme, this.provider);
  }
}
