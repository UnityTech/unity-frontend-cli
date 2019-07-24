const prompt = require('prompt');


const schemas = {
    initialPrompt: { 
        properties: {
            semverType: {
                description: 'What type of update is this: major, minor, patch?',
                type: 'string',
                pattern: /^(major||minor|patch)$/,
                message: 'You must enter one of: major, minor, or patch',
                required: true,
            },
            
            message: {
                description: 'Enter a message',
                type: 'string',
                pattern: /^./,
                message: 'You must enter a message',
                required: true,
            }
        }
    },

    credentialPrompt: {
        properties: {
            userName: {
                description: 'Enter Artifactory username',
                type: 'string',
                pattern: /^./,
                message: 'You must enter a user name',
                required: true,
            },

            password: {
                description: 'Enter Artifactory password',
                type: 'string',
                pattern: /^./,
                message: 'You must enter a password',
                required: true,
            }
        }
    },

    initRepoPrompt: {
      properties: {
          doContinue: {
            description: 'Would you like to create a new git repository at the current directory? (yes, no)',
            type: 'string',
            pattern: /^([yY]|yes|[nN]|no)$/,
            message: 'You must enter: yes or no',
            required: true,
          },
          remoteUrl: {
            description: 'Enter the remote URL for this repository',
            type: 'string',
            pattern: /^(https?:\/\/|git@)[aA-zZ]{3}.*\.[aA-zZ]{2}/,
            message: 'You must enter a git repo.',
            required: true,
        },
      }
    },

    confirmationPrompt: {
        properties: {
            doContinue: {
                description: 'Continue with deployment? (yes, no)',
                type: 'string',
                pattern: /^([yY]|yes|[nN]|no)$/,
                message: 'You must enter: yes or no',
                required: true,
            },
        }
    },

    savedSettingsPrompt: {
        properties: {
            useSaved: {
                description: 'Recover settings? (yes, no)',
                type: 'string',
                pattern: /^([yY]|yes|[nN]|no)$/,
                message: 'You must enter: yes or no',
                required: true,
            },
        }
    }
};

const getPrompt = async (schema) => {
    return new Promise((resolve, reject) => {
        prompt.start();
        prompt.get(schema, (err, result) => {
            if (err) throw err;
            else resolve(result);
        });
    });
}


module.exports = {
    initialPrompt: () => {
        return getPrompt(schemas.initialPrompt);
    },
    initRepoPrompt: () => {
        return getPrompt(schemas.initRepoPrompt);
    },
    credentialPrompt: () => {
        return getPrompt(schemas.credentialPrompt);
    },
    confirmationPrompt: () => {
        return getPrompt(schemas.confirmationPrompt);
    },
    savedSettingsPrompt: () => {
        return getPrompt(schemas.savedSettingsPrompt);
    }
}
