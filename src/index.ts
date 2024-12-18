import {Router} from 'worktop';
import routes, {bind} from './routes';

const app = new Router<Bindings>();

app.mount('/https:/', routes);
app.mount('/http:/', routes);
bind(app);

// eslint-disable-next-line regexp/no-empty-group
app.add('GET', /(?:)/, async (request, context) => context.bindings.ASSETS.fetch(request));

export default app;
