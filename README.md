# vue-cli-plugin-multiple-page

> A plugin that bundle multiple page based-on vue-cli. Unlike `vue-cli's pages` configuration, it's handled by sharding multiple pages into different webpack configurations 

## Usage

Install the plugin in your project created by vue-cli, if not please refer to [Not Vue-CLI created Project](#not-vue-cli-created-project)

``` sh
vue add multiple-page
```

## Commands

Here are 3 commands for this plugin:

1. `init-config`: initialize `vue.config.js` & `Views.json` two files to your project
2. `build-multi`: build multiple page in parallel
3. `watch-multi`: watch multiple page in parallel

You can use `vue-cli-service [command]` in your project

### init-config

The command will be generates `vue.config.js`、`Views.json` files if your project haven't corresponding files

- [vue.config.js](./template/vue.config.js)
- [Views.json](./template/Views.json)

### build-multi

The command will be build you entries where above generated configurations
, and you can specify the entry by pass `--key` option, e.g:

``` sh
vue-cli-service build-multi --key page,page1 # build page,page1 two entries
```

`Views.json`:

``` json
{
  "basePath": "resources/assets/js/views",
  "destBasePath": "public/js/v",
  "entry": {
    "page": {
      "srcPath": "page",
      "name": "index",
      "output": "page-index",
      "description": "test page"
    },
    "page1": {
      "srcPath": "page1",
      "name": "index",
      "output": "page1-index",
      "description": "test page1"
    }
  }
}
```

The configuration file above will generates the following corresponding paths:

- entry: [`yourProject/resources/assets/js/views/page/index.js`, `yourProject/resources/assets/js/views/page1/index.js`]
- output: [`yourProject/public/js/v/page-index/index.js`, `yourProject/public/js/v/page1-index/index.js`]

### watch-multi

This command, like the `vue-cli-service watch` command, It listens for changes to the entry file of configuration by passing the specified `--key` to bundle (in `watch` mode)

## Customize Configuration

The plugin provides the ability to customize the configuration so that you can programmatically expose the configuration of multiple pages by creating a file called `multiple-page.config.js`:

``` js
const path = require('path')
const resolve = name => path.resolve(__dirname, name)
const basePath = resolve('resources/assets/js/views')
const outputPath = resolve('public/js/v')

module.exports = {
  page: {
    entry: path.join(basePath, 'page/index.js'),
    output: path.join(outputPath, 'page-index'),
    description: 'test page',
    extract: true,
    chunkName: 'index'
  },
  page1: {
    entry: path.join(basePath, 'page1/index.js'),
    output: path.join(outputPath, 'page1-index'),
    description: 'test page1',
    chunkName: 'index'
  }
}
```

If you have both files (`Views.json`、`multiple-page.config.js`) in your root directory, The `multiple-page.config.js` file have a higher priority.

## Not Vue-CLI created Project

If your project is not created by vue-cli. please refer to the following steps. (This scenario is suitable for older, multiple-page projects that are rendered primarily by backend template engines)

`step1`: Installing these dependencies in your project if you haven't installed them

``` sh
yarn add @vue/cli-service vue-template-compiler --dev
yarn add vue
```

`step2`: Add the following script commands to your `package.json` file:

``` json
{
  "scripts": {
    "init:config": "vue-cli-service init-config",
    "watch": "vue-cli-service watch-multi",
    "build": "vue-cli-service build-multi"
  }
}
```

`step3`: Add this plugin to your project

``` sh
vue add multiple-page
```

Finally Enjoy the same features as vue-cli

## TODO

- [] test cases