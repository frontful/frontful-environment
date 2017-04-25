const commonConfig = require('frontful-common/config')

module.exports = function rules(options) {
  return [
    {
      enforce: 'pre',
      test: /\.jsx?.svg$/,
      loader: require.resolve('./reactSvgLoader'),
    },
    {
      test: /\.jsx?(\.svg)?$/,
      exclude: new RegExp(`node_modules/(?!(${commonConfig.packages.join('|')})/)`),
      loader: 'babel-loader',
      query: Object.assign({}, options.babel, {
        cacheDirectory: options.cache,
      }),
    },
  ]
}
