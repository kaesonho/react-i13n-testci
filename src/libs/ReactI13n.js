/* global window, global */
'use strict';

var debugLib = require('debug');
var debug = debugLib('ReactI13n');
var async = require('async');
var Immutable = require('immutable');
var EventsQueue = require('./EventsQueue');
var I13nNode = require('./I13nNode');
var ENVIRONMENT = (typeof window !== 'undefined') ? 'client' : 'server';
var GLOBAL_OBJECT = ('client' === ENVIRONMENT) ? window : global;

// export the debug lib in client side
if ('client' === ENVIRONMENT) {
    window.debugLib = debugLib;
}

/**
 * ReactI13n Library to build a tree for instrumentation
 * @class ReactI13n
 * @param {Object} options options object
 * @param {Boolean} options.isViewportEnabled if enable viewport checking
 * @param {Object} options.rootModelData model data of root i13n node
 * @param {Object} options.i13nNodeClass the i13nNode class, you can inherit it with your own functionalities 
 * @constructor
 */
var ReactI13n = function ReactI13n (options) {
    debug('init', options);
    options = options || {};
    this._i13nNodeClass = options.i13nNodeClass || I13nNode;

    this._plugins = Immutable.Map();
    this._eventsQueues = Immutable.Map();
    this._isViewportEnabled = options.isViewportEnabled || false;
    this._rootModelData = options.rootModelData || {};
    
    // set itself to the global object so that we can get it anywhere by the static function getInstance
    GLOBAL_OBJECT.reactI13n = this;
};

/**
 * Get ReactI13n Instance
 * @method getInstance
 * @return the ReactI13n instance
 * @static
 */
ReactI13n.getInstance = function getInstance () {
    return GLOBAL_OBJECT.reactI13n;
};

/**
 * Create root node and set to the global object
 * @method createRootI13nNode
 */
ReactI13n.prototype.createRootI13nNode = function createRootI13nNode () {
    var I13nNodeClass = this.getI13nNodeClass();
    GLOBAL_OBJECT.rootI13nNode = new I13nNodeClass(null, this._rootModelData, false);
    return GLOBAL_OBJECT.rootI13nNode;
};

/**
 * Execute handlers asynchronously
 * @method execute
 * @param {String} eventName
 * @param {Object} payload payload object
 * @param {Function} callback callback function when all handlers are executed
 * @async
 */
ReactI13n.prototype.execute = function execute (eventName, payload, callback) {
    payload = payload || {};
    payload.env = ENVIRONMENT;
    payload.i13nNode = payload.i13nNode || this.getRootI13nNode();
    var handlers = this.getEventHandlers(eventName, payload);
    // async execute all handlers if plugins and then call callback function
    async.parallel(handlers, function asyncEnd() {
        callback && callback();
    });
};

/**
 * Setup plugins
 * @method plug
 * @param {Object} plugin the plugin object
 */
ReactI13n.prototype.plug = function plug (plugin) {
    if (!plugin) {
        return;
    }
    this._plugins = this._plugins.set(plugin.name, plugin);
    this._eventsQueues = this._eventsQueues.set(plugin.name, new EventsQueue(plugin));
    debug('setup plugin', plugin);
};

/**
 * Get handlers from all plugin by event name
 * @method getEventHandlers
 * @param {String} eventName event name
 * @param {Object} payload payload object
 * @return {Array} the handlers
 */
ReactI13n.prototype.getEventHandlers = function getEventHandlers (eventName, payload) {
    var self = this;
    var handlers = [];
    if (self._plugins) {
        self._plugins.map(function getEventHandler (plugin, pluginName) {
            var eventsQueue = self._eventsQueues.get(pluginName);
            var eventHandler = plugin && plugin.eventHandlers && plugin.eventHandlers[eventName];
            if (eventHandler) {
                handlers.push(function executeEventHandler(asyncCallback) {
                    eventsQueue.executeEvent(eventName, payload, asyncCallback);
                });
            }
        });
    }
    return handlers;
};

/**
 * Get I13n node class
 * @method getI13nNodeClass
 * @return {Object} I13nNode class
 */
ReactI13n.prototype.getI13nNodeClass = function getI13nNodeClass () {
    return this._i13nNodeClass;
};

/**
 * Get isViewportEnabled value
 * @method isViewportEnabled
 * @return {Object} isViewportEnabled value
 */
ReactI13n.prototype.isViewportEnabled = function isViewportEnabled () {
    return this._isViewportEnabled;
};

/**
 * Get root i13n node
 * @method getRootI13nNode
 * @return {Object} root react i13n node
 */
ReactI13n.prototype.getRootI13nNode = function getRootI13nNode () {
    return GLOBAL_OBJECT.rootI13nNode;
};

/**
 * Update ReactI13n options
 * @method updateOptions
 * @param {Object} options
 */
ReactI13n.prototype.updateOptions = function updateOptions (options) {
    debug('updated', options);
    options = options || {};
    this._i13nNodeClass = options.i13nNodeClass ? options.i13nNodeClass : this._i13nNodeClass;
    this._isViewportEnabled = (undefined !== options.isViewportEnabled) ?
        options.isViewportEnabled : this._isViewportEnabled;
    this._rootModelData = options.rootModelData ? options.rootModelData : this._rootModelData;
};
module.exports = ReactI13n;