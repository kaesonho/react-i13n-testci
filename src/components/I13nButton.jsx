'use strict';

var React = require('react');
var objectAssign = require('object-assign');
var I13nMixin = require('../mixins/I13nMixin');

/**
 * I13nButton
 * Button with I13n
 * @class I13nButton
 */
var I13nButton = React.createClass({
    mixins: [I13nMixin],
    
    /**
     * getDefaultProps
     * @method getDefaultProps
     * @return {Object} default props
     */
    getDefaultProps: function () {
        return {
            isLeafNode: true,
            bindClickEvent: true,
            follow: true
        };
    },

    /**
     * render
     * @method render
     */
    render: function () {
        return (
            <button {...this.props}>
                {this.props.children}
            </button>
        );
    }
});
module.exports = I13nButton;
