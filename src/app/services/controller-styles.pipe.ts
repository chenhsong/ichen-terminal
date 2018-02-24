import { Pipe, PipeTransform } from "@angular/core";
import { Config } from "../app.config";

@Pipe({ name: "controllerStyles" })
export default class ControllerStylesPipe implements PipeTransform
{
	transform(state: IControllerState): PropertiesMap | null
	{
		if (!state) return null;
		if (!(state.controllerId in Config.controllers)) return null;

		const cfg = Config.controllers[state.controllerId];
		const map = {} as any;

		if (cfg.x !== undefined && cfg.y !== undefined) {
			map.position = "absolute";
			map.margin = "0";
			map.left = `${cfg.x}em`;
			map.top = `${cfg.y}em`;
		}

		return map;
	}
}
