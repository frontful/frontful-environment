const commonConfig = require('frontful-common/config')
const path = require('path')
const webpack = require('webpack')

module.exports = function provider(options) {
  options = Object.assign({
    babel: require('babel-preset-frontful/browser'),
    cache: true,
    index: './src/browser/index.js',
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
        options.index,
      ]
    },
    output: {
      path: path.resolve(cwd, './build/browser/assets/'),
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
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks(module) {
          return module.context && module.context.indexOf('node_modules') >= 0
        },
      }),
    ],
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: new RegExp(`node_modules/(?!(${commonConfig.packages.join('|')})/)`),
          loader: 'babel-loader',
          query: Object.assign({}, options.babel, {
            cacheDirectory: options.cache,
          }),
        },
        {
          test: /\.(png|jpe?g|gif|ico|svg)$/i,
          loader: 'url-loader?limit=1024',
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
