A fis3 plugin to optimize the page loading speed by localstorage
 # [fis3](https://github.com/fex-team/fis3)-postpackager-cacheresource [![NPM version][npm-image]][npm-url] [![Dependency Status][daviddm-image]][daviddm-url]
 Version: **1.0.0**
 
 This is a FIS3 plugin to optimize the page loading speed combined with [fis3-postpackager-loader](https://github.com/fex-team/fis3-postpackager-loader).
 
 ## Installation
 
 Run `npm install fis3-postpackager-cacheresource`
 
 ## Usage
 
 ```js
fis.match('::package', {
        postpackager: [fis.plugin('loader', {}),fis.plugin('replacescript', {})]
    });
 
 # License
 MIT © 2015 Gergely Kovács (gg.kovacs@gmail.com)
