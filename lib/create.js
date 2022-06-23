const inquirer = require('inquirer')
const chalk = require('chalk')
const fs = require('fs')
const templateInfo = require('./template')
const ora = require('ora')

const download = require('download-git-repo')
let templateName = 'cmp'

function getQuestions(projectName) {
  const questions = [
    {
      name: 'projectName',
      type: 'input',
      message: `项目名${projectName ? `(${projectName})?` : ''}`,
      validate(val) {
        if (val === '') {
          return '项目名不能未空'
        } else {
          return true
        }
      }
    },
    {
      name: 'description',
      type: 'input',
      message: '项目描述',
      validate(val) {
        if (val == '') {
          return '简单介绍一下项目吧'
        } else {
          return true
        }
      }
    }
  ]
  return questions
}

function onReady(answers = {}) {
  console.log('answers:', answers);
  const { projectName, description } = answers
  const url = templateInfo[templateName]

  const spinner = ora('downloading template...')

  download(url, projectName, err => {
    if (err) {
      spinner.fail('download template fail')
      console.log(chalk.red(`创建项目失败. ${err}`));
      return
    }

    updatePackageJson(projectName, description)

    spinner.succeed()

    console.log(chalk.green('创建项目成功!'));
    console.log(`\n 请切换到 ${projectName} 执行 npm install，安装依赖`);
  })
}

function updatePackageJson(projectName, description) {
  const jsonFile = `./${projectName}/package.json`
  const json = require(jsonFile)
  json.name = projectName
  json.description = description
  fs.writeFileSync(jsonFile, JSON.stringify(json, null, '\t'), 'utf-8')
}

function main(projectName) {
  const questions = getQuestions(projectName)
  inquirer.prompt(questions).then(onReady)
}

module.exports = function(...options) {
  console.log('init called...', ...options);
  
  if (options.templateName) {
    templateName = options.templateName
  }

  main()
}