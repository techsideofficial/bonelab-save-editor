import * as vscode from 'vscode';
import * as crypto from 'crypto';
import { GetAllText } from './helpers/wb_textUtils';
import { FormatDoc } from './helpers/wb_formatDoc';

const algorithm = 'aes-256-cbc';
const key = "oursavebythiskeyhiddenpleasewait";
const iv = "itsnotverysecure";

function encrypt(text: string): string {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf-8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
}

function decrypt(encryptedText: string): string {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText, 'base64', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
}

function getActiveTextContent() {
    // Get the active text editor
    const editor = vscode.window.activeTextEditor;

    if (editor) {
        let document = editor.document;

        // Get the document text
        const documentText = document.getText();

        return documentText;
    } else {
        return "invalid";
    }
};




export function activate(context: vscode.ExtensionContext) {
	const decryptDispose = vscode.commands.registerCommand('bonelab-save-editor.decrypt-save', function() {
		// Get the active text editor
		const editor = vscode.window.activeTextEditor;

		if (editor) {
            //Defining the document and selection
			const document = editor.document;
			const selection = editor.selection;

            //Getting the text
            const word = GetAllText();
            const objectData = JSON.parse(word);

            //unlocks
            const unlocksText = decrypt(objectData["unlocks"])
            objectData["unlocks"] = JSON.parse(unlocksText);

            //progression
            const progressionText = decrypt(objectData["progression"])
            objectData["progression"] = JSON.parse(progressionText);

            //Replace The Text
            editor.edit(builder => {
                const doc = editor.document;
                builder.replace(new vscode.Range(doc.lineAt(0).range.start, doc.lineAt(doc.lineCount - 1).range.end), JSON.stringify(objectData));
            });

            // vscode.commands.executeCommand('editor.action.formatDocument')
		}
	});

    const encryptDispose = vscode.commands.registerCommand('bonelab-save-editor.encrypt-save', function() {
		// Get the active text editor
		const editor = vscode.window.activeTextEditor;

		if (editor) {
            //Defining the document and selection
			const document = editor.document;
			const selection = editor.selection;

            //Getting the text
            const word = GetAllText();
            const objectData = JSON.parse(word);

            //unlocks
            const encryptedUnlocks = encrypt(JSON.stringify(objectData["unlocks"]))
            objectData["unlocks"] = encryptedUnlocks

            //progression
            const encryptedProgression = encrypt(JSON.stringify(objectData["progression"]))
            objectData["progression"] = encryptedProgression;

            //Replace The Text
            editor.edit(builder => {
                const doc = editor.document;
                builder.replace(new vscode.Range(doc.lineAt(0).range.start, doc.lineAt(doc.lineCount - 1).range.end), JSON.stringify(objectData));
            });

            // vscode.commands.executeCommand('editor.action.formatDocument')
		}
	});

	context.subscriptions.push(decryptDispose);
    context.subscriptions.push(encryptDispose);
}