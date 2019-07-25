const prompt = require('prompt');


const schemas = {
    initialPrompt: { 
        properties: {
            packageName: {
                description: 'What would you like to name your service?',
                type: 'string',
                pattern: /^(?![0-9]+$)(?!.*-$)(?!-)[a-z][a-z0-9-]{1,63}$/,
                message: 'Name must be at least three charaters long using lower case letters and hyphens.',
                required: true,
            },
            description: {
                description: 'Please enter a description',
                type: 'string',
                pattern: /^.../,
                message: 'Description must be at least three charaters long',
                required: true,
            }
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
    },
};

const getPrompt = async (schema) => {
    return new Promise((resolve, reject) => {
        prompt.start();
        prompt.get(schema, (err, result) => {
            if (err) throw err;
            else {
              result.scope = '@packagedcomponents'
              resolve(result);
            }
        });
    });
}


module.exports = {
    initialPrompt: () => {
        return getPrompt(schemas.initialPrompt);
    },
    confirmationPrompt: () => {
        return getPrompt(schemas.confirmationPrompt);
    },
    savedSettingsPrompt: () => {
        return getPrompt(schemas.savedSettingsPrompt);
    },
};
