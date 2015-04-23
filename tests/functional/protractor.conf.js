'use strict';

var protractorUtils = require('protractor-utils');
var baseConfig = protractorUtils.mochaBaseConf;

baseConfig.directConnect = true;
baseConfig.chromeDriver = '../../node_modules/chromedriver/lib/chromedriver/chromedriver';
baseConfig.specs = ['**/*.spec.js'];
baseConfig.mochaOpts = {
    ui: 'bdd',
    reporter: 'nyan',
    enableTimeouts: false
};

baseConfig.multiCapabilities = [
    {
        browserName: 'chrome',
        version: 'latest'
    }
];

exports.config = baseConfig;
