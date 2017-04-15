const path = require('path')
const webpack = require('webpack')

module.exports = function provider(options) {
  options = Object.assign({
    babel: require('babel-preset-frontful/browser'),
    cache: false,
    script: './src/browser/index.js',
    sourceMaps: false,
  }, options)

  const cwd = process.cwd()

  return {
    cache: options.cache,
    context: cwd,
    devtool: options.sourceMaps && 'source-map',
    target: 'web',
    stats: {
      children: false,
    },
    performance: {
      hints: false,
    },
    entry: {
      main: [options.script]
    },
    output: {
      path: path.resolve(cwd, 'build/browser'),
      filename: `[name].js`,
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
          test: /\.(png|jpe?g|gif|ico|svg)$/i,
          loader: 'url-loader?limit=10240',
        },
        {
          test: /\.json$/,
          loader: 'json-loader',
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      symlinks: false,
      modules: [
        cwd + '/node_modules',
        'node_modules',
      ],
    },
  }
}
