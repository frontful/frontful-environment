module.exports = function() {
  return [
    {
      test: /(\.(png|jpe?g|gif|ico)$)|(^((?!\.jsx?).)*\.svg$)/i,
      loader: 'url-loader?limit=1024',
    },
    {
      test: /\.json$/,
      loader: 'json-loader',
    },
  ]
}
