import path from 'path'

export default function serverRefresh(cacheIdPart) {
  cacheIdPart = cacheIdPart || path.resolve(process.cwd(), 'src')
  Object.keys(require.cache).forEach(function(cacheId) {
    if (cacheId.indexOf(cacheIdPart) !== -1 || cacheId.indexOf('/frontful-') !== -1) {
      delete require.cache[cacheId]
    }
  })
}
