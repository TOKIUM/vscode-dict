import * as vscode from 'vscode';
import { DictionaryStorage } from '../storage/DictionaryStorage';
import { SummaryTextDocumentContent } from '../textDocumentContents/SummaryTextDocumentContent';
import { includedIn } from '../../core/dict';

function isDefined<T>(value: T | undefined): value is T {
	return value !== undefined;
}

export class CommentHoverProvider implements vscode.HoverProvider {
	constructor(
		public storage: DictionaryStorage,
		public commentMarkers: string[],
	) {}

	static forRuby(storage: DictionaryStorage): CommentHoverProvider {
		return new CommentHoverProvider(storage, ['#']);
	}

	provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {
		const lineText = document.lineAt(position.line).text.trim();
		const all = this.storage.getNames().map((name) => this.storage.get(name)).filter(isDefined);

		// target only comment line
		if (!this.commentMarkers.some((marker) => lineText.startsWith(marker))) { return; }

		const included = includedIn(lineText, all);
		const message = Promise.all(included.map(async (d) => {
			const uri = SummaryTextDocumentContent.uri(d.name.value);
			const doc = await vscode.workspace.openTextDocument(uri);
			return doc.getText();
		}));

		const markdown = message.then((v) => new vscode.MarkdownString(v.join('\n\n')));

		return markdown.then((md) => {
			md.isTrusted = true;
			return new vscode.Hover(md);
		});
	}
}
