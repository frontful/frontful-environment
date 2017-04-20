const nodeExternals = require('webpack-node-externals')
const path = require('path')
const rulesAssets = require('../utils/rules.assets')
const rulesJavascript = require('../utils/rules.javascript')
const rulesStyles = require('../utils/rules.styles')
const webpack = require('webpack')

module.exports = function provider(options) {
  options = Object.assign({
    babel: require('babel-preset-frontful/server'),
    cache: false,
    index: './src/server/index.js',
    sourceMaps: true,
  }, options)

  const cwd = process.cwd()

  return {
    cache: options.cache,
    context: cwd,
    devtool: options.sourceMaps && 'source-map',
    externals: [nodeExternals()],
    target: 'node',
    stats: {
      children: false,
    },
    performance: {
      hints: false,
    },
    entry: {
      server: [
        require.resolve('../../../utils/coldreload/server.js'),
        options.index,
      ],
    },
    output: {
      path: path.resolve(cwd, './build/browser/assets/'),
      filename: `../../server/[name].js`,
      publicPath: '/assets/',
      libraryTarget: "commonjs-module",
    },
    plugins: [
      new webpack.BannerPlugin({
        banner: `require('source-map-support').install();`,
        raw: true,
        entryOnly: false,
      }),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        },
      }),
      new webpack.LoaderOptionsPlugin({
        options: {
          postcss: function() {
            return []
          },
        },
      }),
    ],
    module: {
      rules: [].concat(
        rulesJavascript({
          babel: options.babel,
          cache: options.cache,
        }),
        rulesAssets(),
        rulesStyles({
          browser: false
        })
      ),
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
