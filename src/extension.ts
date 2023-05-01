import * as vscode from 'vscode';
import { DictionaryLoader } from './core/DictionaryLoader';
import { WindowNotifier } from './vscode/WindowNotifier';
import { OpenExplorerCommand } from './vscode/commands/OpenExplorerCommand';
import { DictionaryStorage } from './vscode/storage/DictionaryStorage';
import { DetailTextDocumentContent } from './vscode/textDocumentContents/DetailTextDocumentContent';
import { ExplorerTreeView } from './vscode/treeViews/ExplorerTreeView';
import { CommentHover } from './vscode/hovers/CommentHover';
import { ReloadCommand } from './vscode/commands/ReloadCommand';
import { OpenSourceCommand } from './vscode/commands/OpenSourceCommand';
import { SummaryTextDocumentContent } from './vscode/textDocumentContents/SummaryTextDocumentContent';
import { SettingLoader } from './core/Setting';

export function activate(context: vscode.ExtensionContext) {
	const windowNotifier = new WindowNotifier();
	const dictionaryLoader = new DictionaryLoader(windowNotifier);
	const settingLoader = new SettingLoader(windowNotifier);
	const dictionaryStorage = new DictionaryStorage(context, settingLoader, dictionaryLoader);
	dictionaryStorage.reload();

	const commentHover = CommentHover.forRuby(dictionaryStorage);
	const treeView = ExplorerTreeView.from(dictionaryStorage);
	const summaryTextDocumentContent = SummaryTextDocumentContent.from(dictionaryStorage);
	const detailTextDocumentContent = DetailTextDocumentContent.from(dictionaryStorage);
	const reloadCommand = ReloadCommand.from(dictionaryStorage, treeView.treeDataProvider);
	const openExplorerCommand = new OpenExplorerCommand();
	const openSourceCommand = new OpenSourceCommand();

	context.subscriptions.push(commentHover.register());
	context.subscriptions.push(treeView.register());
	context.subscriptions.push(summaryTextDocumentContent.register());
	context.subscriptions.push(detailTextDocumentContent.register());
	context.subscriptions.push(reloadCommand.register());
	context.subscriptions.push(openExplorerCommand.register());
	context.subscriptions.push(openSourceCommand.register());
}

// This method is called when your extension is deactivated
export function deactivate() {}
