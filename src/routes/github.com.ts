import {Router} from 'worktop';
import {reply} from 'worktop/response';
import forbidRepo from '../filter/repo';
import forbidUser from '../filter/user';
import {codeload, type ArchiveFormat} from './codeload.github.com';
import {raw} from './raw.githubusercontent.com';

const app = new Router<Bindings>();

// Tag names can include slashes, bailing out.
app.add('GET', '/:user/:repo/releases/download/*', async (request, context) => {
	const {user, repo, '*': wild} = context.params;
	if (forbidUser(user) || forbidRepo({user, repo})) {
		return reply(403);
	}

	const range = request.headers.get('content-range');
	const headers = new Headers();
	if (range !== null) {
		headers.set('content-range', range);
	}

	return fetch(
		`https://github.com/${user}/${repo}/releases/download/${wild}`,
		{
			redirect: 'follow',
			headers: range ? headers : undefined,
		},
	);
});

// GitHub uses this to prevent confusion between a tag named `latest` and the latest release
app.add('GET', '/:user/:repo/releases/latest/download/:artifact', async (request, context) => {
	const {user, repo, artifact} = context.params;
	if (forbidUser(user) || forbidRepo({user, repo})) {
		return reply(403);
	}

	const range = request.headers.get('content-range');
	const headers = new Headers();
	if (range !== null) {
		headers.set('content-range', range);
	}

	return fetch(
		`https://github.com/${user}/${repo}/releases/latest/download/${artifact}`,
		{
			redirect: 'follow',
			headers: range ? headers : undefined,
		},
	);
});

app.add('GET', '/:user/:repo/archive/*', async (_, context) => {
	const {user, repo, '*': wild} = context.params;
	if (forbidUser(user) || forbidRepo({user, repo})) {
		return reply(403);
	}

	let format: ArchiveFormat;
	if (wild.endsWith('.tar.gz')) {
		format = 'tar.gz';
	} else if (wild.endsWith('.zip')) {
		format = 'zip';
	} else {
		return reply(404, 'Not Found');
	}

	// eslint-disable-next-line no-bitwise
	const reference = wild.slice(0, ~format.length);

	return codeload(user, repo, format, reference);
});

app.add('GET', '/:user/:repo/zipball/*', async (_, context) => {
	const {user, repo, '*': reference} = context.params;
	if (forbidUser(user) || forbidRepo({user, repo})) {
		return reply(403);
	}

	return codeload(user, repo, 'legacy.zip', reference);
});

app.add('GET', '/:user/:repo/tarball/*', async (_, context) => {
	const {user, repo, '*': reference} = context.params;
	if (forbidUser(user) || forbidRepo({user, repo})) {
		return reply(403);
	}

	return codeload(user, repo, 'legacy.tar.gz', reference);
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
	}

	if (service !== 'git-upload-pack') {
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
	const encoding = request.headers.get('content-encoding');

	if (protocol) {
		headers.set('Git-Protocol', protocol);
	}

	if (type) {
		headers.set('Content-Type', type);
	}

	if (encoding) {
		headers.set('Content-Encoding', encoding);
	}

	return fetch(`https://github.com/${user}/${repo}/git-upload-pack`, {
		method: 'POST',
		body: request.body,
		headers,
	});
});

export default app;
