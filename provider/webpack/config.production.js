const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin')
const hash = require('../../utils/hash')
const path = require('path')
const webpack = require('webpack')

const webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./config.assets')())

module.exports = function productionConfig(options) {
  options = Object.assign({
    babel: require('babel-preset-frontful'),
    cache: false,
    entry: null,
    sourceMaps: false,
  }, options)

  const cwd = process.cwd()

  return {
    context: cwd,
    devtool: options.sourceMaps && 'source-map',
    stats: {
      children: false,
    },
    cache: options.cache,
    entry: options.entry,
    output: {
      path: path.resolve(cwd, 'build'),
      filename: `${hash()}.[name].js`,
      publicPath: '/assets/',
    },
    plugins: [
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
          IS_BROWSER: JSON.stringify(true),
        },
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          screw_ie8: true,
          warnings: false,
        },
        output: {
          comments: false,
          screw_ie8: true,
        },
        sourceMap: options.sourceMaps,
      }),
      webpackIsomorphicToolsPlugin,
    ],
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules\/(?!(frontful-.*)\/).*/,
          loader: 'babel-loader',
          query: options.babel,
        },
        {
          test: webpackIsomorphicToolsPlugin.regexp('img'),
          loader: 'url-loader?limit=1024',
        },
        {
          test: /\.json$/,
          loader: 'json-loader',
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx', '.json'],
      symlinks: false,
      modules: [
        cwd + '/node_modules',
        'node_modules',
      ],
    },
  }
}
