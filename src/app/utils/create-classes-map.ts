import formatStateVariable from "./format-state-variable";

// Build a classes map for ngClass
export default function(field: string | null, maps: Terminal.IClassMap | Terminal.IClassMap[], fixedClasses?: string[])
{
	const mapClasses: Dictionary<string[]> = {};
	const mapsList = Array.isArray(maps) ? maps : [maps];

	mapsList.forEach(map =>
	{
		if (!map.class) return;

		map.class.split(/\s/).forEach(cls =>
		{
			// If it is "value", then ===; if it is "notValue", then !==
			const negated = !("value" in map);
			const value = !negated ? (map as Terminal.IClassMapValueBase).value : (map as Terminal.IClassMapNegatedValueBase).notValue;
			const valuesList: unknown[] = Array.isArray(value) ? value : [value];

			let expressions = valuesList.map(val =>
			{
				if (typeof val === "string") val = JSON.stringify(val);
				return `${formatStateVariable(field, map.field)}${negated ? "!=" : "=="}${val}`;
			});
			if (negated) expressions = ["(" + expressions.join("&&") + ")"];

			mapClasses[cls] = mapClasses[cls] || [];
			mapClasses[cls].push(...expressions);
		});
	});

	// Add all the standard classes
	if (fixedClasses) fixedClasses.filter(cls => cls).forEach(cls => mapClasses[cls] = ["true"]);

	// Merge classes with the same expressions
	const mapExpr: Dictionary<string[]> = {};

	Object.keys(mapClasses).forEach(cls =>
	{
		const expr = mapClasses[cls].join("||");
		mapExpr[expr] = mapExpr[expr] || [];
		mapExpr[expr].push(cls);
	});

	const classes: string[] = [];

	Object.keys(mapExpr).forEach(expr => classes.push(`"${mapExpr[expr].join(" ")}":${expr}`));

	return classes.join(", ");
}
