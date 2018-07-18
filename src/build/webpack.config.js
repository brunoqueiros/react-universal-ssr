import webpack from 'webpack';
import WriteFilePlugin from 'write-file-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import ManifestPlugin from 'webpack-manifest-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import WebpackBar from 'webpackbar';
import paths from '../config/paths';

export default ({ mode, isServer, isDev, publicPath, port }) => ({
  mode,

  target: isServer ? 'node' : 'web',

  entry: [
    !isServer && isDev && `webpack-hot-middleware/client?path=http://localhost:${port}/__webpack_hmr`,
    !isDev && 'babel-polyfill',
    isServer ? `${paths.server.src}/render.js` : `${paths.client.src}/index.js`
  ].filter(Boolean),

  output: {
    filename: isServer ? 'app.js' : 'js/main.[hash:8].js',
    path: isServer ? paths.server.dist : paths.client.dist,
    publicPath: `/${publicPath}/`,
    libraryTarget: isServer ? 'commonjs2' : 'var'
  },

  node: {
    __dirname: isServer
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [
          (!isServer && isDev) && 'css-hot-loader',
          !isServer && MiniCssExtractPlugin.loader,
          'css-loader'
        ].filter(Boolean)
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin('.dist', {
      root: isServer ? paths.server.src : paths.client.src,
      verbose: false
    }),

    !isServer && new MiniCssExtractPlugin({
      filename: '[name].css',
      disable: false,
      allChunks: true
    }),

    isDev && new WriteFilePlugin({ force: true, log: true }),

    isDev && !isServer && new webpack.HotModuleReplacementPlugin(),

    !isServer && new ManifestPlugin(),

    new WebpackBar({
      name: isServer ? 'server' : 'client'
    })
  ].filter(Boolean),

  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  }
});
