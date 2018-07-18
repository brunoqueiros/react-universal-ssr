import WebpackRunner from '../build/webpack-runner';

export default ({ app }) => {
  const webpackRunnerInstance = new WebpackRunner({
    mode: 'development',
    appName: 'msp',
    isDev: true,
    publicPath: 'public/assets',
    port: 3000
  });

  webpackRunnerInstance.startHotMiddleware()
  .then(hotMiddleware => {
    app.use(hotMiddleware);
  });
  webpackRunnerInstance.startDevMiddleware();
};
