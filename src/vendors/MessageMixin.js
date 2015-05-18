'use strict';

var postal = require('postal/lib/postal.lodash.js');

var MsgMixin = {
    publish: function (channel, topic, data) {
        postal.publish({
            channel: channel,
            topic: topic,
            data: data
        });
    },
    subscribe: function (channel, topic, callback) {
        if (!this.subscriptions) {
            this.subscriptions = {};
        }
        if (!this.subscriptions[topic]) {
            this.subscriptions[topic] = postal.subscribe({
                channel: channel,
                topic: topic,
                callback: callback
            }).context(this);
        }
    },
    unsubscribe: function (channel, topic) {
        if (!this.subscriptions) {
            this.subscriptions = {};
        }
        if (this.subscriptions[topic]) {
            this.subscriptions[topic].unsubscribe();
            delete this.subscriptions[topic];
        }
    }
};

module.exports = MsgMixin;
