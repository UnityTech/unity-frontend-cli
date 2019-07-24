const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const shell = require('shelljs');
const git = require('simple-git');
const prompt = require('./prompt');


const status = async (repoPath) => {
    return new Promise((resolve, reject) => {
      git(repoPath).status((err, result) => {
        if (err) {
          console.info(chalk.red('There was an error getting status.'), err);
          shell.exit(1);
        } else if (result && result.current !== 'master') {
          console.info(chalk.red('You must deploy from master.'));
          shell.exit(1);
        } else if (result && result.files && result.files.length) {
          console.info(chalk.red('You have uncomitted changes.\n'));
          shell.exec('git status');
          shell.exit(1);
        }
        resolve(result);
    });
  });
}

const pushTag = async (repoPath, version, message) => {
    if (!/^./.test(repoPath)) console.info(chalk.red('Repo path is required'));
    if (!version) console.info(chalk.red('Version is required'));
    if (!message) console.info(chalk.red('Message is required'));
    if (!version || !message || !/^./.test(repoPath)) shell.exit(1);
    return new Promise((resolve, reject) => {
        git(repoPath)
        .add('package.json')
        .commit(message)
        .exec(() => console.log('    pushing Tags...'))
        .tag([ '-a', version, '-m', message ], (err, update) => {
            if (err) {
                console.info(chalk.red('    There was an error. Ensure that you\'ve committed your changes and are up to date with master.', err));
                reject(err);
            } else if (update && update.summary.changes) {
                require('child_process').exec('npm restart');
            }
        })
        .push('origin', 'master', { '--tags': null }, (err, update) => {
            if (err) {
                console.info(chalk.red('    Failed to push tag.'), err); 
                shell.exit(1);
            } else resolve(update);
        });
    });
};

const commitPkgFiles = async (repoPath, version, message) => {
  if (!/^./.test(repoPath)) console.info(chalk.red('Repo path is required'));
  if (!version) console.info(chalk.red('Version is required'));
  if (!message) console.info(chalk.red('Message is required'));
  if (!version || !message || !/^./.test(repoPath)) shell.exit(1);
  return new Promise((resolve, reject) => {
    console.log('    committing package files...')
    const addResult = shell.exec('git add package.json package-lock.json', { silent: true });
    const commitResult = shell.exec(`git commit -m "${message}"`, { silent: true });
    const pushResult = shell.exec('git push origin master', { silent: true });
    if (addResult.code > 0 || commitResult > 0 || pushResult > 0) {
      console.info(chalk.red('Something broke while committing package files to master.'));
      shell.exit(1);
    }
    resolve();
  });
};

const getRepoPath = async () => {
    let repoPath = null;
    if (!fs.existsSync(path.resolve(process.cwd(), '.git'))) {
        const result = shell.exec('git rev-parse --show-toplevel', { silent: true });
        if (result) repoPath = result.stdout;
    } else {
        repoPath = process.cwd();
    }
    if (!repoPath) {
        console.info(chalk.red('    A suitable git repository could not be found!\n'));
        await initRepo();
        shell.exit(1);
    }
    return Promise.resolve(path.resolve(repoPath.trim()));
}

const initRepo = async () => {
  const response = await prompt.initRepoPrompt();
  if (response && response.doContinue) {
    shell.exec('git init');
    shell.exec(`git remote add origin ${response.remoteUrl}`);
    await status();
  }
  return Promise.resolve();
}

module.exports = {
    getRepoPath,
    pushTag,
    status,
    commitPkgFiles
};
