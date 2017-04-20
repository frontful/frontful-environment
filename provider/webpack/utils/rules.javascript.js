const commonConfig = require('frontful-common/config')

module.exports = function rules(options) {
  return [
    {
      test: /\.jsx?$/,
      exclude: new RegExp(`node_modules/(?!(${commonConfig.packages.join('|')})/)`),
      loader: 'babel-loader',
      query: Object.assign({}, options.babel, {
        cacheDirectory: options.cache,
      }),
    },
  ]
}
