import WebpackRunner from './webpack-runner';

const webpackRunnerInstance = new WebpackRunner({
  mode: 'production',
  isDev: false,
  publicPath: 'public/assets',
  appName: 'msp'
});

webpackRunnerInstance.compiler.run((err, stats) => {
  if (err) console.error(err);

  console.log('Done');
});