'use strict';

var createI13nNode = require('../utils/createI13nNode');

module.exports = createI13nNode('a', {
    isLeafNode: true,
    bindClickEvent: true,
    follow: true
});
