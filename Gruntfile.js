// jscs:disable maximumLineLength

'use strict';

var fs = require('fs');
var path = require('path');

module.exports = function (grunt) {
    // autoload installed tasks
    [
        'grunt-atomizer',
        'grunt-contrib-clean',
        'grunt-contrib-connect',
        'grunt-contrib-copy',
        'grunt-contrib-jshint',
        'grunt-contrib-watch',
        'grunt-react',
        'grunt-shell',
        'grunt-webpack'
    ].forEach(function (packageName) {
        var moduleTasks = path.resolve(__dirname, '..', 'node_modules', packageName, 'tasks');

        if (!fs.existsSync(moduleTasks)) {
            moduleTasks = path.resolve(process.cwd(), 'node_modules', packageName, 'tasks');
        }

        if (fs.existsSync(moduleTasks)) {
            grunt.loadTasks(moduleTasks);
        } else {
            grunt.log.error(moduleTasks + ' could not be found.');
        }
    });
    
    grunt.loadTasks('./tasks');

    // configurable paths
    var env = process.env;
    var projectConfig = {
        src: 'src',
        dist: 'dist',
        tmp: 'tmp',
        unit: 'tests/unit',
        functional: 'tests/functional',
        spec: 'tests/spec',
        coverage_dir: grunt.option('coverage_dir') || 'artifacts',
        test_results_dir: grunt.option('test_results_dir') || 'artifacts'
    };

    env.XUNIT_FILE = projectConfig.test_results_dir + '/xunit.xml';

    grunt.initConfig({
        project: projectConfig,
        clean: {
            dist: {
                files: [
                    {
                        dot: true,
                        src: ['<%= project.dist %>']
                    }
                ]
            },
            tmp: {
                files: [
                    {
                        dot: true,
                        src: ['<%= project.tmp %>']
                    }
                ]
            },
            functional: {
                files: [
                    {
                        dot: true,
                        src: [
                            '<%= project.functional %>/bundle.js',
                            '<%= project.functional %>/css/atomic.css',
                            '<%= project.functional %>/es5-*.js',
                            '<%= project.functional %>/console.js',
                            '<%= project.functional %>/*-functional.js'
                        ]
                    }
                ]
            }
        },
        // atomizer
        atomizer: {
            // used by functional tests
            functional: {
                files: [{
                    src: ['<%= project.src %>/*.jsx', 'tests/**/*.jsx'],
                    dest: 'tests/functional/css/atomic.css'
                }]
            }
        },
        // react
        // compiles jsx to js
        react: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= project.src %>',
                        src: ['**/*.*'],
                        dest: '<%= project.dist %>/',
                        extDot: 'last',
                        ext: '.js'
                    }
                ]
            },
            functional: {
                files: [
                    {
                        expand: true,
                        src: ['<%= project.functional %>/**/*.jsx'],
                        extDot: 'last',
                        ext: '.js'
                    }
                ]
            },
            unit: {
                files: [
                    {
                        expand: true,
                        src: [
                            '<%= project.unit %>/**/*.*'
                        ],
                        dest: '<%= project.tmp %>',
                        extDot: 'last',
                        ext: '.js'
                    }
                ]
            }
        },
        // shell
        // shell commands to run protractor and istanbul
        shell: {
            protractor: {
                command: './node_modules/.bin/protractor --baseUrl=<%= baseUrl %> <%= project.functional%>/protractor.conf.js'
            },
            protractor_grid: {
                command: './node_modules/.bin/protractor-batch-runner <%= project.spec %>/protractor-batch-conf.js'
            }, 
            istanbul: {
                options: {
                    execOptions: {
                        env: env
                    }
                },
                command: 'node node_modules/istanbul/lib/cli.js cover --dir <%= project.coverage_dir %> -- ./node_modules/mocha/bin/_mocha <%= project.tmp %>/<%= project.unit %> --recursive --reporter xunit-file'
            },
            mocha: {
                command: './node_modules/mocha/bin/mocha <%= project.tmp %>/<%= project.unit %> --recursive --reporter spec'
            }
        },
        // webpack
        // create js rollup with webpack module loader for functional tests
        webpack: {
            functional: {
                entry: './<%= project.functional %>/bootstrap.js',
                output: {
                    path: './<%= project.functional %>/'
                },
                module: {
                    loaders: [
                        { test: /\.css$/, loader: 'style!css' },
                        { test: /\.jsx$/, loader: 'jsx-loader' },
                        { test: /\.json$/, loader: 'json-loader'}
                    ]
                }
            }
        },
        // connect
        // setup server for functional tests
        connect: {
            functional: {
                options: {
                    port: '<%= port %>',
                    base: ['build', '<%= project.functional %>']
                }
            },
            functionalOpen: {
                options: {
                    port: 8000,
                    base: ['build', '<%= project.functional %>'],
                    open: {
                        target: 'http://127.0.0.1:8000/page.html'
                    }
                }
            }
        },
        watch: {
            functional: {
                files: [
                    '<%= project.src%>/*.jsx',
                    '<%= project.functional%>/*.jsx',
                    '<%= project.functional%>/*.html'
                ],
                tasks: ['dist', 'functional-debug']
            }
        },
        copy: {
            shimsToFunctional: {
                src: './node_modules/es5-shim/es5-shim.js',
                dest: '<%= project.functional%>/es5-shim.js'
            },
            shamsToFunctional: {
                src: './node_modules/es5-shim/es5-sham.js',
                dest: '<%= project.functional%>/es5-sham.js'
            }
        },
        baseurl: {
            functional: {
                options: {}
            }
        },
        acquire_selenium: {
            options: {
                provider: 'sauce'
            }
        }
    });

    // register custom tasks

    // functional
    // 2. run atomizer functional
    // 3. compile jsx to js in tests/functional/
    // 4. copy files to tests/functional/
    // 5. use webpack to create a js bundle to tests/functional/
    // 6. get local ip address and available port then store in grunt config
    // 7. set up local server to run functional tests
    // 9. run protractor
    grunt.registerTask('functional', [
        'atomizer-functional',
        'react:functional',
        'copy',
        'webpack:functional',
        'baseurl',
        'connect:functional',
        'shell:protractor',
        'clean:functional'
    ]);

    // similar to functional, but don't run protractor, just open the test page
    grunt.registerTask('functional-debug', [
        'atomizer-functional',
        'react:functional',
        'copy',
        'webpack:functional',
        'baseurl',
        'connect:functionalOpen',
        'watch:functional'
    ]);
    
    grunt.registerTask('functional-grid', [
        'atomizer-functional',
        'react:functional',
        'copy',
        'webpack:functional',
        'baseurl',
        'connect:functional',
        'shell:protractor_grid',
        'clean:functional'
    ]);

    // cover
    // 1. clean tmp/
    // 2. compile jsx to js in tmp/
    // 3. run istanbul cover in tmp/ using mocha command
    // 4. clean tmp/
    grunt.registerTask('cover', [
        'clean:tmp',
        'clean:dist',
        'react:unit',
        'react:dist',
        'shell:istanbul',
        'clean:tmp'
    ]);

    grunt.registerTask('unit', [
        'clean:tmp',
        'clean:dist',
        'react:unit',
        'react:dist',
        'shell:mocha'
    ]);

    grunt.registerTask('atomizer-functional', [
        'atomizer:functional'
    ]);

    // dist
    // 1. clean dist/
    // 2. compile jsx to js in dist/
    grunt.registerTask('dist', ['clean:dist', 'react:dist']);
    grunt.registerTask('test', ['clean:dist', 'react:dist', 'clean:tmp', 'react:unit']);

    // default
    grunt.registerTask('default', ['dist']);
};
