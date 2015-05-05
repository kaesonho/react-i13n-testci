/*
 * grunt-screwdriver-baseurl
 * 
 *
 * Copyright (c) 2014 renatoi
 * Licensed under the MIT license.
 */

'use strict';

var portchecker = require('portchecker');

module.exports = function(grunt) {

    grunt.registerMultiTask('baseurl', 'Finds the local ip address and the free port number in screwdriver and register them in the config', function() {

        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            portMin: 10000,
            portMax: 11000,
            configBaseUrl: 'baseUrl',
            configBaseUrlPort: 'port'
        });
        var done = this.async();
        var portMin = options.portMin;
        var portMax = options.portMax;

        function getLocalhostIPAddress() {
            var os = require('os'),
                k,
                k2,
                iface,
                address,
                interfaces = os.networkInterfaces(),
                addresses = [];

            for (k in interfaces) {
                if (interfaces.hasOwnProperty(k)) {
                    for (k2 in interfaces[k]) {
                        if (interfaces[k].hasOwnProperty(k2)) {
                            iface = interfaces[k][k2];
                            if (iface.family === 'IPv4' && !iface.internal) {
                                addresses.push(iface.address);
                            }
                        }
                    }
                }
            }
            /* On VPN connections from home, sometimes the address returned is a local
             * network address unsuitable for listening, they are filtered out here.*/
            if (addresses.length > 0) {
                addresses.forEach(function (val) {
                    if (!val.match(/^(10.0.*.*|10.72.*.*|192.168.*.*)/g)) {
                        address = val;
                    }
                });
            }

            if (!address) {
                address = 'localhost';
            }

            return address;
        }

        portchecker.getFirstAvailable(portMin, portMax, 'localhost', function(p, host) {
            if (p === -1) {
                grunt.log.error('No free ports found for testing server on ' + host + ' between ' + portMin + ' and ' + portMax);
            } else {
                grunt.verbose.write('The first free port found for testing server on ' + host + ' between ' + portMin + ' and ' + portMax + ' is ' + p);

                // Set our initData in our config
                grunt.config([options.configBaseUrl], 'http://' + getLocalhostIPAddress() + ':' + p);
                grunt.config([options.configBaseUrlPort], p);
                done();
            }
        });

    });
};
