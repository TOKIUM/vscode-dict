import * as vscode from 'vscode';
import { CommentHoverProvider } from './vscode/CommentHoverProvider';
import { DictionaryLoader } from './core/DictionaryLoader';
import { WindowNotifier } from './vscode/WindowNotifier';

export function activate(context: vscode.ExtensionContext) {
	const windowNotifier = new WindowNotifier();
	const dictionaryLoader = new DictionaryLoader(windowNotifier);

	const rubyDocumentSelector: vscode.DocumentSelector = { language: 'ruby', scheme: 'file' };
	const rubyHoverProvider: vscode.HoverProvider = CommentHoverProvider.forRuby(dictionaryLoader);

	context.subscriptions.push(vscode.languages.registerHoverProvider(rubyDocumentSelector, rubyHoverProvider));
}

// This method is called when your extension is deactivated
export function deactivate() {}
