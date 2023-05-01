import * as vscode from 'vscode';
import { Disposable } from 'vscode';
import { DetailTextDocumentContent } from '../textDocumentContents/DetailTextDocumentContent';

export class OpenExplorerCommand {
	static readonly id: string = 'vscode-dict.open-explorer';

	register(): Disposable {
		return vscode.commands.registerCommand(OpenExplorerCommand.id, this.execute);
	}

	async execute(word: string): Promise<void> {
		const what = word ?? await vscode.window.showInputBox({ placeHolder: 'word...' });
		if (what) {
			const uri = DetailTextDocumentContent.uri(what);
			const panel = vscode.window.createWebviewPanel('vscode-dict', word, vscode.ViewColumn.One, { enableCommandUris: true });
			const doc = await vscode.workspace.openTextDocument(uri);
			const mdHtml = await vscode.commands.executeCommand('markdown.api.render', doc.getText());
			const html = `<html><head><meta http-equiv="Content-Security-Policy" content="default-src 'none';"><head><body>${mdHtml}</body></html>`;
			panel.webview.html = html;
			await vscode.commands.executeCommand('vscode-dict-explorer.focus');
		}
	}

	static link(word: string): string {
		const label = word;
		const link = `command:${OpenExplorerCommand.id}?` + encodeURIComponent(JSON.stringify([word]));

		return `[${label}](${link})`;
	}
}
