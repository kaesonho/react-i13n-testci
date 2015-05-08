/* globals describe,it,document,beforeEach,afterEach */
'use strict';

var expect = require('chai').expect;
var jsdom = require('jsdom');
var clickHandler;
var React;
var ReactTestUtils;
var mockData = {
};
var mockClickEvent;
var mockComponent;
var I13nNode = require('../../../../dist/libs/I13nNode');
describe('clickHandler', function () {
    beforeEach(function (done) {
        jsdom.env('<html><body></body></html>', [], function (err, window) {
            global.window = window;
            global.document = window.document;
            global.navigator = window.navigator;

            React = require('react/addons');
            ReactTestUtils = require('react/lib/ReactTestUtils');
            clickHandler = require('../../../../dist/utils/clickHandler');
            mockClickEvent = {
                target: {
                },
                button: 0
            }
            mockComponent = {
                props: {
                    href: 'foo'
                }
            };
            done();
        });
    });

    afterEach(function () {
        delete global.window;
        delete global.document;
        delete global.navigator;
    });

    it('should run click handler correctly', function (done) {
        var i13nNode = new I13nNode(null, {});
        mockClickEvent.preventDefault = function () {};
        mockComponent._executeI13nEvent = function () {
            // simply done here to make sure it goes to the _executeI13nEvent
            done();
        };
        clickHandler.apply(mockComponent, [mockClickEvent]);
    });
    
    it('should run click handler correctly if target is an a tag', function (done) {
        var i13nNode = new I13nNode(null, {});
        var executedActions = [];
        mockClickEvent.target = {
            tagName: 'A'
        };
        mockClickEvent.preventDefault = function () {
            executedActions.push('preventDefault');
        };
        document.location.assign = function () {
            executedActions.push('assign');
            expect(executedActions).to.deep.equal(['preventDefault', 'assign']);
            done();
        }
        mockComponent._executeI13nEvent = function (eventName, payload, callback) {
            callback();
        };
        clickHandler.apply(mockComponent, [mockClickEvent]);
    });
    
    it('should run click handler correctly if target is an button', function (done) {
        var i13nNode = new I13nNode(null, {});
        var executedActions = [];
        mockClickEvent.target = {
            tagName: 'BUTTON'
        };
        mockClickEvent.preventDefault = function () {
            executedActions.push('preventDefault');
        };
        mockClickEvent.target.form = {
            submit: function () {
                executedActions.push('submit');
                expect(executedActions).to.deep.equal(['preventDefault', 'submit']);
                done();
            }
        }
        mockComponent._executeI13nEvent = function (eventName, payload, callback) {
            callback();
        };
        clickHandler.apply(mockComponent, [mockClickEvent]);
    });
    
    it('should run click handler correctly if target is input with submit', function (done) {
        var i13nNode = new I13nNode(null, {});
        var executedActions = [];
        mockClickEvent.target = {
            tagName: 'INPUT',
            type: 'submit'
        };
        mockClickEvent.preventDefault = function () {
            executedActions.push('preventDefault');
        };
        mockClickEvent.target.form = {
            submit: function () {
                executedActions.push('submit');
                expect(executedActions).to.deep.equal(['preventDefault', 'submit']);
                done();
            }
        }
        mockComponent._executeI13nEvent = function (eventName, payload, callback) {
            callback();
        };
        clickHandler.apply(mockComponent, [mockClickEvent]);
    });
    
    it('should not follow it if follow is set to false', function (done) {
        var i13nNode = new I13nNode(null, {});
        var executedActions = [];
        mockComponent.props.follow = false;
        mockClickEvent.preventDefault = function () {
            executedActions.push('preventDefault');
        };
        mockComponent._executeI13nEvent = function (eventName, payload, callback) {
            expect(executedActions).to.deep.equal(['preventDefault']);
            done();
        };
        clickHandler.apply(mockComponent, [mockClickEvent]);
    });
    
    it('should simply execute event without prevent default and redirection if the link is #', function (done) {
        var i13nNode = new I13nNode(null, {});
        var executedActions = [];
        mockClickEvent.target = {
            tagName: 'A'
        };
        mockComponent.props.href = '#';
        mockComponent._executeI13nEvent = function (eventName, payload, callback) {
            done();
        };
        clickHandler.apply(mockComponent, [mockClickEvent]);
    });
    
    it('should simply execute event without prevent default and redirection is a modified click', function (done) {
        var i13nNode = new I13nNode(null, {});
        var executedActions = [];
        mockClickEvent.target = {
            tagName: 'A'
        };
        mockClickEvent.metaKey = true;
        mockComponent.props.href = '#';
        mockComponent._executeI13nEvent = function (eventName, payload, callback) {
            done();
        };
        clickHandler.apply(mockComponent, [mockClickEvent]);
    });
});
