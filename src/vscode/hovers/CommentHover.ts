import * as vscode from 'vscode';
import { DictionaryStorage } from '../storage/DictionaryStorage';
import { CommentHoverProvider } from './CommentHoverProvider';

export class CommentHover {
  constructor(
    private readonly documentSelector: vscode.DocumentSelector,
    private readonly hoverProvider: vscode.HoverProvider,
  ) {}

  static forRuby(storage: DictionaryStorage): CommentHover {
    const documentSelector: vscode.DocumentSelector = { language: 'ruby', scheme: 'file' };
    const hoverProvider: vscode.HoverProvider = CommentHoverProvider.forRuby(storage);
    return new CommentHover(documentSelector, hoverProvider);
  }

  register(): vscode.Disposable {
    return vscode.languages.registerHoverProvider(this.documentSelector, this.hoverProvider);
  }
}
