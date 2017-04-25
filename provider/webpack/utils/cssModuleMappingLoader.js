module.exports = function cssModuleMappingLoader(content) {
  this.cacheable()
  return `
    module.exports = {
      ${/exports\.locals.+?\{((.|\n|\r)*)\}/gim.exec(content)[1]}
    }
  `
}
