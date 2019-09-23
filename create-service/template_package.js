const contents = (options) => `{
  "name": "${options.scope}${options.packageName}",
  "version": "0.0.0",
  "description": "${options.description}",
  "main": "src/index.js",
  "scripts": {
    "postinstall": "node ./node_modules/@packagedcomponents/dev-scripts/service-init"
  },
  "author": "Unity Technologies",
  "devDependencies": {
    "@packagedcomponents/dev-scripts": "^1.4.9"
  }
}
`;

module.exports = { build: options => contents(options) };
