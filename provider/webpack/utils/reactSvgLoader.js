const Svgo = require('svgo')
const reactSvgPlugin = require('./reactSvgPlugin')
const {transform} = require('babel-core')

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
    return svgo.optimize(content).then((result) => result.data)
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
