import mixin from "./mixin";

export default function <T extends Object>(dict: Dictionary<T>, map: Map<string, T>)
{
	for (const id in dict) {
		if (!dict.hasOwnProperty(id)) continue;

		const obj = dict[id];
		if (!map.has(id)) map.set(id, {} as T);

		// Mixin new status
		mixin(obj, map.get(id));
	}
}
