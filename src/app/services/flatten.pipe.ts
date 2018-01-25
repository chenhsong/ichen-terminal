import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "flatten" })
export default class FlattenPipe implements PipeTransform
{
	transform(value: any, field?: string): string
	{
		if (value === null || value === undefined) return "";
		if (!Array.isArray(value)) return value.toString();

		if (!!field) {
			return value.filter(x => x !== null && x !== undefined).map(x => (typeof x === "object") ? x[field as string] : x).join(",");
		} else {
			return value.filter(x => x !== null && x !== undefined).join(",");
		}
	}
}
