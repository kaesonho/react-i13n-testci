'use strict';

var React = require('react');
var objectAssign = require('object-assign');
var I13nComponent = require('./I13nComponent');

/**
 * I13nDiv
 * Div with I13n
 * @class I13nDiv
 */
var I13nDiv = React.createClass({
    /**
     * render
     * @method render
     */
    render: function () {
        var props = objectAssign({
            bindClickEvent: false,
            component: 'div',
            isLeafNode: false
        }, this.props);
        return (
            <I13nComponent {...props}>
                {this.props.children}
            </I13nComponent>
        );
    }
});
module.exports = I13nDiv;
