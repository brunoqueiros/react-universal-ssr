import webpack from 'webpack';
import WriteFilePlugin from 'write-file-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import ManifestPlugin from 'webpack-manifest-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import WebpackBar from 'webpackbar';
import nodeExternals from 'webpack-node-externals';
import paths from '../config/paths';

export default ({ mode, isServer, isDev, publicPath, port }) => {
  const result = {
    mode,

    target: isServer ? 'node' : 'web',

    bail: true,

    entry: {
      main: [
        !isServer && isDev && `webpack-hot-middleware/client?path=http://localhost:${port}/__webpack_hmr`,
        !isDev && 'babel-polyfill',
        isServer ? `${paths.server.src}/render.js` : `${paths.client.src}/index.js`
      ].filter(Boolean)
    },

    output: {
      filename: isServer ? 'app.js' : 'js/[name].[hash].js',
      chunkFilename: 'js/[name].[chunkhash].js',
      path: isServer ? paths.server.dist : paths.client.dist,
      publicPath: `/${publicPath}/`,
      libraryTarget: isServer ? 'commonjs2' : 'var'
    },

    node: {
      __dirname: isServer
    },

    externals: [
      isServer && nodeExternals()
    ].filter(Boolean),

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

      new webpack.HashedModuleIdsPlugin(),

      !isServer && new MiniCssExtractPlugin({
        filename: 'css/[name].css',
        disable: false,
        allChunks: true
      }),

      isDev && new WriteFilePlugin({ force: true, log: true }),

      isDev && !isServer && new webpack.HotModuleReplacementPlugin(),

      !isServer && new ManifestPlugin(),

      new WebpackBar({
        name: isServer ? 'server' : 'client'
      })
    ].filter(Boolean)
  };

  result.optimization = {};

  if (!isDev) {
    result.optimization.minimizer = [
      new UglifyJsPlugin({
        cache: true,
        parallel: true
      }),
      new OptimizeCSSAssetsPlugin({})
    ];
  }

  if (!isServer) {
    result.optimization.runtimeChunk = true;
    result.optimization.splitChunks = {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          name: 'vendor',
          chunks: 'all',
          enforce: true
        }
      }
    };
  }

  return result;
};
