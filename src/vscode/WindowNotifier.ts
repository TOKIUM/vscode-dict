import * as vscode from 'vscode';
import { Notifier } from '../core/Notifier';

export class WindowNotifier implements Notifier {

  info(message: string): void {
    vscode.window.showInformationMessage(message);
  }

  warn(message: string): void {
    vscode.window.showWarningMessage(message);
  }

  error(message: string): void {
    vscode.window.showErrorMessage(message);
  }
}
