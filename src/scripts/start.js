/* This is a start-up file that prepares the terminal configuration object Config
 * used by the app to build its UI.  Config must be loaded (from an external JS file)
 * BEFORE bootstraping Angular.
 */

// Create the global variable
var Config = Config;

(function() {
	var orgId = null;
	var pwd = null;

	if (!Config) {
		// Get password from local storage
		if (localStorage) pwd = localStorage.getItem("password");

		// Prompt for password if missing
		if (!pwd) pwd = (prompt("Password:") || "").trim();

		// Password can be orgId\password pair
		var n = pwd.indexOf("\\");
		if (n > 0 && n < pwd.length - 1) {
			orgId = pwd.substr(0, n).trim();
			pwd = pwd.substring(n + 1).trim();
		}

		// Store password
		if (pwd) {
			if (localStorage) localStorage.setItem("password", pwd);
		} else {
			document.body.textContent = "ACCESS DENIED.";
			throw new Error("No password!");
		}

		console.debug("Org = [" + orgId + "], Password = [" + pwd + "]");

		// Load the config script
		var head = document.getElementsByTagName("head")[0];
		var script = document.createElement("script");
		script.src = "config/" + (orgId || "default") + ".js";
		script.onload = function() {
			Config.orgId = orgId;
			Config.password = pwd;
		};
		script.onerror = function() {
			document.body.textContent = "AN ERROR HAS OCCURRED.";
			throw new Error("Missing Config file.");
		};
		head.appendChild(script);
	}
})();