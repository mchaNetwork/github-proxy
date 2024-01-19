import {Router} from 'worktop';
import {reply} from 'worktop/response';
import forbidRepo from '../filter/repo';
import forbidUser from '../filter/user';

export type ArchiveFormat =
	| 'tar.gz'
	| 'zip'
	| 'legacy.tar.gz'
	| 'legacy.zip';

export async function codeload(user: string, repo: string, format: ArchiveFormat, ref: string) {
	return fetch(
		`https://codeload.github.com/${user}/${repo}/${format}/${ref}`,
	);
}

const app = new Router<Bindings>();

app.add('GET', '/:user/:repo/:format/*', async (_, context) => {
	const {user, repo, format, '*': ref} = context.params;
	if (forbidUser(user) || forbidRepo({repo, user})) {
		return reply(403);
	}

	switch (format) {
		case 'tar.gz':
		case 'zip':
		case 'legacy.tar.gz':
		case 'legacy.zip': {
			break;
		}

		default: {
			return reply(400, '400: Invalid request');
		}
	}

	return codeload(user, repo, format, ref);
});

export default app;
