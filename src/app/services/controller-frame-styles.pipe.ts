import { Pipe, PipeTransform } from "@angular/core";
import { Config } from "../config";

@Pipe({ name: "controllerFrameStyles" })
export default class ControllerFrameStylesPipe implements PipeTransform
{
	transform(state: IControllerState): PropertiesMap | null
	{
		if (!state) return null;
		if (!(state.controllerId in Config.controllers)) return null;

		const cfg = Config.controllers[state.controllerId];
		const map = {} as PropertiesMap;

		if (cfg.size !== undefined) map["font-size"] = `${cfg.size * 100}%`;
		if (cfg.width !== undefined) map["width"] = `${cfg.width}em`;

		return map;
	}
}
