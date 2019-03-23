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

在当前页面中启动一个沙箱环境, 让所有代码跑在沙箱中

## 原理

* 在当前页面中插入一个空的 `<iframe>` 元素
  * 作为独立的运行环境, 与当前页面隔离开(特别适合作为第三方的集成方案)
  * 避免与当前页面的 `CSS`/`JS` 冲突
* 将 `JS` 注入到 `<iframe>` 元素中执行
  * 动态创建 `<script>` 元素插入到 `<iframe>` 中

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

* [ESDoc](https://doc.esdoc.org/github.com/ufologist/bootup-sandbox/)
* 兼容 IE9+
  * `Object.defineProperty`
  * `script.onload`
  * `postMessage`

## 初衷

接入 IM

## 其他思路

* [iframe-script](https://github.com/alexgorbatchev/iframe-script)
* [create-iframe](https://github.com/sethvincent/create-iframe)
* [iframe-sandbox](https://github.com/kumavis/iframe-sandbox)
* [jsonp-sandbox](https://github.com/aui/jsonp-sandbox)