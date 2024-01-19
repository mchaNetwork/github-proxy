import {Router} from 'worktop';
import {reply} from 'worktop/response';
import forbidRepo from '../filter/repo';
import forbidUser from '../filter/user';

export async function raw(user: string, repo: string, path: string) {
	return fetch(`https://raw.githubusercontent.com/${user}/${repo}/${path}`);
}

const app = new Router<Bindings>();

app.add('GET', '/:user/:repo/*', async (_, context) => {
	const {user, repo, '*': path} = context.params;
	if (forbidUser(user) || forbidRepo({user, repo})) {
		return reply(403);
	}

	return raw(user, repo, path);
});

export default app;
