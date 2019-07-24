#!/usr/bin/env node

const pkg = require('../package');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const prompt = require('./prompt');
const npm = require('./npm');
const git = require('./git');

const pkgInfo = chalk.cyan(`
----------------------------------
${pkg.name} v${pkg.version}
----------------------------------
`);

function formatObject(obj = {}) {
    let parts = [];
    Object.keys(obj).forEach((key) => {
        parts.push(`    ${chalk.grey(key + ':')} ${obj[key]}\n`);
    });
    return parts.join('');
}

function checkForSavedSettings(currentVersion) {
    let settingsJson = null;
    if (currentVersion) {
        const tempFilePath = path.resolve(process.cwd(), '.deploy.temp');
        if (fs.existsSync(tempFilePath)) {
            try {
                settingsJson = JSON.parse(fs.readFileSync(tempFilePath));
                settingsJson = settingsJson.packageVersion === currentVersion
                ? settingsJson
                : null;
            } catch (err) {
                // an empty file is okay.
                // console.info(chalk.red('Failed to parse temp file. Settings could not be retreived.'));
            }
        }
    }
    return settingsJson;
}

const start = async () => {
    console.info(pkgInfo); // Display package info

    const creds = await npm.checkCredentials();
    const repoPath = await git.getRepoPath();
    let deploySettings = {};
    let currentPackage = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json')));

    await git.status();

    // Recover settings
    let savedSettings = checkForSavedSettings(currentPackage.version);
    if (savedSettings) {
        console.info(chalk.green('    Saved settings found.\n'));
        console.info(formatObject(savedSettings), '\n');
        const answer = await prompt.savedSettingsPrompt();
        if (/[yY]/.test(answer.useSaved)) deploySettings = { ...savedSettings };
    }

    if (!deploySettings.packageVersion) {
        const releaseDetails = await prompt.initialPrompt();
        if (releaseDetails) deploySettings = { ...releaseDetails, repoPath };
        
        if (deploySettings.semverType) npm.incrementVersion(deploySettings.semverType);
        currentPackage = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json')));
        
        deploySettings.packageName = currentPackage.name;
        deploySettings.packageVersion = currentPackage.version;
        
        console.info(`\n${formatObject(deploySettings)}\n`);
        
        // SAVE TEMP FILE
        fs.writeFileSync(path.resolve(process.cwd(), '.deploy.temp'), JSON.stringify(deploySettings));
    }
    
    const confirmation = await prompt.confirmationPrompt();
    if (/[yY]/.test(confirmation.doContinue)) {
      const silent = true;
      await npm.runTests(silent);
      await git.pushTag(repoPath, currentPackage.version, deploySettings.message);
      await git.commitPkgFiles(repoPath, currentPackage.version, deploySettings.message)
      await npm.publish(silent);
      
        // Reset temp file
        fs.writeFileSync(path.resolve(process.cwd(), '.deploy.temp'), '');
    }

    console.info(chalk.cyan(`
...done`));
}

start();
