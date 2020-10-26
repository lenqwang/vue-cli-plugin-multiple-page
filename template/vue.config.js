const path = require('path')

module.exports = {
  outputDir: 'dist',

  assetsDir: '/',

  filenameHashing: false,

  // 是否使用包含运行时编译器的Vue核心的构建
  runtimeCompiler: true,

  // 默认情况下 babel-loader 忽略其中的所有文件 node_modules
  transpileDependencies: [],

  // 生产环境 sourceMap
  productionSourceMap: false,

  // webpack 配置，键值对象时会合并配置，为方法时会改写配置
  // 针对该项目，建议在 chainWebpack 字段中使用链式调用方式配置，不支持在字段进行 webpack 相关配置
  // 在自定义命令时，使用 vue-cli-service 提供的 resolveChainableWebpackConfig()进行配置重写后，该方法是通过new Config() 获得一个新的配置对象，忽略这个配置

  // webpack 链接 API，用于生成和修改 webapck 配置
  // https://github.com/mozilla-neutrino/webpack-chain
  chainWebpack: (config) => {
    config.externals({})

    // config.optimization.splitChunks({
    //   chunks: 'initial', // 必须三选一： "initial" | "all"(默认就是all) | "async",
    //   name: 'vendor'
    // })
    // config.optimization.runtimeChunk({
    //   name: 'manifest',
    // })
    // 设置别名
    config.resolve.alias
      .set('@', path.resolve(__dirname, 'src'))
  },

  // 配置高于chainWebpack中关于 css loader 的配置
  css: {
    // 是否开启支持 foo.module.css 样式
    requireModuleExtension: false,

    // 是否使用 css 分离插件 ExtractTextPlugin，采用独立样式文件载入，不采用 <style> 方式内联至 html 文件中
    extract: false,

    // 是否构建样式地图，false 将提高构建速度
    sourceMap: false
  }
}
