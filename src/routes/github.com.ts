import {Router} from 'worktop';
import {reply} from 'worktop/response';
import forbidRepo from '../filter/repo';
import forbidUser from '../filter/user';
import {codeload, type ArchiveFormat} from './codeload.github.com';
import {raw} from './raw.githubusercontent.com';

const app = new Router<Bindings>();

app.add('GET', '/:user/:repo/releases/download/:tag/:artifact', async (request, context) => {
	const {user, repo, tag, artifact} = context.params;
	if (forbidUser(user) || forbidRepo({user, repo})) {
		return reply(403);
	}

	const range = request.headers.get('content-range');
	const headers = new Headers();
	if (range !== null) {
		headers.set('content-range', range);
	}

	return fetch(
		`https://github.com/${user}/${repo}/releases/download/${tag}/${artifact}`,
		{
			redirect: 'follow',
			headers: range ? headers : undefined,
		},
	);
});

app.add('GET', '/:user/:repo/archive/*', async (_, context) => {
	const {user, repo, '*': ref} = context.params;
	if (forbidUser(user) || forbidRepo({user, repo})) {
		return reply(403);
	}

	let format: ArchiveFormat;

	if (ref.endsWith('.tar.gz')) {
		format = 'tar.gz';
	} else if (ref.endsWith('.zip')) {
		format = 'zip';
	} else {
		return reply(404, 'Not Found');
	}

	return codeload(user, repo, format, ref);
});

app.add('GET', '/:user/:repo/zipball/*', async (_, context) => {
	const {user, repo, '*': ref} = context.params;
	if (forbidUser(user) || forbidRepo({user, repo})) {
		return reply(403);
	}

	return codeload(user, repo, 'legacy.zip', ref);
});

app.add('GET', '/:user/:repo/tarball/*', async (_, context) => {
	const {user, repo, '*': ref} = context.params;
	if (forbidUser(user) || forbidRepo({user, repo})) {
		return reply(403);
	}

	return codeload(user, repo, 'legacy.tar.gz', ref);
});

app.add('GET', '/:user/:repo/raw/*', async (_, context) => {
	const {user, repo, '*': path} = context.params;
	if (forbidUser(user) || forbidRepo({user, repo})) {
		return reply(403);
	}

	return raw(user, repo, path);
});

app.add('GET', '/:user/:repo/info/refs', async (request, context) => {
	const service = context.url.searchParams.get('service');
	if (!service) {
		return reply(403, `Please upgrade your git client.
GitHub.com no longer supports git over dumb-http: https://github.com/blog/809`);
	} else if (service !== 'git-upload-pack') {
		return reply(404, 'Not Found');
	}

	const {user, repo} = context.params;
	if (forbidUser(user) || forbidRepo({user, repo})) {
		return reply(403);
	}

	const headers = new Headers();
	const protocol = request.headers.get('git-protocol');

	if (protocol) {
		headers.set('Git-Protocol', protocol);
	}

	return fetch(`https://github.com/${user}/${repo}/info/refs?service=git-upload-pack`, {
		headers,
	});
});

app.add('POST', '/:user/:repo/git-upload-pack', async (request, context) => {
	const {user, repo} = context.params;
	if (forbidUser(user) || forbidRepo({user, repo})) {
		return reply(403);
	}

	const headers = new Headers();
	const protocol = request.headers.get('git-protocol');
	const type = request.headers.get('content-type');

	if (protocol) {
		headers.set('Git-Protocol', protocol);
	}

	if (type) {
		headers.set('Content-Type', type);
	}

	return fetch(`https://github.com/${user}/${repo}/git-upload-pack`, {
		body: request.body,
		headers,
	});
});

export default app;
