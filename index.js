const resolveWatch = require('./watch')
const resolveBuild = require('./build')
const print = require('./utils/print')
const initVueConfig = require('./utils/initVueConfig')

module.exports = (api, options) => {
  api.registerCommand('init-config', {
    description: 'generate `vue.config.js`、`Views.json` file to your project',
    usage: 'vue-cli-service init-config'
  }, () => {
    initVueConfig()
  })

  api.registerCommand('build-multi', {
    description: 'build for multipage',
    usage: 'vue-cli-service build-multi',
    options: {
      '--key': 'specify a key to build entry',
      '--inspect': 'output <filename> the final webpack config'
    }
  },
  (args) => {
    const { key, inspect } = args
    const immediate = typeof inspect === 'undefined' && !inspect
    const config = resolveBuild(api, options, key, immediate)

    if (!immediate) {
      const outputFileName = typeof inspect === 'boolean' ? undefined : inspect
      print(config, outputFileName)
    }
  })

  api.registerCommand('watch-multi', {
    description: 'watch for multipage',
    usage: 'vue-cli-service watch-multi',
    options: {
      '--key': 'specify a key to build entry',
      '--inspect': 'output <filename> the final webpack config'
    }
  },
  (args) => {
    const { key, inspect } = args
    const immediate = typeof inspect === 'undefined' && !inspect
    const config = resolveWatch(api, options, key, immediate)

    if (!immediate) {
      const outputFileName = typeof inspect === 'boolean' ? undefined : inspect
      print(config, outputFileName)
    }
  })
}
