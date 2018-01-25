export default function (field: string | null, mapField?: string)
{
	let fullfield = mapField || field;
	if (!fullfield) throw new Error("formatStateVariable: One of field or mapField must be non-null.");

	if (fullfield.startsWith("!")) return fullfield.substring(1);
	return fullfield = "state." + fullfield;
}
