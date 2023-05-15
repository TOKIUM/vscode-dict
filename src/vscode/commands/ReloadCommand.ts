import * as vscode from 'vscode';
import { ExplorerTreeDataProvider } from '../treeViews/ExplorerTreeDataProvider';
import { DictionaryStorage } from '../storage/DictionaryStorage';
import { SummaryTextDocumentContentProvider } from '../textDocumentContents/SummaryTextDocumentContentProvider';
import { DetailTextDocumentContentProvider } from '../textDocumentContents/DetailTextDocumentContentProvider';
import { SummaryTextDocumentContent } from '../textDocumentContents/SummaryTextDocumentContent';
import { DetailTextDocumentContent } from '../textDocumentContents/DetailTextDocumentContent';

export class ReloadCommand {
  static readonly id: string = 'vscode-dict.reload';
  constructor(
    public readonly storage: DictionaryStorage,
    public readonly treeDataProvider: ExplorerTreeDataProvider,
    public readonly summaryTextDocumentContentProvider: SummaryTextDocumentContentProvider,
    public readonly detailTextDocumentContentProvider: DetailTextDocumentContentProvider,
  ) { }

  static from(storage: DictionaryStorage, treeDataProvider: ExplorerTreeDataProvider, summaryTextDocumentContentProvider: SummaryTextDocumentContentProvider, detailTextDocumentContentProvider: DetailTextDocumentContentProvider): ReloadCommand {
    return new ReloadCommand(storage, treeDataProvider, summaryTextDocumentContentProvider, detailTextDocumentContentProvider);
  }

  register(): vscode.Disposable {
    return vscode.commands.registerCommand(
      ReloadCommand.id,
      () => {
        this.storage.reload().then(() => {
          const names = this.storage.getNames();
          this.treeDataProvider.reload();
          names.forEach((name) => { this.summaryTextDocumentContentProvider.reload(SummaryTextDocumentContent.uri(name)); this.detailTextDocumentContentProvider.reload(DetailTextDocumentContent.uri(name)); });
        });
        this.treeDataProvider.reload();
      }
    );
  }
}
