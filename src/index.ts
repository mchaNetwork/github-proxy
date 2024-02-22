import {Router} from 'worktop';
import routes, {bind} from './routes';

const app = new Router<Bindings>();

app.mount('/https:/', routes);
app.mount('/http:/', routes);
bind(app);

app.add('GET', /(?:)/, async (request, context) => {
	console.log(request.url);
	return context.bindings.ASSETS.fetch(request);
});

export default app;
