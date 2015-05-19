/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
/*global window, require */
/*jslint nomen: true*/
var postal = require('postal');

(function () {
    'use strict';
    var handleEvent;
    var sendEvent;
    var deferTimer;
    var THROTTLE = 500;

    sendEvent = function (type) {
        postal.publish({
            channel: 'ThrottledEvents',
            topic: type
        });
    };

    handleEvent = function (e) {
        if (deferTimer) {
            window.clearTimeout(deferTimer);
        }
        deferTimer = window.setTimeout(sendEvent.bind(this, e.type), THROTTLE);
    };

    if (typeof window !== 'undefined') {
        if (window.addEventListener) {
            window.addEventListener('scroll', handleEvent);
            window.addEventListener('resize', handleEvent);
        } else {
            window.attachEvent('onscroll', handleEvent);
            window.attachEvent('onresize', handleEvent);
        }
    }
}());
