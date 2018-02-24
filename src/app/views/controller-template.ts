import { HTML, CSS, Config } from "../app.config";
import { formatStateVariable, createClassesMap } from "../utils/utils";

// Build the template for the main display box
// Template = <div ctrl-frame><div line></div><div line></div>...</div>
export function buildTemplate(stateProperty: string, isCollapsedProperty: string, calcRatioFunc: string)
{
	let classes: string | null = null;

	if (Config.controllers.default.maps) {
		// If the frame has a class map, build the classes
		classes = createClassesMap(null, Config.controllers.default.maps) || null;
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
	const field = formatStateVariable(line.field);

	// Create a class name from the field expression - replace non-text/digit characters to dashes
	const fieldClass = line.field.replace(/[^A-Za-z0-9\-_]/g, "-").replace("--", "-");
	const id = `${HTML.controllerId}-{{${stateProperty}.controllerId}}-${fieldClass}`;

	// Template
	let tpl: string;

	let textlink = field;
	if (line.filter) textlink += "|" + line.filter;
	textlink = "{{" + textlink + "}}";

	// Add classes map (if any)
	const extra_classes = [
		CSS.controllerItem,
		`${CSS.controllerItem}-${fieldClass}`,
		line.class
	].filter(cls => !!cls);

	const collapse = line.showAlways ? "" : `*ngIf='!${isCollapsedProperty}'`;

	if (line.maps && line.maps) {
		// If the line has a class map, construct the ngClass object
		const classes = createClassesMap(line.field, line.maps);
		tpl = `<div id="${id}" ${collapse} class="${extra_classes.join(" ")}" [ngClass]='{${classes}}'>`;
	} else {
		// Otherwise just simple classes added to the wrapping div
		tpl = `<div id="${id}" ${collapse} class="${extra_classes.join(" ")}">`;
	}

	// Min-max (if any)
	if (line.max && line.min) {
		const min = (typeof line.min === "string") ? `${stateProperty}.${line.min}` : line.min.toString();
		const max = (typeof line.max === "string") ? `${stateProperty}.${line.max}` : line.max.toString();
		const minmaxbarclasses = [CSS.controllerItemMinMaxBar, line.overlay].filter(cls => !!cls).join(" ");

		tpl += `<div class="${minmaxbarclasses}"
								 *ngIf="${field}!=null && ${field}!=undefined"
								 [ngStyle]="{width:${calcRatioFunc}(${field},${max},${min})+'%'}">
						</div>`;

		tpl += `<div class="${CSS.controllerMinMaxItem}">${textlink}</div>`;
	} else {
		// Text info
		tpl += textlink;
	}

	// End template
	tpl += `</div>
`;

	return tpl;
}
