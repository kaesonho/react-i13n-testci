/*global window, require */
/*jslint nomen: true*/
var postal = require('postal');

(function () {
    'use strict';
    var handleEvent;
    var sendEvent;
    var deferTimer;
    var lastTime = 0;
    var THROTTLE = 50;

    sendEvent = function (type) {
        var now = Date.now();
        lastTime = now;
        postal.publish({
            channel: 'ThrottledEvents',
            topic: type
        });
    };

    handleEvent = function (e) {
        var now = Date.now();
        if (lastTime > 0 && now < lastTime + THROTTLE) {
            window.clearTimeout(deferTimer);
            deferTimer = window.setTimeout(sendEvent.bind(this, e.type), THROTTLE);
        } else {
            sendEvent(e.type);
        }
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
