export type Condition<T> = (value: T) => boolean;

/** Convert strings in rule JSON to a case-insensitive Condition<string>. */
export function matcher(pattern: string): Condition<string> {
	if (pattern.length >= 2
		&& pattern.startsWith('/')
		&& pattern.endsWith('/')
	) {
		const regex = new RegExp(pattern.slice(1, -1), 'i');

		return (value: string) => regex.test(value);
	}

	const _pattern = pattern.toLowerCase();
	return (value: string) => _pattern === value.toLowerCase();
}
