import * as vscode from 'vscode';
import { Disposable } from 'vscode';
import { DetailTextDocumentContentProvider } from './DetailTextDocumentContentProvider';
import { DictionaryStorage } from '../storage/DictionaryStorage';

export class DetailTextDocumentContent {
  static readonly scheme: string = 'vscode-dict-detail';

  constructor(
    public readonly provider: DetailTextDocumentContentProvider,
  ) {}

  static from(storage: DictionaryStorage): DetailTextDocumentContent {
    const provider = new DetailTextDocumentContentProvider(storage);
    return new DetailTextDocumentContent(provider);
  }

  static uri(word: string): vscode.Uri {
    return vscode.Uri.parse(DetailTextDocumentContent.scheme + ':' + word);
  }

  register(): Disposable {
    return vscode.workspace.registerTextDocumentContentProvider(DetailTextDocumentContent.scheme, this.provider);
  }
}
