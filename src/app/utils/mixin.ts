export default function (src: any, dest: any)
{
	for (const prop in src) {
		if (!src.hasOwnProperty(prop)) continue;
		dest[prop] = src[prop];
	}
}
