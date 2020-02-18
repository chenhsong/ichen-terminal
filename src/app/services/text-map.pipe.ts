import { Pipe, PipeTransform } from "@angular/core";
import { Config, Constants, getCurrentLang } from "../app.config";

@Pipe({ name: "textMap" })
export default class TextMapPipe implements PipeTransform
{
	transform(value: unknown, id?: string): string
	{
		const key: string = (value === null || value === undefined) ? "" : (value as any).toString();

		const maps = Config.textMaps;
		if (!maps) return key;

		if (typeof maps === "string") {
			return key;
		} else {
			const map_lang = maps[getCurrentLang()] ?? maps[Constants.defaultLang];
			const map = map_lang[id ?? "default"];
			if (!map) return key;
			if (!map.hasOwnProperty(key)) return key;

			return map[key];
		}
	}
}
