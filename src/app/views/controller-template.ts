import { HTML, CSS, Config } from "../app.config";
import { FormatStateVariable, CreateClassesMap } from "../utils/utils";
import * as Terminal from "../terminal-config";

// Build the template for the main display box
// Template = <div ctrl-frame><div line></div><div line></div>...</div>
export function buildTemplate(stateProperty: string, isCollapsedProperty: string, calcRatioFunc: string)
{
	let classes: string | null = null;

	if (Config.controllers.default.maps) {
		// If the frame has a class map, build the classes
		classes = CreateClassesMap(null, Config.controllers.default.maps) || null;
	}

	classes = [classes, `"${CSS.controllerCollapsed}":${isCollapsedProperty}`].join(", ");

	// Generate the tag
	let tpl = `
		<div (click)='onClick($event)'
		     class="${CSS.controllerFrame}"
		     [ngClass]='{${classes}}'
		     [ngStyle]="${stateProperty}|controllerFrameStyles">
	`;

	for (const line of Config.controllers.default.lines) {
		tpl += buildLineTemplate(stateProperty, isCollapsedProperty, calcRatioFunc, line);
	}

	tpl += `<div class="${CSS.controllerItem} ${CSS.controllerItemSeparator}"></div>`;

	tpl += `
		</div>
	`;

	console.debug(tpl);

	return tpl;
}

// Build the template for one line
function buildLineTemplate(stateProperty: string, isCollapsedProperty: string, calcRatioFunc: string, line: Terminal.ILineConfig)
{
	const field = FormatStateVariable(line.field);

	// Create a class name from the field expression - replace non-text/digit characters to dashes
	let fieldClass = line.field.replace(/[^A-Za-z0-9\-_]/g, "-");
	while (fieldClass.indexOf("--") >= 0) fieldClass = fieldClass.replace("--", "-");

	const id = `${HTML.controllerId}-{{${stateProperty}.controllerId}}-${fieldClass}`;

	// Template
	let tpl: string;

	let text_link = field;
	if (line.filter) text_link += "|" + line.filter;
	text_link = "{{" + text_link + "}}";

	// Add classes map (if any)
	const extra_classes = [
		CSS.controllerItem,
		`${CSS.controllerItem}-${fieldClass}`,
		line.class
	].filter(cls => cls);

	const collapse = line.showAlways ? "" : `*ngIf='!${isCollapsedProperty}'`;

	if (line.maps) {
		// If the line has a class map, construct the ngClass object
		const classes = CreateClassesMap(line.field, line.maps);
		tpl = `<div id="${id}" ${collapse} class="${extra_classes.join(" ")}" [ngClass]='{${classes}}'>`;
	} else {
		// Otherwise just simple classes added to the wrapping div
		tpl = `<div id="${id}" ${collapse} class="${extra_classes.join(" ")}">`;
	}

	// Min-max (if any)
	if (line.max !== undefined && line.min !== undefined) {
		const min = (typeof line.min === "string") ? `${stateProperty}.${line.min}` : line.min.toString();
		const max = (typeof line.max === "string") ? `${stateProperty}.${line.max}` : line.max.toString();
		const min_max_bar_classes = [CSS.controllerItemMinMaxBar, line.overlay].filter(cls => cls).join(" ");

		tpl += `<div class="${min_max_bar_classes}"
								 *ngIf="${field}!=null && ${field}!=undefined"
								 [ngStyle]="{width:${calcRatioFunc}(${field},${max},${min})+'%'}">
						</div>`;

		tpl += `<div class="${CSS.controllerMinMaxItem}">${text_link}</div>`;
	} else {
		// Text info
		tpl += text_link;
	}

	// End template
	tpl += `</div>
`;

	return tpl;
}
