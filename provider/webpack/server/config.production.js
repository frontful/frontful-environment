const nodeExternals = require('webpack-node-externals')
const path = require('path')
const webpack = require('webpack')

module.exports = function provider(options) {
  options = Object.assign({
    babel: require('babel-preset-frontful/server'),
    cache: false,
    script: './src/server/index.js',
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
        options.script,
      ],
    },
    output: {
      path: path.resolve(cwd, 'build/browser'),
      filename: `../server/[name].js`,
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
