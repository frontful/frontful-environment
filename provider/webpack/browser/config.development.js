const path = require('path')
const webpack = require('webpack')

module.exports = function provider(options) {
  options = Object.assign({
    babel: require('babel-preset-frontful/browser'),
    cache: true,
    script: './src/browser/index.js',
    sourceMaps: true,
  }, options)

  const cwd = process.cwd()

  return {
    cache: options.cache,
    context: cwd,
    devtool: options.sourceMaps && 'eval-source-map',
    target: 'web',
    stats: {
      children: false,
    },
    performance: {
      hints: false,
    },
    entry: {
      main: [
        require.resolve('../../../utils/coldreload/browser.js'),
        options.script,
      ]
    },
    output: {
      path: path.resolve(cwd, 'build/browser'),
      filename: `[name].js`,
      publicPath: '/assets/',
    },
    plugins: [
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
          IS_BROWSER: JSON.stringify(true),
        },
      }),
    ],
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules\/(?!(frontful-.*)\/).*/,
          loader: 'babel-loader',
          query: Object.assign({}, options.babel, {
            cacheDirectory: options.cache,
          }),
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
      mainFields: ['jsnext:main', 'browser', 'main'],
      symlinks: false,
      modules: [
        cwd + '/node_modules',
        'node_modules',
      ],
    },
  }
}
