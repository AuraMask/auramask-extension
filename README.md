# AuraMask Browser Extension
[![Build Status](https://circleci.com/gh/AuraMask/auramask-extension.svg?style=shield&circle-token=a1ddcf3cd38e29267f254c9c59d556d513e3a1fd)](https://circleci.com/gh/AuraMask/auramask-extension) [![Coverage Status](https://coveralls.io/repos/github/AuraMask/auramask-extension/badge.svg?branch=master)](https://coveralls.io/github/AuraMask/auramask-extension?branch=master) [![Greenkeeper badge](https://badges.greenkeeper.io/AuraMask/auramask-extension.svg)](https://greenkeeper.io/) [![Stories in Ready](https://badge.waffle.io/AuraMask/auramask-extension.png?label=in%20progress&title=waffle.io)](https://waffle.io/AuraMask/auramask-extension)

## Support

If you're a user seeking support, [here is our support site](https://auramask.helpscoutdocs.com/).

## Introduction

[Mission Statement](./MISSION.md)

[Internal documentation](./docs#documentation)

## Developing Compatible Dapps

If you're a web dapp developer, we've got two types of guides for you:

### New Dapp Developers

- We recommend this [Learning Solidity](https://karl.tech/learning-solidity-part-1-deploy-a-contract/) tutorial series by Karl Floersch.
- We wrote a (slightly outdated now) gentle introduction on [Developing Dapps with Truffle and AuraMask](https://medium.com/auramask/developing-ethereum-dapps-with-truffle-and-auramask-aa8ad7e363ba).

### Current Dapp Developers

- If you have a Dapp, and you want to ensure compatibility, [here is our guide on building AuraMask-compatible Dapps](https://github.com/AuraMask/faq/blob/master/DEVELOPERS.md)

## Building locally

 - Install [Node.js](https://nodejs.org/en/) version 8.11.3 and npm version 6.1.0
   - If you are using [nvm](https://github.com/creationix/nvm#installation) (recommended) running `nvm use` will automatically choose the right node version for you.
   - Select npm 6.1.0: ```npm install -g npm@6.1.0```
 - Install dependencies: ```npm install```
 - Install gulp globally with `npm install -g gulp-cli`.
 - Build the project to the `./dist/` folder with `gulp build`.
 - Optionally, to rebuild on file changes, run `gulp dev`.
 - To package .zip files for distribution, run `gulp zip`, or run the full build & zip with `gulp dist`.

 Uncompressed builds can be found in `/dist`, compressed builds can be found in `/builds` once they're built.

### Running Tests

Requires `mocha` installed. Run `npm install -g mocha`.

Then just run `npm test`.

You can also test with a continuously watching process, via `npm run watch`.

You can run the linter by itself with `gulp lint`.

## Development

```bash
npm install
npm start
```

## Build for Publishing

```bash
npm run dist
```

#### Writing Browser Tests

To write tests that will be run in the browser using QUnit, add your test files to `test/integration/lib`.

## Other Docs

- [How to add custom build to Chrome](./docs/add-to-chrome.md)
- [How to add custom build to Firefox](./docs/add-to-firefox.md)
- [How to develop a live-reloading UI](./docs/ui-dev-mode.md)
- [How to add a new translation to AuraMask](./docs/translating-guide.md)
- [Publishing Guide](./docs/publishing.md)
- [The AuraMask Team](./docs/team.md)
- [How to develop an in-browser mocked UI](./docs/ui-mock-mode.md)
- [How to live reload on local dependency changes](./docs/developing-on-deps.md)
- [How to add new networks to the Provider Menu](./docs/adding-new-networks.md)
- [How to manage notices that appear when the app starts up](./docs/notices.md)
- [How to port AuraMask to a new platform](./docs/porting_to_new_environment.md)
- [How to use the TREZOR emulator](./docs/trezor-emulator.md)
- [How to generate a visualization of this repository's development](./docs/development-visualization.md)

