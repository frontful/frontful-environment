const commonConfig = require('frontful-common/config')

module.exports = function rules(options) {
  return [
    // {
    //   enforce: 'pre',
    //   test: /\.jsx?.svg$/,
    //   loader: 'react-svg-loader',
    //   query: {
    //     jsx: false,
    //   },
    // },
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
