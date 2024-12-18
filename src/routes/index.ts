import {Router} from 'worktop';
import codeload from './codeload.github.com';
import gist from './gist.githubusercontent.com';
import github from './github.com';
import raw from './raw.githubusercontent.com';

export const bind = (app: Router<Bindings>) => {
	app.mount('/github.com/', github);
	app.mount('/codeload.github.com/', codeload);
	app.mount('/raw.githubusercontent.com/', raw);
	app.mount('/gist.githubusercontent.com/', gist);
};

const app = new Router<Bindings>();

bind(app);

export default app;
