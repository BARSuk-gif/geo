module.exports = {
  "extends": "airbnb-base",
  "parser": "@babel/eslint-parser",
  "parserOptions": {
    // "requireConfigFile": false,
    "babelOptions": {
      "presets": ["@babel/preset-env"]
    },
    "ecmaVersion": 2022,
    "sourceType": "module",
  },
  "env": {
     "es6": true,
     "browser": true,
     "jest": true,
  },
  "rules": {
    'linebreak-style': 'off',
    "no-restricted-syntax": [
      "error",
      "LabeledStatement",
      "WithStatement"
    ],
  },
};
