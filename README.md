# vue-cli-plugin-multiple-page

> build/watch multiple page one time for vue-cli

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

The final result of above configuration will be generates:

- entry: [`yourProject/resources/assets/js/views/page/index.js`, `yourProject/resources/assets/js/views/page1/index.js`]
- output: [`yourProject/public/js/v/page-index/index.js`, `yourProject/public/js/v/page1-index/index.js`]

### watch-multi

The command like `build-multi`, but it in watch mode

## Custom Config

This plugin provide custom config file that you can specify entries manually in Programmatically. You can create a file named `multiple-page.config.js`, that content like below:

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

## TODO

- [] test cases