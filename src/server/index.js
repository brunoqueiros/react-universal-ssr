import Express from 'express';
import paths from '../config/paths';

const app = Express();

app.use(`/public/assets/`, Express.static(paths.client.dist));

function clearRequireCache() {
  Object.keys(require.cache).forEach(function(key) {
    delete require.cache[key];
  });  
}

app.get('/*', (req, res, next) => {
  if (req.params[0] === '__webpack_hmr' || req.params[0].indexOf('hot-update.json') > -1) return next();

  const render = require(`${paths.server.dist}/app.js`).default;

  // delete require.cache[require.resolve('./render')];
  clearRequireCache();

  render(req, res)
  .then(response => {
    res.send(response);
  });
});

app.listen(3000);

if (process.env.NODE_ENV === 'development') {
  import('./dev-server')
  .then(devServer => devServer.default)
  .then(devServer => {
    devServer({ app });
  });
}
