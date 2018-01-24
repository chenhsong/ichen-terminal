import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import AppModule from "./module";
import { HTML, Config } from "./config";

// Get WebSocket URL
if (!Config.url) {
	// Default to same host at default port
	Config.url = `ws://${location.hostname}:${HTML.defaultWebSocketPort}`;
} else if (typeof Config.url === "number") {
	Config.url = `ws://${location.hostname}:${Config.url}`;
}

// Bootstrap the main app component
if (Config.url && Config.password) {
	platformBrowserDynamic().bootstrapModule(AppModule);
} else {
	document.body.textContent = "AN ERROR HAS OCCURRED.";
}