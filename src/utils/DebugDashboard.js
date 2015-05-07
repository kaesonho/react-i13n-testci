var EventListener = require('react/lib/EventListener');
/* global document, window*/

var uniqueId = 0;

function cumulativeOffset (element) {
    var top = 0;
    var left = 0;
    do {
        top += element.offsetTop  || 0;
        left += element.offsetLeft || 0;
        element = element.offsetParent;
    } while (element);
    return {
        top: top,
        left: left
    };
}

/**
 * create debug message board for the i13n node
 * @class DebugDashboard
 * @param {Object} i13nNode the i13n node
 * @constructor
 */
var DebugDashboard = function DebugDashboard (i13nNode) {
    var DOMNode = i13nNode.getDOMNode();
    if (!DOMNode) {
        return;
    }
    var container = document.createElement('div');
    container.id = 'i13n-debug-' + uniqueId;
    var triggerNode = document.createElement('span');
    var dashboard = document.createElement('div');
    var model = i13nNode.getMergedModel();
    var modelInfomation = '';
    var offset = cumulativeOffset(DOMNode);

    // compose model data
    model.position = i13nNode.getPosition();
    modelInfomation += '<ul style="margin: 0; padding-left: 0; border: #400090 1px solid;">';
    modelInfomation += '<li style="background: #400090; color: #FFF; padding: 5px;' + 
        'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">' + i13nNode.getText() + '</li>';
    Object.keys(model).forEach(function generateModelInfo(key) {
        modelInfomation += '<li style="border-top: #400090 1px solid; padding: 5px;' + 
        'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">' + key + ': ' + model[key] + '</li>';
    }); 
    modelInfomation += '</ul>';

    // generate dashboard
    dashboard.innerHTML = modelInfomation;
    dashboard.style.position = 'relative';
    dashboard.style.display = 'none';
    dashboard.style.background = '#7300ff';
    dashboard.style.color = '#FFF';
    dashboard.style.fontsize = '14px';
    dashboard.style.width = '100%';
    dashboard.style['margin-top'] = '2px';
    dashboard.style['z-index'] = '1';

    // generate trigger node
    triggerNode.innerHTML = '...';
    triggerNode.style.background = '#400090';
    triggerNode.style.color = '#FFF';
    triggerNode.style.padding = '2px';
    triggerNode.style.cursor = 'pointer';
    this.clickListener = EventListener.listen(triggerNode, 'click', function () {
        if ('none' === dashboard.style.display) {
            dashboard.style.display = 'block';
            container.style['z-index'] = '11';
        } else {
            dashboard.style.display = 'none';
            container.style['z-index'] = '10';
        }
    });

    DOMNode.style.transition = 'border 0.05s';

    this.mouseOverListener = EventListener.listen(triggerNode, 'mouseover', function () {
        DOMNode.style.border = '5px solid #5a00c8';
    });

    this.mouseOutListener = EventListener.listen(triggerNode, 'mouseout', function () {
        DOMNode.style.border = null;
    });

    // generate container
    container.style.position = 'absolute';
    container.style['max-width'] = '300px';
    container.style.top = offset.top + 'px';
    var left = offset.left + DOMNode.offsetWidth - 15;

    // adjust layout if dashboard is out of the viewport
    if (left + 305 > window.innerWidth) {
        dashboard.style.left = (window.innerWidth - (left + 300) - 5) + 'px';
    }

    container.style.left = (offset.left + DOMNode.offsetWidth - 15) + 'px';
    container.style['z-index'] = '10';
    
    container.appendChild(triggerNode);
    container.appendChild(dashboard);
    document.body.appendChild(container);
    this.container = container;
};

DebugDashboard.prototype.destroy = function () {
    this.clickListener && this.clickListener.remove();
    this.mouseOverListener && this.mouseOverListener.remove();
    this.mouseOutListener && this.mouseOutListener.remove();
    if (this.container) {
        document.body.removeChild(this.container);
    }
};

module.exports = DebugDashboard;
