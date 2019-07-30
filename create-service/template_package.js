const contents = (options) => `{
  "name": "${options.scope}${options.packageName}",
  "version": "0.0.0",
  "description": "${options.description}",
  "main": "src/index.js",
  "scripts": {
    "build": "webpack --mode production",
    "start": "cross-env NODE_ENV=localhost node ./scripts/start-server.js",
    "lint": "eslint",
    "storybook": "start-storybook -h dev-developer.cloud.unity3d.com -c .storybook",
    "test": "jest",
    "test:generate-output": "jest --json --outputFile=jest-results.json",
    "postinstall": "node ./node_modules/@packagedcomponents/dev-scripts/service-init"
  },
  "jest": {
    "setupFiles": [
      "./.jest/config.js",
      "jest-canvas-mock"
    ],
    "snapshotSerializers": [
      "enzyme-to-json/serializer"
    ],
    "transform": {
      "^.+\\\\.jsx?$": "babel-jest"
    },
    "moduleNameMapper": {
      "^.+\\\\.(css|scss)$": "identity-obj-proxy"
    }
  },
  "author": "Unity Technologies",
  "devDependencies": {
    "@packagedcomponents/dev-scripts": "^1.4.2",
    "@babel/core": "^7.2.2",
    "@babel/plugin-proposal-class-properties": "^7.3.0",
    "@babel/preset-env": "^7.3.1",
    "@babel/preset-react": "^7.0.0",
    "@storybook/addon-jest": "^5.0.5",
    "@storybook/addon-options": "^5.0.5",
    "babel-eslint": "^10.0.1",
    "babel-jest": "^24.1.0",
    "babel-loader": "^8.0.5",
    "enzyme": "^3.8.0",
    "enzyme-adapter-react-16": "^1.9.1",
    "enzyme-to-json": "^3.3.5",
    "eslint": "^5.3.0",
    "eslint-config-airbnb": "^17.1.0",
    "eslint-plugin-import": "^2.16.0",
    "eslint-plugin-jest": "^22.3.0",
    "eslint-plugin-jsx-a11y": "^6.2.1",
    "eslint-plugin-react": "^7.13.0",
    "identity-obj-proxy": "^3.0.0",
    "jest": "^24.1.0",
    "jest-canvas-mock": "^2.0.0-beta.1",
    "react-test-renderer": "^16.8.1",
    "webpack": "^4.31.0",
    "webpack-cli": "^3.3.2"
  },
  "dependencies": {
    "@material-ui/core": "^3.9.2",
    "@material-ui/icons": "^3.0.2",
    "@storybook/addon-knobs": "^5.0.11",
    "@storybook/react": "^5.0.11",
    "@unity/react-components": "1.3.0",
    "classnames": "^2.2.6",
    "custom-env": "^1.0.2",
    "formik": "^1.5.7",
    "highcharts": "^7.0.3",
    "dotenv": "^6.0.0",
    "highcharts-more": "^0.1.7",
    "highcharts-react-official": "^2.0.0",
    "moment": "^2.24.0",
    "prop-types": "^15.7.1",
    "react": "^16.8.1",
    "react-copy-to-clipboard": "^5.0.1",
    "react-dom": "^16.8.1",
    "react-intl": "^2.9.0",
    "react-refetch": "^2.0.3",
    "uuid": "^3.3.2",
    "yup": "^0.26.10"
  }
}
`;

module.exports = { build: options => contents(options) };
