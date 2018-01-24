export default function <T>(dict: Dictionary<T>)
{
	const map = new Map<string, T>();

	for (let key in dict) {
		if (!dict.hasOwnProperty(key)) continue;
		map.set(key, dict[key]);
	}

	return map;
}