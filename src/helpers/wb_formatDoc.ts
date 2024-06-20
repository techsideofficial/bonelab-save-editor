import * as vscode from 'vscode';

const activeEditor = vscode.window.activeTextEditor;

export async function FormatDoc() {
    if(activeEditor) {
        await vscode.commands.executeCommand<vscode.Location[]>(
            'vscode.executeFormatDocumentProvider',
            activeEditor.document.uri,
          );
    }
}