#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const templatePackage = require('./template_package');
const prompt = require('./prompt');
const sh = require('shelljs');
const npm = require('./npm');
const pkg = require('../package');
const chalk = require('chalk');


pkgInfo();
start();

function pkgInfo() { 
  console.info(chalk.cyan(`
----------------------------------
${pkg.name} v${pkg.version}
----------------------------------
`));
}

async function start() {
  const packagePath = path.resolve(process.cwd(), 'package.json');
  let doContinue;

  if (!fs.existsSync(packagePath)) {
    const response = await prompt.packagePrompt();
    const txt = templatePackage.build(response);
    fs.writeFileSync(packagePath, txt);
    doContinue = true;
  } else {
    console.info(chalk.yellow('This directory already contains a file named package.json\n'));
    const confirm = await prompt.confirmationPrompt();
    doContinue = confirm && /[yY|yes]/.test(confirm.doContinue);
  }

  if (doContinue) {
    await npm.checkCredentials();
    sh.exec('npm i');
  }
};
