'use strict';

var React = require('react');
var I13nMixin = require('../mixins/I13nMixin');
var objectAssign = require('object-assign');
var STATIC_CLONE_BLACK_LIST = [
    'childContextTypes',
    'contextTypes',
    'displayName',
    'getDefaultProps',
    'isReactLegacyFactory',
    'propTypes',
    'type'
];

/**
 * createI13nNode higher order function to create a Component with I13nNode functionality
 * @param {Object} Component the component you want to create a i13nNode 
 * @method createI13nNode
 */
module.exports = function createI13nNode (Component) {
    var componentName = Component.displayName || Component.name;
    var staticsObject = {};
    
    // clone the all the static functions except the black list
    Object.keys(Component).forEach(function cloneStaticProperty (key) {
        if (Component.hasOwnProperty(key) && -1 === STATIC_CLONE_BLACK_LIST.indexOf(key)) {
            staticsObject[key] = Component[key];
        }   
    });

    var I13nComponent = React.createClass(objectAssign({}, I13nMixin, {statics: staticsObject}, {
        displayName: 'I13n' + componentName,
        /**
         * render
         * @method render
         */
        render: function () {
            var props = objectAssign({}, this.props);

            // delete the props that only used in this level
            try {
                delete props.model;
                delete props.viewport;
            } catch (e) {
                props.model = undefined;
                props.viewport = undefined;
            }

            return React.createElement(
                Component,
                props,
                props.children
            );
        }
    }));
    return I13nComponent;
};
