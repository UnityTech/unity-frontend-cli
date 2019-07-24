#!/usr/bin/env node

const pkg = require('./package');
const chalk = require('chalk');
const _ = require('lodash');


pkgInfo();
process.argv.forEach(arg => {
  if (_.indexOf(process.argv, arg) !== 0 || _.indexOf(process.argv, arg) !== 1) {
    if (typeof arg === 'string') {
      if (arg === '--help') printHelp();
      if (arg === '--info') printEnv();
      if (arg === 'create-service') require('./create-service');
    }
  }
});

function pkgInfo() { 
  console.info(chalk.cyan(`
----------------------------------
${pkg.name} v${pkg.version}
----------------------------------
`));
}

function printHelp() {
  console.info(`Usage: web-cli <command>

where <command> is one of:
    create-service     generate a new service configuration in an empty repository
    
    web-cli --help     show a list of commands
    web-cli --env      list environment info`);
}

function printEnv() {
  console.info(`Environment info:

    cwd:    ${process.cwd()}
    __dir:  ${__dirname}

`);
}
