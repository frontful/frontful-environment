const commonConfig = require('frontful-common/config')
const findWorkspaceRoot = require('find-yarn-workspace-root')
const nodeExternals = require('webpack-node-externals')
const path = require('path')
const rulesAssets = require('../utils/rules.assets')
const rulesJavascript = require('../utils/rules.javascript')
const rulesStyles = require('../utils/rules.styles')
const webpack = require('webpack')

module.exports = function provider(options) {
  options = Object.assign({
    babel: require('babel-preset-frontful/server'),
    cache: true,
    index: './src/server/index.js',
    sourceMaps: true,
  }, options)

  const cwd = process.cwd()

  return {
    mode: 'development',
    cache: options.cache,
    context: cwd,
    devtool: options.sourceMaps && 'source-map',
    externals: [nodeExternals({
      modulesDir: `${findWorkspaceRoot(cwd)}/node_modules` || undefined,
      includeAbsolutePaths: true,
      whitelist: (module) => {
        return commonConfig.packages.find((name) => module.includes(name))
      },
    })],
    target: 'node',
    stats: {
      children: false,
    },
    performance: {
      hints: false,
    },
    entry: {
      server: [
        options.index,
      ],
    },
    output: {
      path: path.resolve(cwd, './build/browser/assets/'),
      filename: `../../server/[name].js`,
      publicPath: '/assets/',
      libraryTarget: 'commonjs-module',
      devtoolModuleFilenameTemplate: `${cwd}/[resource-path]`,
    },
    plugins: [
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
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
      symlinks: true,
      modules: [
        cwd + '/node_modules',
        'node_modules',
      ],
      alias: commonConfig.alias,
    },
  }
}
