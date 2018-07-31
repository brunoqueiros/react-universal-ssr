import webpack from 'webpack';
import WebpackDevMiddleware from 'webpack-dev-middleware';
import webpackConfig from './webpack.config';

export default class WebpackRunner {
  constructor({ mode, isDev, publicPath, port }) {
    this.mode = mode;
    this.isDev = isDev;
    this.port = port;
    this.publicPath = publicPath;
    const configs = this.getConfigs();
    this.compiler = webpack(configs);
  }

  startDevMiddleware() {
    const middlewareConfig = {
      stats: 'errors-only',
      clientLogLevel: 'warning',
      watchOptions: { ignored: [ /(^|[\/\\])\../, /build/, /node_modules/ ] }
    };

    const webpackDevMiddleware = WebpackDevMiddleware(this.compiler, middlewareConfig);
    webpackDevMiddleware.waitUntilValid(() => {
      console.log('Package is in a valid state');
    });
  }

  startHotMiddleware() {
    return new Promise((resolve, reject) => {
      resolve(
        require('webpack-hot-middleware')(this.compiler, {
          log: console.log,
          path: '/__webpack_hmr',
          heartbeat: 10 * 1000
        })
      );
    })
  }

  getConfigs() {
    return [
      webpackConfig({
        mode: this.mode,
        app: this.appName,
        publicPath: this.publicPath,
        isServer: false,
        isDev: this.isDev,
        port: this.port
      }),

      webpackConfig({
        mode: this.mode,
        app: this.appName,
        publicPath: this.publicPath,
        isServer: true,
        isDev: this.isDev,
        port: this.port
      }),
    ].filter(Boolean);
  }
}
