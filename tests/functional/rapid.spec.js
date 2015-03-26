/* global describe, it, $, before, browser, expect */

'use strict';

describe('Rapid test', function () {
    var stopServer;

    // setup the test
    before(function () {
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

    after(function () {
        // stops the file server as we're now done
        try {
            if (stopServer) {
                stopServer();
            }
        } catch (ex) {
            console.warn("Unable to stop local fileserver");
        }
    });

    describe('Rapid', function () {
        it('renders the component', function () {
            var container = $('.Rapid');
            expect(container.isDisplayed()).to.eventually.equal(true);
        });
    });
});
