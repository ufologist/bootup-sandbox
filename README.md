# bootup-sandbox

[![NPM version][npm-image]][npm-url] [![Build Status][ci-status-image]][ci-status-url] [![Coverage Status][coverage-status-image]][coverage-status-url] [![Known Vulnerabilities][vulnerabilities-status-image]][vulnerabilities-status-url] [![changelog][changelog-image]][changelog-url] [![license][license-image]][license-url]

[vulnerabilities-status-image]: https://snyk.io/test/npm/bootup-sandbox/badge.svg
[vulnerabilities-status-url]: https://snyk.io/test/npm/bootup-sandbox
[ci-status-image]: https://travis-ci.org/ufologist/bootup-sandbox.svg?branch=master
[ci-status-url]: https://travis-ci.org/ufologist/bootup-sandbox
[coverage-status-image]: https://coveralls.io/repos/github/ufologist/bootup-sandbox/badge.svg?branch=master
[coverage-status-url]: https://coveralls.io/github/ufologist/bootup-sandbox
[npm-image]: https://img.shields.io/npm/v/bootup-sandbox.svg?style=flat-square
[npm-url]: https://npmjs.org/package/bootup-sandbox
[license-image]: https://img.shields.io/github/license/ufologist/bootup-sandbox.svg
[license-url]: https://github.com/ufologist/bootup-sandbox/blob/master/LICENSE
[changelog-image]: https://img.shields.io/badge/CHANGE-LOG-blue.svg?style=flat-square
[changelog-url]: https://github.com/ufologist/bootup-sandbox/blob/master/CHANGELOG.md

[![npm-image](https://nodei.co/npm/bootup-sandbox.png?downloads=true&downloadRank=true&stars=true)](https://npmjs.com/package/bootup-sandbox)

## Example

```javascript
import {
    BootupSandbox
} from 'bootup-sandbox';

var sandbox = new BootupSandbox();
sandbox.injectScript('window.foo = "bar"', function() {
    console.log(sandbox.window.foo);
});
```

## APIDoc

[ESDoc](https://doc.esdoc.org/github.com/ufologist/bootup-sandbox/)

## 初衷

接入 IM

## 其他思路

* [iframe-script](https://github.com/alexgorbatchev/iframe-script)
* [create-iframe](https://github.com/sethvincent/create-iframe)
* [iframe-sandbox](https://github.com/kumavis/iframe-sandbox)
* [https://github.com/aui/jsonp-sandbox](https://github.com/aui/jsonp-sandbox)