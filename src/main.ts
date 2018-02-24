import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { AppModule } from "./app/app.module";
import { HTML, Config } from "./app/app.config";

// Get WebSocket URL
if (!Config.url) {
	// Default to same host at default port
	Config.url = `ws://${location.hostname}:${HTML.defaultWebSocketPort}`;
} else if (typeof Config.url === "number") {
	Config.url = `ws://${location.hostname}:${Config.url}`;
}

// Bootstrap the main app component

if (Config.url && Config.password) {
	platformBrowserDynamic().bootstrapModule(AppModule)
		.catch(err => console.error(err));
} else {
	console.error("Missing URL or password.");
	document.body.textContent = "AN ERROR HAS OCCURRED.";
}
