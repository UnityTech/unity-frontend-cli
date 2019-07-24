#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const templatePackage = require('./template_package');
const prompt = require('./prompt');
const sh = require('shelljs');
const pkg = require('./package');
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
  const targetDir = path.resolve(process.cwd());
  if ( !fs.existsSync( targetDir ) ) fs.mkdirSync( targetDir );

  const response = await prompt.initialPrompt();
  const txt = templatePackage.build(response);
  const packagePath = path.resolve(targetDir, 'package.json');
  if (!fs.existsSync(packagePath)) {
    fs.writeFileSync(packagePath, txt);
    sh.exec('npm i');
  } else console.error('This directory already contains a file named package.json');

};
