'use strict';

var protractorUtils = require('protractor-utils');
var cliParams = require('minimist')(process.argv.slice(2));
var baseConfig = protractorUtils.mochaBaseConf;

if (!cliParams.params || !cliParams.params.context) {
    throw "Unable to find params for browser name and version.";
}

var context = cliParams.params.context;

baseConfig.specs = ['**/*.spec.js'];
baseConfig.mochaOpts = {
    ui: 'bdd',
    reporter: require('protractor-reporter'),
    enableTimeouts: false
};

baseConfig.multiCapabilities = [
    {
        browserName: context.browserName,
        version: context.browserVersion
    }
];

baseConfig.sauceUser = process.env.SAUCE_USERNAME;
baseConfig.sauceKey = process.env.SAUCE_ACCESS_KEY;

exports.config = baseConfig;
