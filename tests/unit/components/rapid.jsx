/*globals describe, it, before, beforeEach */

'use strict';

var React = require('react/addons');
var ReactTestUtils = require('react/lib/ReactTestUtils');
var jsdom = require('jsdom').jsdom;
var expect = require('chai').expect;
var testResult;
var Rapid;

describe('Rapid', function () {
    beforeEach(function () {
        global.document = jsdom('<html><body><div class="my-target" style="height:123px">My reference node</div></body></html>', {});
        global.window = global.document.parentWindow;
        global.navigator = global.window.navigator;

        Rapid = require('../../../../dist/components/rapid');
        testResult = {};
    });

    afterEach(function () {
        delete global.window;
        delete global.document;
        delete global.navigator;
    });

    describe('render()', function () {
        var component;

        afterEach(function () {
            if (component && component.isMounted && component.isMounted()) {
                React.unmountComponentAtNode(component.getDOMNode().parentNode);
            }
        });

        it ('should do basic rendering', function () {
            component = ReactTestUtils.renderIntoDocument(
                <Rapid />
            );
            var componentDom = component.getDOMNode();
            var componentDomChildren = componentDom.childNodes;

            expect(componentDomChildren.length).to.equal(0);
            expect(componentDom.innerHTML).to.equal('');
        });
    });
});
