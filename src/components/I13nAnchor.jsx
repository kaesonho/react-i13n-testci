'use strict';

var React = require('react');
var objectAssign = require('object-assign');
var I13nMixin = require('../mixins/I13nMixin');

/**
 * I13nAnchor
 * Anchor with I13n
 * @class I13nAnchor
 */
var I13nAnchor = React.createClass({
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
            <a {...this.props}>
                {this.props.children}
            </a>
        );
    }
});
module.exports = I13nAnchor;
