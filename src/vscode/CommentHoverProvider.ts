import * as vscode from 'vscode';
import { DictionaryLoader } from '../core/DictionaryLoader';

export class CommentHoverProvider implements vscode.HoverProvider {
	constructor(
		public dictionaryLoader: DictionaryLoader,
		public commentMarkers: string[],
	) {}

	static forRuby(dictionaryLoader: DictionaryLoader): CommentHoverProvider {
		return new CommentHoverProvider(dictionaryLoader, ['#']);
	}

	provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {
		const workspacePaths = vscode.workspace.workspaceFolders?.map((folder) => folder.uri.path) ?? [];
		const dictionaries = this.dictionaryLoader.loadFromYaml(workspacePaths);
		const lineText = document.lineAt(position.line).text.trim();

		// target only comment line
		if (!this.commentMarkers.some((marker) => lineText.startsWith(marker))) { return; }

		const sentence = document.getWordRangeAtPosition(position);
		const message = dictionaries.includedIn(document.getText(sentence)).toMarkdown();

		return new vscode.Hover(message);
	}
}
