'use strict';

var React = require('react');
var objectAssign = require('object-assign');
var I13nComponent = require('./I13nComponent');

/**
 * I13nAnchor
 * Anchor with I13n
 * @class I13nAnchor
 */
var I13nAnchor = React.createClass({
    /**
     * render
     * @method render
     */
    render: function () {
        var props = objectAssign({
            bindClickEvent: true,
            component: 'a',
            isLeafNode: true,
            follow: true
        }, this.props);
        return (
            <I13nComponent {...props}>
                {this.props.children}
            </I13nComponent>
        );
    }
});
module.exports = I13nAnchor;
