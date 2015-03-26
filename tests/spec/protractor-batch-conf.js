// See for config options:
// https://git.corp.yahoo.com/Protractor/protractor-batch-runner#batch-configuration

var scriptDir = __dirname;
var servers = require('protractor-batch-runner').servers;
var config = {
    'protractor': [
        {
            'server_manager': {
                'server_module': servers.Selastic,
                'server_count': 1,
                'config': {
                    'browser': 'chrome',
                    'browserVersion': 'latest'
                }
            },
            'instance': {
                'conf_file': scriptDir + '/../functional/protractor-grid.conf.js',
                'params': [
                    ['context.environment=prod', 'context.device=desktop', 'context.browserName=chrome', 'context.browserVersion=latest']
                ]
            }
        },
        {
            'server_manager': {
                'server_module': servers.Selastic,
                'server_count': 1,
                'config': {
                    'browser': 'firefox',
                    'browserVersion': 'latest'
                }
            },
            'instance': {
                'conf_file': scriptDir + '/../functional/protractor-grid.conf.js',
                'params': [
                    ['context.environment=prod', 'context.device=desktop', 'context.browserName=firefox', 'context.browserVersion=latest']
                ]
            }
        },
        {
            'server_manager': {
                'server_module': servers.Selastic,
                'server_count': 1,
                'config': {
                    'browser': 'safari',
                    'browserVersion': 'latest',
                    'platform': 'mac'
                }
            },
            'instance': {
                'conf_file': scriptDir + '/../functional/protractor-grid.conf.js',
                'params': [
                    ['context.environment=prod', 'context.device=desktop', 'context.browserName=safari', 'context.browserVersion=latest']
                ]
            }
        },
        {
            'server_manager': {
                'server_module': servers.Selastic,
                'server_count': 1,
                'config': {
                    'browser': 'iexplore',
                    'browserVersion': '8'
                }
            },
            'instance': {
                'conf_file': scriptDir + '/../functional/protractor-grid.conf.js',
                'params': [
                    ['context.environment=prod', 'context.device=desktop', 'context.browserName="internet explorer"', 'context.browserVersion=8']
                ]
            }
        },
        {
            'server_manager': {
                'server_module': servers.Selastic,
                'server_count': 1,
                'config': {
                    'browser': 'iexplore',
                    'browserVersion': '9'
                }
            },
            'instance': {
                'conf_file': scriptDir + '/../functional/protractor-grid.conf.js',
                'params': [
                    ['context.environment=prod', 'context.device=desktop', 'context.browserName="internet explorer"', 'context.browserVersion=9']
                ]
            }
        },
        {
            'server_manager': {
                'server_module': servers.Selastic,
                'server_count': 1,
                'config': {
                    'browser': 'iexplore',
                    'browserVersion': '10'
                }
            },
            'instance': {
                'conf_file': scriptDir + '/../functional/protractor-grid.conf.js',
                'params': [
                    ['context.environment=prod', 'context.device=desktop', 'context.browserName="internet explorer"', 'context.browserVersion=10']
                ]
            }
        },
        {
            'server_manager': {
                'server_module': servers.Selastic,
                'server_count': 1,
                'config': {
                    'browser': 'iexplore',
                    'browserVersion': '11'
                }
            },
            'instance': {
                'conf_file': scriptDir + '/../functional/protractor-grid.conf.js',
                'params': [
                    ['context.environment=prod', 'context.device=desktop', 'context.browserName="internet explorer"', 'context.browserVersion=11']
                ]
            }
        }
    ]
};

module.exports = config;
