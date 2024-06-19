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
exports.WeatherViewProvider = void 0;
const vscode_1 = require("vscode");
const getUri_1 = require("../utilities/getUri");
const getNonce_1 = require("../utilities/getNonce");
const weather = __importStar(require("weather-js"));
class WeatherViewProvider {
    _extensionUri;
    static viewType = "weather.weatherView";
    constructor(_extensionUri) {
        this._extensionUri = _extensionUri;
    }
    resolveWebviewView(webviewView, context, _token) {
        // Allow scripts in the webview
        webviewView.webview.options = {
            // Enable JavaScript in the webview
            enableScripts: true,
            // Restrict the webview to only load resources from the `out` directory
            localResourceRoots: [vscode_1.Uri.joinPath(this._extensionUri, "out")],
        };
        // Set the HTML content that will fill the webview view
        webviewView.webview.html = this._getWebviewContent(webviewView.webview, this._extensionUri);
        // Sets up an event listener to listen for messages passed from the webview view context
        // and executes code based on the message that is recieved
        this._setWebviewMessageListener(webviewView);
    }
    _getWebviewContent(webview, extensionUri) {
        const webviewUri = (0, getUri_1.getUri)(webview, extensionUri, ["out", "webview.js"]);
        const stylesUri = (0, getUri_1.getUri)(webview, extensionUri, ["out", "styles.css"]);
        const nonce = (0, getNonce_1.getNonce)();
        // Tip: Install the es6-string-html VS Code extension to enable code highlighting below
        return /*html*/ `
              <!DOCTYPE html>
              <html lang="en">
                  <head>
                      <meta charset="UTF-8">
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
                      <link rel="stylesheet" href="${stylesUri}">
                      <title>Weather Checker</title>
                  </head>
                  <body>
            <h1>Weather Checker</h1>
            <section id="search-container">
              <vscode-text-field
                id="location"
                placeholder="Location"
                value="Seattle, WA">
              </vscode-text-field>
              <vscode-dropdown id="unit">
                <vscode-option value="F">Fahrenheit</vscode-option>
                <vscode-option value="C">Celsius</vscode-option>
              </vscode-dropdown>
            </section>
            <vscode-button id="check-weather-button">Check</vscode-button>
            <h2>Current Weather</h2>
            <section id="results-container">
              <vscode-progress-ring id="loading" class="hidden"></vscode-progress-ring>
              <p id="icon"></p>
              <p id="summary"></p>
            </section>
            <script type="module" nonce="${nonce}" src="${webviewUri}"></script>
                  </body>
              </html>
          `;
    }
    _setWebviewMessageListener(webviewView) {
        webviewView.webview.onDidReceiveMessage((message) => {
            const command = message.command;
            const location = message.location;
            const unit = message.unit;
            switch (command) {
                case "weather":
                    weather.find({ search: location, degreeType: unit }, (err, result) => {
                        if (err) {
                            webviewView.webview.postMessage({
                                command: "error",
                                message: "Sorry couldn't get weather at this time...",
                            });
                            return;
                        }
                        // Get the weather forecast results
                        const weatherForecast = result[0];
                        // Pass the weather forecast object to the webview
                        webviewView.webview.postMessage({
                            command: "weather",
                            payload: JSON.stringify(weatherForecast),
                        });
                    });
                    break;
            }
        });
    }
}
exports.WeatherViewProvider = WeatherViewProvider;
//# sourceMappingURL=nexWindowProvider.js.map