#!/usr/bin/env node
const { program } = require('commander')
const packageJson = require('../package.json')
const {name, version, description} = packageJson

const create = require('../lib/create')

program.name(name)
       .description(description)
       .version(version)

program
  .command('create')
  .description('创建项目')
  .argument('[template]', '模板名称', 'cmp')
  .action((template, appName) => {
    create(template, appName)
  })

program.parse()
