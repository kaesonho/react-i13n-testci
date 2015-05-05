/* global describe, it, $, before, browser, expect */
'use strict';

describe('React I13n test', function () {
    var stopServer = null;

    // setup the test
    beforeEach(function () {

        // The wait function is necessary because the tests will execute
        // before the page gets to load
        return browser.wait(function () {
            // Need to clear cookies, so we do not get bucketed into
            // a different Yahoo page where the tests may fail
            browser.clearCookies();

            return browser.getLocal('tests/functional/page.html').then(function (server) {
                stopServer = server.done;
                return true;
            });
        });
    });

    afterEach(function () {
        // stops the file server as we're now done
        try {
            if (stopServer) {
                stopServer();
            }
        } catch (ex) {
            console.warn("Unable to stop local fileserver");
        }
    });

    describe('basic behavior', function (done) {
        it('should init correctly and give the rootI13nNode the correct default model value', function (done) {
            browser.executeScript('return window.rootI13nNode.getMergedModel()').then(function getResult (result) {
                expect(result).to.deep.equal({sec: 'default-section-name', page: 'test-page'});
                done()
            }, function getError (err) {
                // https://github.com/angular/protractor/issues/841
                // ignore the error throw by IE driver occasionally (~1%)
                if (13 === err.code) {
                    return false;
                } else {
                    throw err;
                }
            });
        });
        
        it('should fire a pageview', function (done) {
            browser.executeScript('return window.firedEvents').then(function getResult (events) {
                expect(events[0].name).to.equal('pageview');
                done()
            }, function getError (err) {
                // https://github.com/angular/protractor/issues/841
                // ignore the error throw by IE driver occasionally (~1%)
                if (13 === err.code) {
                    return false;
                } else {
                    throw err;
                }
            });
        });
        
        it('should fire an update event when dom change, click handler can work with custom click event', function (done) {
            var hiddenBtn = $('.HiddenBtn');
            hiddenBtn.click();
            browser.executeScript('return window.firedEvents').then(function getResult (events) {
                var currentEventCount = events.length;
                expect(events[currentEventCount - 2].name).to.equal('click');
                expect(events[currentEventCount - 1].name).to.equal('created');
                done();
            }, function getError (err) {
                // https://github.com/angular/protractor/issues/841
                // ignore the error throw by IE driver occasionally (~1%)
                if (13 === err.code) {
                    return false;
                } else {
                    throw err;
                }
            });
        });
        
        it('should handle nested model data well', function (done) {
            var nestTestI13nComponentLevel3 = $('.NestTestI13nComponentLevel3');
            nestTestI13nComponentLevel3.click();
            browser.executeScript('return window.firedEvents').then(function getResult (events) {
                var currentEventCount = events.length;
                expect(events[currentEventCount - 1].model).to.deep.equal({
                    page: 'test-page',
                    sec: 'level1',
                    vl1: 'foo',
                    vl2: 'bar',
                    vl3: 'baz',
                    vl3_ovr: 'baz'
                });
                done();
            }, function getError (err) {
                // https://github.com/angular/protractor/issues/841
                // ignore the error throw by IE driver occasionally (~1%)
                if (13 === err.code) {
                    return false;
                } else {
                    throw err;
                }
            });
        });
        
        it('should fire a click beacon', function (done) {
            var link = $('.NormalLink a');
            link.click();
            browser.executeScript('return window.firedEvents').then(function getResult (events) {
                var currentEventCount = events.length;
                expect(events[currentEventCount - 1].name).to.equal('click');
                expect(events[currentEventCount - 1].model).to.deep.equal({page: 'test-page', sec: 'foo'});
                expect(events[currentEventCount - 1].text).to.equal('NormalLink');
                expect(events[currentEventCount - 1].position).to.equal(1);
                done()
            }, function getError (err) {
                // https://github.com/angular/protractor/issues/841
                // ignore the error throw by IE driver occasionally (~1%)
                if (13 === err.code) {
                    return false;
                } else {
                    throw err;
                }
            });
        });

        it('should fire a click beacon by model generated by function', function (done) {
            var link = $('.NormalLinkWithFunctionModel a');
            link.click();
            browser.executeScript('return window.firedEvents').then(function getResult (events) {
                var currentEventCount = events.length;
                expect(events[currentEventCount - 1].name).to.equal('click');
                expect(events[currentEventCount - 1].model).to.deep.equal({page: 'test-page', sec: 'dynamical-generated'});
                expect(events[currentEventCount - 1].text).to.equal('NormalLinkWithFunctionModel');
                expect(events[currentEventCount - 1].position).to.equal(2);
                done()
            }, function getError (err) {
                // https://github.com/angular/protractor/issues/841
                // ignore the error throw by IE driver occasionally (~1%)
                if (13 === err.code) {
                    return false;
                } else {
                    throw err;
                }
            });
        });

        it('should fire a click beacon without redirect page if link is hash url', function (done) {
            var link = $('.LinkWithHashUrl a');
            link.click();
            browser.executeScript('return window.firedEvents').then(function getResult (events) {
                var currentEventCount = events.length;
                expect(events[currentEventCount - 1].name).to.equal('click');
                expect(events[currentEventCount - 1].model).to.deep.equal({page: 'test-page', sec:'foo'});
                expect(events[currentEventCount - 1].text).to.equal('LinkWithHashUrl');
                expect(events[currentEventCount - 1].position).to.equal(3);
                done()
            }, function getError (err) {
                // https://github.com/angular/protractor/issues/841
                // ignore the error throw by IE driver occasionally (~1%)
                if (13 === err.code) {
                    return false;
                } else {
                    throw err;
                }
            });
        });

        /*it('should fire a click beacon and redirect to destination page', function (done) {
            var link = $('.NormalLinkWithFollow a');
            link.click().then(function afterClick() {
                // check global object of next page
                browser.executeScript('return window.pageName').then(function getResult (pageName) {
                    expect(pageName).to.equal('mockdestinationpage');
                    done();
                }, function getError (err) {
                    // https://github.com/angular/protractor/issues/841
                    // ignore the error throw by IE driver occasionally (~1%)
                    if (13 === err.code) {
                        return false;
                    } else {
                        throw err;
                    }
                });
            });
        });
        
        it('should fire a click beacon and redirect to destination page for form submit', function (done) {
            var button = $('.NormalButton button');
            button.click().then(function afterClick() {
                // check global object of next page
                browser.executeScript('return window.pageName').then(function getResult (pageName) {
                    expect(pageName).to.equal('mockdestinationpage');
                    done();
                }, function getError (err) {
                    // https://github.com/angular/protractor/issues/841
                    // ignore the error throw by IE driver occasionally (~1%)
                    if (13 === err.code) {
                        return false;
                    } else {
                        throw err;
                    }
                });
            });
        });*/
    });
});
