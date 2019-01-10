const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const findWorkspaceRoot = require('find-yarn-workspace-root')
const hash = require('../utils/hash')
const path = require('path')
const rulesAssets = require('../utils/rules.assets')
const rulesJavascript = require('../utils/rules.javascript')
const rulesStyles = require('../utils/rules.styles')
const webpack = require('webpack')

module.exports = function provider(options) {
  options = Object.assign({
    babel: require('babel-preset-frontful/browser'),
    cache: true,
    index: './src/browser/index.js',
    sourceMaps: true,
  }, options)

  const cwd = process.cwd()
  const workspaceRoot = findWorkspaceRoot(cwd)
  const workspaceNodeModules = workspaceRoot ? `${workspaceRoot}/node_modules` : undefined

  return {
    mode: 'development',
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
      filename: `${hash}.[name].js`,
      publicPath: '/assets/',
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            chunks: 'initial',
            name: 'vendor',
            enforce: true,
            test(module) {
              return module.context && module.context.indexOf('node_modules') >= 0
            },
          },
        },
      },
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: `${hash}.[name].css`,
      }),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
          IS_BROWSER: JSON.stringify(true),
        },
      }),
      new webpack.LoaderOptionsPlugin({
        options: {
          postcss: function() {
            return [
              require('autoprefixer')({
                browsers: 'last 4 version'
              }),
            ]
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
          browser: true
        })
      ),
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      mainFields: ['jsnext:main', 'browser', 'main'],
      symlinks: true,
      modules: [
        workspaceNodeModules || (cwd + '/node_modules'),
        'node_modules',
      ],
    },
  }
}
