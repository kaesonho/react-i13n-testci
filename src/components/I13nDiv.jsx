'use strict';

var React = require('react');
var objectAssign = require('object-assign');
var I13nMixin = require('../mixins/I13nMixin');

/**
 * I13nDiv
 * Div with I13n
 * @class I13nDiv
 */
var I13nDiv = React.createClass({
    mixins: [I13nMixin],

    /**
     * getDefaultProps
     * @method getDefaultProps
     * @return {Object} default props
     */
    getDefaultProps: function () {
        return {
            isLeafNode: false,
            bindClickEvent: false
        };
    },
    
    /**
     * render
     * @method render
     */
    render: function () {
        return (
            <div {...this.props}>
                {this.props.children}
            </div>
        );
    }
});
module.exports = I13nDiv;
