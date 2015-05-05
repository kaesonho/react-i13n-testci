'use strict';

var React = require('react');
var objectAssign = require('object-assign');
var I13nComponent = require('./I13nComponent');

/**
 * I13nButton
 * Button with I13n
 * @class I13nButton
 */
var I13nButton = React.createClass({
    /**
     * render
     * @method render
     */
    render: function () {
        var props = objectAssign({
            bindClickEvent: true,
            component: 'button',
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
module.exports = I13nButton;
