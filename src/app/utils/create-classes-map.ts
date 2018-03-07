import formatStateVariable from "./format-state-variable";

// Build a classes map for ngClass
export default function(field: string | null, maps: Terminal.IClassMap | Terminal.IClassMap[], fixedClasses?: string[])
{
	const mapObj = {} as { [className: string]: string[]; };
	const mapsList = (maps instanceof Array) ? maps : [maps];

	mapsList.forEach(map =>
	{
		if (!map.class) return;

		map.class.split(/\s/).forEach(cls =>
		{
			// If it is "value", then ===; if it is "notValue", then !==
			const negated = !map.hasOwnProperty("value");
			const value = !negated ? (map as Terminal.IClassMapValueBase).value : (map as Terminal.IClassMapNegatedValueBase).notValue;
			const valuesList: any[] = Array.isArray(value) ? value : [value];

			let expressions = valuesList.map(val =>
			{
				if (typeof val === "string") val = JSON.stringify(val);
				return `${formatStateVariable(field, map.field)}${negated ? "!=" : "=="}${val}`;
			});
			if (negated) expressions = ["(" + expressions.join("&&") + ")"];

			if (!(cls in mapObj)) mapObj[cls] = [];
			mapObj[cls].push(...expressions);
		});
	});

	// Add all the standard classes
	if (fixedClasses) fixedClasses.filter(cls => !!cls).forEach(cls => mapObj[cls] = ["true"]);

	// Merge classes with the same expressions
	const reverseMapObj = {} as { [expr: string]: string[]; };

	for (const cls in mapObj) {
		if (!mapObj.hasOwnProperty(cls)) continue;

		const expr = mapObj[cls].join("||");
		reverseMapObj[expr] = reverseMapObj[expr] || [];
		reverseMapObj[expr].push(cls);
	}

	const classes: string[] = [];

	for (const expr in reverseMapObj) {
		if (!reverseMapObj.hasOwnProperty(expr)) continue;

		classes.push(`"${reverseMapObj[expr].join(" ")}":${expr}`);
	}

	return classes.join(", ");
}
