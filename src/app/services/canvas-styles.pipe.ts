import { Pipe, PipeTransform } from "@angular/core";
import { Config, CSS } from "../config";

@Pipe({ name: "canvasStyles" })
export default class CanvasStylesPipe implements PipeTransform
{
	transform(value: any): PropertiesMap | null
	{
		if (!Config.canvas) return null;
		if (!Config.canvas.background) return null;

		const canvas = Config.canvas;
		const r = {
			background: `url(${CSS.imagesUrl}/${canvas.background}) no-repeat`,
			backgroundSize: "100% 100%"
		} as any;

		if (canvas.width && canvas.height) {
			r.width = `${canvas.width}em`;
			r.height = `${canvas.height}em`;
		}

		return r;
	}
}
