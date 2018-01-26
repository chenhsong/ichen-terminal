// Constants

const appClassPrefix = "terminal";
const controllerClassPrefix = "ctrl";
const langKey = "lang";

export const Constants = {
	actionIdField: "actionId",
	actionFilter: "Actions",
	defaultLang: "en"
};

export const HTML = {
	defaultWebSocketPort: 5788,
	password: "password",
	app: "terminal",
	controllersList: `${appClassPrefix}-controllers`,
	controller: `${appClassPrefix}-controller`,
	controllerId: "CONTROLLER",
	btnChangeSettings: "btnChangeSettings",
	imgLoading: "imgLoading"
};

export const CSS = {
	imagesUrl: "images",
	imgLoading: "common/loading.gif",
	serverStatus: `${appClassPrefix}-server-status`,
	serverStatusOnLine: `${appClassPrefix}-server-online`,
	serverStatusDenied: `${appClassPrefix}-server-denied`,
	serverStatusOffLine: `${appClassPrefix}-server-offline`,
	serverStatusConnecting: `${appClassPrefix}-server-connecting`,
	serverStatusError: `${appClassPrefix}-server-error`,
	controller: controllerClassPrefix,
	controllerCollapsed: `${controllerClassPrefix}-collapsed`,
	controllerFrame: `${controllerClassPrefix}-frame`,
	controllerItem: `${controllerClassPrefix}-item`,
	controllerItemSeparator: `${controllerClassPrefix}-item-separator`,
	controllerMinMaxItem: `${controllerClassPrefix}-item-min-max`,
	controllerItemMinMaxBar: `${controllerClassPrefix}-item-min-max-bar`
};

// Read language from local storage

let currLang = Constants.defaultLang;

export function getCurrentLang() { return currLang; }

if (localStorage) {
	const lang = localStorage.getItem(langKey);
	if (!!lang) currLang = lang;
	console.log(`Current language = ${currLang}`);
}

// Configuration object

declare var Config: Terminal.IConfig;

export { Config };
