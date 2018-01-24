var Config = Config;

(function ()
{
	var orgId = null;
	var pwd;

	if (!Config) {
		// Get password from local storage
		if (localStorage) pwd = localStorage.getItem("password");

		if (!pwd) {
			// Prompt for password
			pwd = (prompt("Password:") || "").trim();

			// Store password
			if (pwd && localStorage) localStorage.setItem("password", pwd);
		}

		// Password can be orgId\password pair
		var n = pwd.indexOf("\\");
		if (n > 0 && n < pwd.length - 1) {
			orgId = pwd.substr(0, n).trim();
			pwd = pwd.substring(n + 1).trim();
		}

		console.debug("Org = [" + orgId + "], Password = [" + pwd + "]");

		// Load the config script
		var head = document.getElementsByTagName("head")[0];
		var script = document.createElement("script");
		script.src = "config/" + (orgId || "default") + ".js";
		head.appendChild(script);
	} else {
		orgId = Config.orgId;
		pwd = Config.password;
	}

	// Bootstrap the main component
	window.addEventListener("load", function ()
	{
		if (!pwd) {
			document.body.textContent = "ACCESS DENIED.";
			return;
		}

		if (!Config) {
			document.body.textContent = "AN ERROR HAS OCCURRED.";
			return;
		}

		Config.orgId = orgId;
		Config.password = pwd;

		System.import("main").catch(console.error.bind(console));
	});
})();