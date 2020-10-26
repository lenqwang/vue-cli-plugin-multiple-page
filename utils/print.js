const path = require('path')
const fs = require('fs')
const { highlight } = require('cli-highlight')
const webpackChain = require('webpack-chain')
const resolve = (name) => path.resolve(process.cwd(), name)
const toString = webpackChain.toString

module.exports = function printWebpackConfig (webpackConfig, outputFileName = 'webpack.inspect.config.js') {
  // const webpackConfig = chainWebpackConfig.toConfig()
  const output = toString(webpackConfig, { verbose: true })

  console.log(highlight(output, { language: 'js' }))
  fs.writeFileSync(resolve(outputFileName), output, 'utf8')
}

// function printWebpackConfig2 (chainWebpackConfig) {
//   const webpackConfig = chainWebpackConfig.toConfig()
//   const output = toString(webpackConfig, { verbose: true })

//   console.log(highlight(output, { language: 'js' }))
//   fs.writeFileSync(resolve('webpack.config.js'), output, 'utf8')
// }
