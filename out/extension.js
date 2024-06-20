"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const crypto = __importStar(require("crypto"));
const wb_textUtils_1 = require("./helpers/wb_textUtils");
const algorithm = 'aes-256-cbc';
const key = "oursavebythiskeyhiddenpleasewait";
const iv = "itsnotverysecure";
function encrypt(text) {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf-8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
}
function decrypt(encryptedText) {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText, 'base64', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
}
function activate(context) {
    const decryptDispose = vscode.commands.registerCommand('bonelab-save-editor.decrypt-save', function () {
        // Get the active text editor
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            //Defining the document and selection
            const document = editor.document;
            const selection = editor.selection;
            //Getting the text
            const word = (0, wb_textUtils_1.GetAllText)();
            const objectData = JSON.parse(word);
            //unlocks
            const unlocksText = decrypt(objectData["unlocks"]);
            objectData["unlocks"] = JSON.parse(unlocksText);
            //progression
            const progressionText = decrypt(objectData["progression"]);
            objectData["progression"] = JSON.parse(progressionText);
            //Replace The Text
            editor.edit(builder => {
                const doc = editor.document;
                builder.replace(selection, JSON.stringify(objectData));
            });
            vscode.commands.executeCommand('editor.action.formatDocument');
        }
    });
    const encryptDispose = vscode.commands.registerCommand('bonelab-save-editor.encrypt-save', function () {
        // Get the active text editor
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            //Defining the document and selection
            const document = editor.document;
            const selection = editor.selection;
            //Getting the text
            const word = (0, wb_textUtils_1.GetAllText)();
            const objectData = JSON.parse(word);
            //unlocks
            const encryptedUnlocks = encrypt(JSON.stringify(objectData["unlocks"]));
            objectData["unlocks"] = encryptedUnlocks;
            //progression
            const encryptedProgression = encrypt(JSON.stringify(objectData["progression"]));
            objectData["progression"] = encryptedProgression;
            //Replace The Text
            editor.edit(builder => {
                const doc = editor.document;
                builder.replace(selection, JSON.stringify(objectData));
            });
            vscode.commands.executeCommand('editor.action.formatDocument');
        }
    });
    context.subscriptions.push(decryptDispose);
    context.subscriptions.push(encryptDispose);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map