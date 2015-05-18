/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
/* global Node */
'use strict';

// var debug = require('debug')('I13nNode');
var EventEmitter = require('eventemitter3').EventEmitter;
var objectAssign = require('object-assign');
var inherits = require('inherits');
var TAG_PATTERN = /<[^>]*>/g;

/**
 * I13nNode the virtual DOM Node used to build a I13n Tree for instrumentation
 * @class I13nNode
 * @param {Object} parentNode parent node
 * @param {Object} model custom model values
 * @param {Boolean} isLeafNode indicate if it's a link node
 * @param {Boolean} isViewportEnabled indicate if viewport check enable
 * @constructor
 */
var I13nNode = function I13nNode (parentNode, model, isLeafNode, isViewportEnabled) {
    this._parentNode = parentNode;
    if (this._parentNode) {
        this._parentNode.appendChildNode(this);
    }

    // we allow users to pass in a function which generate the dynamic model data
    if ('function' === typeof model) {
        this._model = model;
    } else {
        this._model = model || {};
    }
    
    this._childrenNodes = []; // children nodes
    this._DOMNode = null; // DOM node of the i13n node, will use setDOMNode to set it in componentDidMount
    this._customAttributes = {} // any custom value want to set in the i13n node, can used to save some status in the handler functions

    // _isLeafNode indicate if it's a leaf node or not, e.g., an anchor or button. it's used to help users to know if they want to handle it for some cases, e.g., when we want to track links
    this._isLeafNode = isLeafNode || false;

    // _isOrderDirty used to check if we need to sort children nodes before we get position of one of it child
    // will set to true if we already sort them
    // set to false once we add/remove a child
    this._isOrderDirty = false; 

    // _isInViewport save the status if node is already shown in the viewport, if viewport check isn't enabled, then always set to true
    this._isInViewport = !isViewportEnabled ? true : false;
};

inherits(I13nNode, EventEmitter);

/**
 * Append a child node
 * @method appendChildNode
 * @param {Object} childNode the child node
 */
I13nNode.prototype.appendChildNode = function appendChildNode (childNode) {
    this._childrenNodes.push(childNode);
    this._isOrderDirty = true;
    this.emit('change');
};

/**
 * Get the children array
 * @method getChildrenNodes
 * @return {Array} the children array
 */
I13nNode.prototype.getChildrenNodes = function getChildrenNodes () {
    return this._childrenNodes;
};

/**
 * Get custom attribute value
 * @method getCustomAttribute
 * @param {String} name attribute name
 * @return {Boolean|Number|String|Array|Object} the attribute value
 */
I13nNode.prototype.getCustomAttribute = function getCustomAttribute (name) {
    return this._customAttributes[name];
};

/**
 * Get the dom node
 * @method getDOMNode
 * @return {Object} the DOMNode
 */
I13nNode.prototype.getDOMNode = function getDOMNode () {
    return this._DOMNode;
};

/**
 * Get merged model which is traced to the root 
 * @method getMergedModel
 * @return {Object} the merged model
 */
I13nNode.prototype.getMergedModel = function getMergedModel () {
    if (this._parentNode) {
        var parentModel = this._parentNode.getMergedModel();
        return objectAssign({}, parentModel, this.getModel());
    } else {
        return this.getModel();
    }
};

/**
 * Get plain model object, from either dynamic function or plain object
 * @method getModel
 * @return {Object} the plain object model
 */
I13nNode.prototype.getModel = function getModel () {
    var model = null;
    if ('function' === typeof this._model) {
        model = this._model();
    } else {
        model = this._model;
    }
    return model;
};

/**
 * Get the parent node
 * @method getParentNode
 * @return {Object} the parent node
 */
I13nNode.prototype.getParentNode = function getParentNode () {
    return this._parentNode;
};

/**
 * Get the position of its parent
 * @method getPosition
 * @return {Number} the position
 */
