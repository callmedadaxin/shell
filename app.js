#! /usr/bin/env node

var program = require('commander')
var inquirer = require('inquirer')
var chalk = require('chalk')
var _ = require('lodash')
var clone = require('git-clone')
var rm = require("rimraf").sync;
var ora = require('ora');
var shell = require('shelljs');
require('shelljs/global');

var cfg = [{
  name: '1.0',
  value: 'https://git.imoxiu.cn/web_fe/vue1.0-template.git'
}, {
  name: '2.0',
  value: 'https://git.imoxiu.cn/web_fe/vue2.0-template.git'
}]

program
  .command('template') //定义指令 
  .alias('t') //定义简写
  .description('下载模板') //描述，在help里显示
  .option('-v, --version [moduleName]', '模板版本')
  .option('-n, --name [fileName]', '模板输出名称')
  .action(option => {
    var config = _.assign({
      version: null,
      name: null
    }, option);
    var promps = [];

    if (!config.version) {
      promps.push({
        type: 'list',
        name: 'version',
        message: '请选择模板的版本',
        choices: cfg
      });
    } else {
      config.version = getUrl(config.version);
    }

    if (!config.name) {
      promps.push({
        type: 'input',
        name: 'name',
        message: '请填写名称'
      });
    }

    inquirer.prompt(promps).then(function(answers) {
      var result = _.assign(config, answers);

      if (!result.name) {
        result.name = 'default';
      }

      var filePath = './' + result.name;
      var spinner = ora('开始下载')
      spinner.start()

      clone(result.version, filePath, function(err) {
        spinner.stop()
        if (err) {
          console.log('目录已存在！');
        } else {
          rm(filePath + '/.git');
          console.log('下载完成');
          console.log('cnpm install');
          cd(config.name);
          shell.exec('cnpm install');
        }
      })
    })
  }).on('--help', function() {
    console.log(' Examples:');
    console.log('');
    console.log('$ fe t');
    console.log('or');
    console.log('$ fe t -v 1 -n template');
  });

program.parse(process.argv);

function getUrl(version) {
  if (version == 1) {
    return 'https://git.imoxiu.cn/web_fe/vue1.0-template.git';
  } else {
    return 'https://git.imoxiu.cn/web_fe/vue2.0-template.git';
  }
}