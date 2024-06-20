import * as vscode from 'vscode';

const textEditor = vscode.window.activeTextEditor;


export function GetAllText() {
    if (textEditor) {
        const fullText = textEditor.document.getText()
        return fullText;
    } else {
        return "error";
    }
}