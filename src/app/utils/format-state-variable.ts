export default function(field: string | null, mapField?: string)
{
	const full_field = mapField || field;
	if (!full_field) throw new Error("formatStateVariable: One of field or mapField must be non-null.");

	if (full_field.startsWith("!")) return full_field.substring(1);
	return "state." + full_field;
}
