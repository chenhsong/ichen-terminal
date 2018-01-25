import { Pipe, PipeTransform } from "@angular/core";
import { Config, CSS, Constants, getCurrentLang } from "../config";

@Pipe({ name: "textMap" })
export default class TextMapPipe implements PipeTransform
{
	transform(value: any, id?: string): string
	{
		value = (value === null || value === undefined) ? "" : value.toString();
		const maps = Config.textMaps;
		if (!maps) return value;

		if (typeof maps === "string") {
			return value;
		} else {
			const maplang = maps[getCurrentLang()] || maps[Constants.defaultLang];
			const map = maplang[id || "default"];
			if (!map) return value;
			if (!map.hasOwnProperty(value)) return value;

			return map[value];
		}
	}
}
