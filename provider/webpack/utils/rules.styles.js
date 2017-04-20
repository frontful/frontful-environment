const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = function(options) {
  return [
    {
      test: new RegExp(`^((?!\\.module).)*\\.css$`),
      loader: options.browser ? ExtractTextPlugin.extract({
        use: `css-loader!postcss-loader`
      }) : 'null-loader',
    },
    {
      test: new RegExp(`^((?!\\.module).)*\\.pcss$`),
      loader: options.browser ? ExtractTextPlugin.extract({
        use: `css-loader!postcss-loader?parser=postcss-scss`
      }) : 'null-loader',
    },
    {
      test: new RegExp(`^((?!\\.module).)*\\.scss$`),
      loader: options.browser ? ExtractTextPlugin.extract({
        use: `css-loader!postcss-loader!sass-loader`
      }) : 'null-loader',
    },
    {
      test: new RegExp(`^((?!\\.module).)*\\.sass$`),
      loader: options.browser ? ExtractTextPlugin.extract({
        use: `css-loader!postcss-loader!sass-loader?indentedSyntax`
      }) : 'null-loader',
    },
    {
      test: new RegExp(`\\.module\\.css$`),
      loader: options.browser ? ExtractTextPlugin.extract({
        use: `css-loader?-autoprefixer&modules&minimize=false&context=${process.cwd()}&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]!postcss-loader`
      }) : `${require.resolve('./extractCssModuleMappingLoader.js')}!css-loader?-autoprefixer&modules&minimize=false&context=${process.cwd()}&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]!postcss-loader`,
    },
    {
      test: new RegExp(`\\.module\\.pcss$`),
      loader: options.browser ? ExtractTextPlugin.extract({
        use: `css-loader?-autoprefixer&modules&minimize=false&context=${process.cwd()}&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]!postcss-loader?parser=postcss-scss`
      }) : `${require.resolve('./extractCssModuleMappingLoader.js')}!css-loader?-autoprefixer&modules&minimize=false&context=${process.cwd()}&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]!postcss-loader?parser=postcss-scss`,
    },
    {
      test: new RegExp(`\\.module\\.scss$`),
      loader: options.browser ? ExtractTextPlugin.extract({
        use: `css-loader?-autoprefixer&modules&minimize=false&context=${process.cwd()}&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]!postcss-loader!sass-loader`
      }) : `${require.resolve('./extractCssModuleMappingLoader.js')}!css-loader?-autoprefixer&modules&minimize=false&context=${process.cwd()}&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]!postcss-loader!sass-loader`,
    },
    {
      test: new RegExp(`\\.module\\.sass$`),
      loader: options.browser ? ExtractTextPlugin.extract({
        use: `css-loader?-autoprefixer&modules&minimize=false&context=${process.cwd()}&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]!postcss-loader!sass-loader?indentedSyntax`
      }) : `${require.resolve('./extractCssModuleMappingLoader.js')}!css-loader?-autoprefixer&modules&minimize=false&context=${process.cwd()}&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]!postcss-loader!sass-loader?indentedSyntax`,
    },
  ]
}
