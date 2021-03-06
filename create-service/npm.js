const shell = require('shelljs');
const prompt = require('./prompt');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

const generateRcFile = (creds) => {
    const content = `
@unity:registry=https://artifactory.internal.unity3d.com/api/npm/libs-ads
@unityweb:registry=https://artifactory.internal.unity3d.com/api/npm/libs-web/
@packagedcomponents:registry=https://artifactory.internal.unity3d.com/api/npm/libs-web/
//artifactory.internal.unity3d.com/api/npm/libs-web/:_password=${creds.password}
//artifactory.internal.unity3d.com/api/npm/libs-web/:username=${creds.userName}
//artifactory.internal.unity3d.com/api/npm/libs-web/:email=dd-devs@unity3d.com
//artifactory.internal.unity3d.com/api/npm/libs-web/:always-auth=true
`;
    fs.writeFileSync(path.resolve(process.cwd(), '.npmrc'), content);
}

const checkCredentials = async () => {
    await checkRcFile();
    await whoAmi();
    return Promise.resolve();
};

const incrementVersion = async (version) => {
    console.info('    incrementing version...');
    const result = shell.exec(`npm version ${version}`, { silent: true });
    if (result.code > 0) {
        console.info(chalk.red('Failed to update version in package.'));
        shell.exit(1);
    }
    return Promise.resolve(result);
}

const runTests = async (silent = true) => {
    console.info('    running tests...');
    const result = shell.exec('npm run test', { silent });
    if (result.code > 0) {
        console.info(chalk.red('    Tests failed. Aborting deployment.'));
        shell.exit(1);
    }
    return Promise.resolve(result);
}

const publish = async (silent = true) => {
    console.info('    deploying package...');
    const result = shell.exec('npm publish', { silent });
    if (result.code > 0) {
        console.info(chalk.red('    Failed to publish package.'));
        shell.exit(1);
    }
    return Promise.resolve(result);
}

async function checkRcFile() {
    let creds = {};
    if (!fs.existsSync(path.resolve(process.cwd(), '.npmrc'))) {
      console.info(chalk.yellow(`\n    Configure Service Account Credentials
`));
      creds = await prompt.credentialPrompt();
      generateRcFile(creds);
      console.info(`\n    Your credentials have been saved to ./npmrc`);
    }
    return Promise.resolve(0)
}

async function whoAmi() {
  me = shell.exec(
    'npm whoami --registry "https://artifactory.internal.unity3d.com/api/npm/libs-web/"', 
    { silent: true }
  );
  if (me.code !== 0) { 
      console.info(chalk.red(`    Credentials missing or invalid. 
    Please check your .npmrc and ensure you have entered the correct service account credentials.
`));
      shell.exit(1);
  } else if (me.stdout) {
      const prefix = chalk.grey('Logged in as');
      console.info(`    ${prefix} ${me.stdout}`);
  } else {
      console.info('    Invalid user logged in');
      shell.exit(1);
  }
}

module.exports = {
    checkCredentials,
    incrementVersion,
    runTests,
    publish
};
