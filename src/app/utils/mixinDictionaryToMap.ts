export default function <T extends Object>(dict: Dictionary<T>, map: Map<string, T>)
{
	for (const id in dict) {
		if (!dict.hasOwnProperty(id)) continue;

		if (!map.has(id)) map.set(id, {} as T);

		// Mixin new status
		map.set(id, Object.assign(map.get(id), dict[id]));
	}
}
