import type {Context} from 'worktop';
import type {KV} from 'worktop/cfw.kv';

declare global {
	type Bindings = {
		bindings: {
			ASSETS: Fetcher;
		};
	} & Context;

	const process: {
		env: Record<string, string>;
	};
}
