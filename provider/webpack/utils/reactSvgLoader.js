const Svgo = require('svgo')
const {transform} = require('babel-core')

const reactSvgPlugin = require('./reactSvgPlugin')

function optimizeSvg () {
  const svgo = new Svgo({
    plugins: [{
      removeDoctype: true,
      removeComments: true,
      removeTitle: true,
      removeXMLNS: true,
    }]
  })
  return function (content) {
    return new Promise((resolve, reject) =>
      svgo.optimize(content, ({error, data}) => error ? reject(error) : resolve(data))
    )
  }
}

function transformSvg () {
  return function (content) {
    return transform(content, {
      babelrc: false,
      plugins: ['syntax-jsx', reactSvgPlugin]
    })
  }
}

module.exports = function (content) {
  if (this.cacheable) {
    this.cacheable(true)
  }

  this.addDependency(this.resourcePath)

  let callback = this.async()

  Promise.resolve(String(content))
    .then(optimizeSvg())
    .then(transformSvg())
    .then(result => {
      callback(null, result.code)
    })
    .catch(err => {
      callback(err)
    })
}
