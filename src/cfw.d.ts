import type {Context} from 'worktop';

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
