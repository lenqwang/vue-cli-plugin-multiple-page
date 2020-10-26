const { resolveEntryConfig } = require('./utils/index')

module.exports = function resolveBuild (api, options, key, immediate) {
  return resolveEntryConfig('build', key, { immediate, api, options })
}