I13nNode.prototype.getPosition = function getPosition () {
    var parentNode = this._parentNode;
    if (!parentNode) {
        return 1;
    }
    if (parentNode.isOrderDirty()) {
        parentNode.sortChildrenNodes();
    }
    return parentNode.getChildrenNodes().indexOf(this) + 1;
};

/**
 * Get text of the i13nNode
 * @method getText
 * @param {Object} target the event target, would take the target's text then i13n node's text
 * @return {String} text of the node
 */
I13nNode.prototype.getText = function getText (target) {
    var DOMNode = this.getDOMNode();
    if (!DOMNode && !target) {
        return '';
    }
    var text = (DOMNode && (DOMNode.value || DOMNode.innerHTML)) ||
        (target && (target.value || target.innerHTML));
    if (text) {
        text = text.replace(TAG_PATTERN, '');
    }
    return text;
};

/**
 * Get isLeafNode value
 * @method isLeafNode
 * @return {Boolean} the isLeafNode value
 */
I13nNode.prototype.isLeafNode = function isLeafNode () {
    return this._isLeafNode;
};

/**
 * Get isOrderDirty value, it become dirty once the children array changed
 * @method isOrderDirty
 * @return {Boolean} the isOrderDirty value
 */
I13nNode.prototype.isOrderDirty = function isOrderDirty () {
    return this._isOrderDirty;
};

/**
 * Get isInViewport value
 * @method isInViewport
 * @return {Boolean} the isInViewport value
 */
I13nNode.prototype.isInViewport = function isInViewport () {
    return this._isInViewport;
};

/**
 * Recursively traverse nodes
 * @method traverseNodes
 * @param {Function} handler function
 */
I13nNode.prototype.traverseNodes = function traverseNodes (handler) {
    handler && handler(this);
    this._childrenNodes.forEach(function traverseChildNode(child) {
        child.traverseNodes(handler);
    });
    return this;
};

/**
 * Remove child node
 * @param {Object} childNode child node
 * @method removeChildNode
 */
I13nNode.prototype.removeChildNode = function removeChildNode (childNode) {
    var index = this._childrenNodes.indexOf(childNode);
    this._childrenNodes.splice(index, 1);
    this._isOrderDirty = true;
    this.emit('change');
};

/**
 * Update DOM node 
 * @method setDOMNode
 * @param {Object} DOMNode
 */
I13nNode.prototype.setDOMNode = function setDOMNode (DOMNode) {
    this._DOMNode = DOMNode;
};

/**
 * Set isInViewport value
 * @method setIsInViewport
 * @param {Boolean} isInViewport
 */
I13nNode.prototype.setIsInViewport = function setIsInViewport (isInViewport) {
    this._isInViewport = isInViewport;
};

/**
 * Set custom attribute
 * @method setCustomAttribute
 * @param {String} name attribute name
 * @param {Boolean|Number|String|Array|Object} value attribute value, can be any types
 */
I13nNode.prototype.setCustomAttribute = function setCustomAttribute (name, value) {
    this._customAttributes[name] = value;
};

/**
 * Sort children according to the position in the page
 * @method sortChildrenNodes
 * @param {Boolean} propagate indicate if want to propagate the sorting event to its parent
 */
I13nNode.prototype.sortChildrenNodes = function sortChildrenNodes (propagate) {
    this._childrenNodes.sort(function compareChildrenNodes(childA, childB) {
        var domA = childA.getDOMNode();
        var domB = childB.getDOMNode();
        if (domA && domB) {
            if (domB.compareDocumentPosition) {
                var comparison = domB.compareDocumentPosition(domA);
                if (comparison & Node.DOCUMENT_POSITION_PRECEDING) {
                    return -1;
                }
            } else if (domB.sourceIndex) {
                // IE 8
                return domA.sourceIndex - domB.sourceIndex;
            }
        }
        return 1;
    });
    this._isOrderDirty = false;
    if (this._parentNode && propagate) {
        this._parentNode.sortChildrenNodes(propagate);
    }
};

module.exports = I13nNode;
