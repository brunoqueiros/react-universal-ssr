import WebpackRunner from '../build/webpack-runner';
import paths from '../config/paths';

export default ({ app }) => {
  const webpackRunnerInstance = new WebpackRunner({
    mode: 'development',
    isDev: true,
    publicPath: paths.publicPath,
    port: 3000
  });

  webpackRunnerInstance.startHotMiddleware()
  .then(hotMiddleware => {
    app.use(hotMiddleware);
  });
  webpackRunnerInstance.startDevMiddleware();
};
