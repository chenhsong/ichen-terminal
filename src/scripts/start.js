/* This is a start-up file that prepares the terminal configuration object Config
 * used by the app to build its UI template. Config must be loaded BEFORE bootstraping Angular.
 */

// Create the global variable
var Config = Config;

(function() {
	var orgId = null;
	var pwd = null;

	if (!Config || !Config.password) {
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
	} else {
		orgId = Config.orgId;
		pwd = Config.password;
	}

	if (!Config) {
		// NOTE: We use document.write here because we want to MAKE SURE that the
		//       Config file is loaded BEFORE bootstraping Angular

		// Load the Config file
		document.write("<script src='config/" + (orgId || "default") + ".js'></script>");

		// Update the org ID and password
		var stmt = "if (!Config.orgId) Config.orgId=" + JSON.stringify(orgId) + ";";
		stmt += "if (!Config.password) Config.password=" + JSON.stringify(pwd) + ";";
		document.write("<script>" + stmt + "</script>");
	} else {
		if (!Config.orgId) Config.orgId = orgId;
		if (!Config.password) Config.password = pwd;
	}
})();