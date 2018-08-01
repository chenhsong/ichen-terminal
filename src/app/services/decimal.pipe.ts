import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "decimal" })
export default class DecimalPipe implements PipeTransform
{
	transform(value: number, scale?: number): string
	{
		if (scale === undefined) return value.toString();
		value /= Math.pow(10, scale);
		return value.toString();
	}
}
