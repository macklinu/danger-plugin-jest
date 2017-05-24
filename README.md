# danger-plugin-jest

[![Build Status](https://travis-ci.org/macklinu/danger-plugin-jest.svg?branch=master)](https://travis-ci.org/macklinu/danger-plugin-jest)
[![npm version](https://badge.fury.io/js/danger-plugin-jest.svg)](https://badge.fury.io/js/danger-plugin-jest)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

> [Danger](https://github.com/danger/danger-js) plugin for Jest

## Usage

### Setup Jest

This Danger plugin relies on modifying your Jest configuration.

Install [jest-json-reporter](https://github.com/Vall3y/jest-json-reporter):

```sh
yarn add jest-json-reporter --dev
```

Modify your `package.json` to process test results with jest-json-reporter. You may optionally set the output path of the JSON test results using the `jestJsonReporter.outputFile` path (which otherwise defaults to `./test-results.json`):

```json
{
  "jest": {
    "testResultsProcessor": "jest-json-reporter"
  },
  "jestJsonReporter": {
    "outputFile": "tests/results.json"
  }
}
```

> You may also want to add the JSON output file to your `.gitignore`, since it doesn't need to be checked into source control.

### Setup Danger

Install this Danger plugin:

```sh
yarn add danger-plugin-jest --dev
```

If you set `jestJsonReporter.outputFile` in your `package.json`, make sure that `testResultsJsonPath` matches that path:

```js
// dangerfile.js
import path from 'path'
import jest from 'danger-plugin-jest'

jest({
  testResultsJsonPath: path.resolve(__dirname, 'tests/results.json'),
})
```

If you _did not_ change the `jestJsonReporter.outputFile` path in your `package.json`, you can just do the following:

```js
// dangerfile.js
import jest from 'danger-plugin-jest'

jest()
```

See [`src/index.ts`](https://github.com/macklinu/danger-plugin-jest/blob/master/src/index.ts) for more details.

## Changelog

See the GitHub [release history](https://github.com/macklinu/danger-plugin-jest/releases).

## Development

Install [Yarn](https://yarnpkg.com/en/), and install the dependencies - `yarn install`.

Run the [Jest](https://facebook.github.io/jest/) test suite with `yarn test`.

This project uses [semantic-release](https://github.com/semantic-release/semantic-release) for automated NPM package publishing.

The main caveat: instead of running `git commit`, run `yarn commit` and follow the prompts to input a conventional changelog message via [commitizen](https://github.com/commitizen/cz-cli).

:heart:
