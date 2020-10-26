const { join } = require('path')
const { writeFileSync, readFileSync, existsSync } = require('fs')
const prompts = require('prompts')
const chalk = require('chalk')

module.exports = initConfigurate

async function initConfigurate () {
  await writeFileWithPrompt('Views.json')
  await writeFileWithPrompt('vue.config.js')
}

async function writeFileWithPrompt (name) {
  if (checkRootFileExists(name)) {
    const response = await prompts({
      type: 'confirm',
      name: 'override',
      message: `是否覆盖文件: ${name}`
    })

    if (response.override) {
      write(name)
    }
  } else {
    write(name)
  }
}

function write (name) {
  const filePath = join(__dirname, '../template', name)
  const outpuFilePath = join(process.cwd(), name)
  const fileContent = readFileSync(filePath)

  writeFileSync(outpuFilePath, fileContent, 'utf8')
  console.log(chalk.green(`created ${name}!`))
}

function checkRootFileExists (name) {
  const filePath = join(process.cwd(), name)
  return existsSync(filePath)
}
