/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
/*globals describe, it, beforeEach, afterEach */

'use strict';

var expect = require('chai').expect;
var I13nNode = require('../../../../dist/libs/I13nNode');

describe('I13nNode', function () {
    beforeEach(function () {
        global.Node = {
            DOCUMENT_POSITION_PRECEDING: 2
        }
    });

    it('should be created correctly', function () {
        var model = {
            sec: 'foo'
        };
        var i13nNode = new I13nNode(null, model, true, true);
        expect(i13nNode.getMergedModel()).to.deep.equal(model);
        expect(i13nNode.getParentNode()).to.equal(null);
        expect(i13nNode.isLeafNode()).to.equal(true);
        expect(i13nNode.isInViewport()).to.equal(false);
    });

    it('should be created correctly with function model', function () {
        var modelData = {
            sec: 'foo-generated'
        };
        var model = function () {
            return modelData;
        };
        var i13nNode = new I13nNode(null, model, true, true);
        expect(i13nNode.getMergedModel()).to.deep.equal(modelData);
        expect(i13nNode.getParentNode()).to.equal(null);
        expect(i13nNode.isLeafNode()).to.equal(true);
        expect(i13nNode.isInViewport()).to.equal(false);
    });

    it('should be able to append a child and work correctly with model data', function () {
        var i13nNodeParent = new I13nNode(null, {psec: 'parent'}, true, true);
        var i13nNodeChild = new I13nNode(i13nNodeParent, {sec: 'child'}, true, true);
        expect(i13nNodeParent.getChildrenNodes().count()).to.equal(1);
        expect(i13nNodeParent.getChildrenNodes().get(0)).to.equal(i13nNodeChild);
        expect(i13nNodeParent.getChildrenNodes().get(0).getMergedModel()).to.deep.equal({psec: 'parent', sec: 'child'});
    });
    
    it('should be able to append a child and work correctly with position', function () {
        var mockDomNode = {
            compareDocumentPosition: function () {
                return 2; // Node.DOCUMENT_POSITION_PRECEDING
            }
        };
        var i13nNodeParent = new I13nNode(null, {psec: 'parent'}, true, true);
        var i13nNodeChild1 = new I13nNode(i13nNodeParent, {sec: 'child'}, true, true);
        var i13nNodeChild2 = new I13nNode(i13nNodeParent, {sec: 'child'}, true, true);
        var i13nNodeChild3 = new I13nNode(i13nNodeParent, {sec: 'child'}, true, true);
        var i13nNodeChild4 = new I13nNode(i13nNodeParent, {sec: 'child'}, true, true);
        i13nNodeChild1.setDOMNode(mockDomNode);
        i13nNodeChild2.setDOMNode(mockDomNode);
        i13nNodeChild3.setDOMNode(mockDomNode);
        i13nNodeChild4.setDOMNode(mockDomNode);
        expect(i13nNodeParent.getChildrenNodes().count()).to.equal(4);
        // since the mockDomNode always return Node.DOCUMENT_POSITION_PRECEDING, so the order is the same as they insert
        expect(i13nNodeParent.isOrderDirty()).to.equal(true);
        expect(i13nNodeChild1.getPosition()).to.equal(1);
        expect(i13nNodeParent.isOrderDirty()).to.equal(false); // only need to sort once
        expect(i13nNodeChild2.getPosition()).to.equal(2);
        expect(i13nNodeChild3.getPosition()).to.equal(3);
        expect(i13nNodeChild4.getPosition()).to.equal(4);
    });
    
    it('should be able to traverse the children', function () {
        var i13nNodeParent = new I13nNode(null, {psec: 'parent'}, true, false);
        var i13nNodeChild1 = new I13nNode(i13nNodeParent, {sec: 'child'}, true, false);
        var i13nNodeChild2 = new I13nNode(i13nNodeParent, {sec: 'child'}, true, false);
        var i13nNodeChild3 = new I13nNode(i13nNodeParent, {sec: 'child'}, true, false);
        var i13nNodeChild4 = new I13nNode(i13nNodeParent, {sec: 'child'}, true, false);
        var traverseArray = [];
        expect(i13nNodeParent.getChildrenNodes().count()).to.equal(4);
        i13nNodeParent.traverseNodes(function traverseNode(child) {
            child.setCustomAttribute('traversed', true);
            traverseArray.push(child);
        });
        expect(traverseArray.length).to.equal(5);
        expect(i13nNodeChild1.getCustomAttribute('traversed')).to.equal(true);
        expect(i13nNodeChild2.getCustomAttribute('traversed')).to.equal(true);
        expect(i13nNodeChild3.getCustomAttribute('traversed')).to.equal(true);
        expect(i13nNodeChild4.getCustomAttribute('traversed')).to.equal(true);
    });
    
    it('should be handle append child correctly and emit change', function (done) {
        var i13nNodeParent = new I13nNode(null, {psec: 'parent'}, true, false);
        var i13nNodeChild1 = new I13nNode(i13nNodeParent, {sec: 'child'}, true, false);
        var i13nNodeChild2 = new I13nNode(i13nNodeParent, {sec: 'child'}, true, false);
        var i13nNodeChild3 = new I13nNode(i13nNodeParent, {sec: 'child'}, true, false);
        var traverseArray = [];
        expect(i13nNodeParent.getChildrenNodes().count()).to.equal(3);
        i13nNodeParent.traverseNodes(function traverseNode(child) {
            child.setCustomAttribute('traversed', true);
            traverseArray.push(child);
        });
        expect(i13nNodeParent.getCustomAttribute('traversed')).to.equal(true);
        i13nNodeParent.on('change', function handleOnChange() {
            expect(i13nNodeParent.getChildrenNodes().count()).to.equal(4);
            done();
        });
        // start to append child, should get on change event and clear the traverse status
        var i13nNodeChild4 = new I13nNode(i13nNodeParent, {sec: 'child'}, true, false);
    });
    
    it('should remove child correctly', function () {
        var i13nNodeParent = new I13nNode(null, {psec: 'parent'}, true, true);
        var i13nNodeChild = new I13nNode(i13nNodeParent, {sec: 'child'}, true, true);
        expect(i13nNodeParent.getChildrenNodes().count()).to.equal(1);
        // after getposition, IsOrderDirty should be false
        i13nNodeChild.getPosition();
        expect(i13nNodeParent.isOrderDirty()).to.equal(false);
        
        i13nNodeParent.removeChildNode(i13nNodeChild);

        // after remove child, IsOrderDirty is set as true
        expect(i13nNodeParent.isOrderDirty()).to.equal(true);
        expect(i13nNodeParent.getChildrenNodes().count()).to.equal(0);
    });
    
    it('should be able to get text of the dom node', function () {
        var mockDomNode = {
            value: 'bar'
        }
        var i13nNode = new I13nNode(null, {sec: 'foo'}, true, true);
        i13nNode.setDOMNode(mockDomNode);
        expect(i13nNode.getText()).to.equal('bar');
    });
});
