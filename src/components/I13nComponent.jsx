'use strict';

var React = require('react');
var I13nMixin = require('../mixins/I13nMixin');

/**
 * I13nComponent
 * Components to wrap 
 * @class I13nComponent
 */
var I13nComponent = React.createClass({
    mixins: [I13nMixin],
    render: function () {
        var Component = this.props.component;
        if (Component) {
            return (
                <Component {...this.props}>
                    {this.props.children}
                </Component>
            );
        } else {
            return React.addons.cloneWithProps(this.props.children, this.props);
        }
    }
});
module.exports = I13nComponent;
