'use strict';

var createI13nNode = require('../utils/createI13nNode');

module.exports = createI13nNode('button', {
    isLeafNode: true,
    bindClickEvent: true,
    follow: true
});
