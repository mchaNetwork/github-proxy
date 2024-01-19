import {Router} from 'worktop';
import {reply} from 'worktop/response';
import forbidUser from '../filter/user';

const app = new Router<Bindings>();

app.add('GET', '/:user/:gist/raw/*', async (_, context) => {
	const {user, gist, '*': path} = context.params;
	if (forbidUser(user)) {
		return reply(403);
	}

	return fetch(`https://gist.githubusercontent.com/${user}/${gist}/raw/${path}`);
});

export default app;
