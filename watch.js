const { resolveEntryConfig } = require('./utils/index')

module.exports = function resolveWatch (api, options, key, immediate) {
  return resolveEntryConfig('watch', key, { immediate, api, options })
}
