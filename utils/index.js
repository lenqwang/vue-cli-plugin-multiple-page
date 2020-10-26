const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const { cosmiconfig } = require('cosmiconfig')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const splitRe = /,/
const CONFIG_NAME = 'Views.json'
const CUSTOM_CONFIG_NAME = 'multiple-page'

function getEntryConfig (config, key) {
  const entryKeys = Object.keys(config)
  const allEntryConfig = entryKeys.map(entryKey => {
    const { entry, output, description, chunkName, extract } = config[entryKey] || {}

    return {
      key: entryKey,
      extract,
      entry,
      output,
      description,
      chunkName
    }
  })

  // 判断用户传入的 key 是否有效
  if (splitRe.test(key)) {
    return allEntryConfig.filter(ety => key.split(splitRe).indexOf(ety.key) > -1)
  } else {
    if (entryKeys.indexOf(key) > -1) {
      return allEntryConfig.filter(ety => ety.key === key)
    } else if (key === 'all') {
      return allEntryConfig
    } else {
      return []
    }
  }
}

function normalizedConfig (entryFileJsonPath) {
  const entryConfig = require(entryFileJsonPath)
  const { entry: entries, basePath, destBasePath } = entryConfig
  const entryKeys = Object.keys(entries)

  return entryKeys.reduce((obj, key) => {
    const currentEntry = entries[key]
    // 设置当前页面对应 webpack 配置的 entry
    const currentEntryFilePath = path.join(basePath, currentEntry.srcPath, currentEntry.name + '.js')
    const entry = path.resolve(process.cwd(), currentEntryFilePath)
    const outputFilePath = path.join(destBasePath, currentEntry.srcPath)
    const output = path.resolve(process.cwd(), outputFilePath)

    obj[key] = {
      entry,
      output,
      extract: currentEntry.extract,
      description: currentEntry.description,
      chunkName: currentEntry.name
    }

    return obj
  }, {})
}

async function getEntryFiles (key) {
  const explorer = cosmiconfig(CUSTOM_CONFIG_NAME)
  const entryFileJsonPath = process.env.VIEW_JSON || path.resolve(process.cwd(), CONFIG_NAME)
  const result = await explorer.search()
  let entryConfigs = []

  // 命令行没有传入 key 时直接退出操作
  if (!key || !key.toString().trim()) {
    console.log(chalk.red('输入的key为空'))
    process.exit(1)
  }

  if (result && !result.isEmpty && result.config) {
    entryConfigs = getEntryConfig(result.config, key)
  } else if (entryFileJsonPath) {
    const config = normalizedConfig(entryFileJsonPath, key)
    entryConfigs = getEntryConfig(config, key)
  } else {
    console.log(chalk.red(`找不到配置文件, 请指定 \`${CUSTOM_CONFIG_NAME}.config.js\` 或 \`View.json\` 文件进行配置`))
    process.exit(1)
  }

  return entryConfigs
}

// [{ entry: '', output: '', description: '', chunkName: '' }, {  }]
async function resolveEntryConfig (mode, key, { immediate = true, api, options }) {
  const entryConfigs = await getEntryFiles(key)
  const entryWebpackConfigs = []
  const entryDescriptions = new Set()

  if (Array.isArray(entryConfigs) && !entryConfigs.length) {
    console.log(chalk.yellow('请指定正确的 key !'))
    process.exit(1)
  }

  entryConfigs.forEach(entryConfig => {
    // override vue's original configuration
    options.css.extract = Boolean(entryConfig.extract)
    const webpackConfigChain = api.resolveChainableWebpackConfig()

    pruneDefaultWebpackConfig(webpackConfigChain)

    if (mode === 'build') {
      // 设置 mode 为 production
      webpackConfigChain.mode('production')
      // 关闭 watch 模式
      webpackConfigChain.watch(false)

      webpackConfigChain
        .plugin('optimize-css')
        .use(OptimizeCSSAssetsPlugin)
    }

    if (mode === 'watch') {
      // 是否开启watch模式
      webpackConfigChain.watch(true)
    }
    // set entry config
    webpackConfigChain
      .entry(entryConfig.chunkName)
      .add(entryConfig.entry)

    // set output config
    webpackConfigChain
      .output
      .path(entryConfig.output)
      .filename('[name].js')
      .chunkFilename('[name].js')

    // clean dist path
    webpackConfigChain
      .plugin('clean')
      .use(CleanWebpackPlugin)

    // save per entry file webpack config
    entryWebpackConfigs.push(webpackConfigChain.toConfig())
    entryDescriptions.add(entryConfig.description)

    // clean entry config & dist config
    webpackConfigChain.entryPoints.store.delete(entryConfig.output)
    webpackConfigChain.output.clear()
  })

  if (entryDescriptions.size) {
    [...entryDescriptions].forEach(description => {
      console.log(chalk.green(description))
    })
  }

  if (immediate) {
    webpack(entryWebpackConfigs, (err, stats) => {
      if (err || stats.hasErrors()) {
        console.log(chalk.red('webpack build error!'))
        // process.exit(1)
      }
    })
  }

  return entryWebpackConfigs
}

function pruneDefaultWebpackConfig (webpackConfigChain) {
  // 删除默认入口
  webpackConfigChain.entryPoints.store.delete('app')
  // 删除 copy-webpack-plugin 插件,避免打包时将 public 文件夹打包到输出路径
  webpackConfigChain.plugins.delete('copy')
  // 删除 html-webpack-plugin 插件
  webpackConfigChain.plugins.delete('html')
  // 删除热加载插件
  webpackConfigChain.plugins.delete('hmr')
  // 删除 preload 和 prefetch 插件
  webpackConfigChain.plugins.delete('preload')
  webpackConfigChain.plugins.delete('prefetch')
  // 禁止任何异步加载的 chunk
  webpackConfigChain
    .plugin('LimitChunkCountPlugin')
    .use(webpack.optimize.LimitChunkCountPlugin, [{
      maxChunks: 1
    }])
}

module.exports = {
  getEntryFiles,
  resolveEntryConfig,
  pruneDefaultWebpackConfig
}
