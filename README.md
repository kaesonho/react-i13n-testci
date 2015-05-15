# react-i13n
[![ynpm](http://ynpm-search.corp.yahoo.com/-/icon/react-i13n/latest)](http://ynpm-search.corp.yahoo.com/-/package/react-i13n) [![Build Status](http://api.screwdriver.corp.yahoo.com:4080/badge/36725/component/icon)](http://api.screwdriver.corp.yahoo.com:4080/badge/36725/component/target)

React I13n provides a performant and scalable approach to instrumentation.

In most cases, you have to manage the `instrumentation model data` you want and send out beacons separately, by using `react-i13n`, you have a better way to manage beacons with an inheritance architecture.

Also, if you want to track a link click, you will not have to hook the click event and send out event beacon. We provide React components to handle this for you, all you need to do is define the data model you want to beacon out.

## Main Ideas
It's originated from [fastbreak/crossover](https://git.corp.yahoo.com/fastbreak/crossover/blob/master/docs/INSTRUMENTATION.md), ([slide](http://www.slideshare.net/RafaelMartins21/instrumentation-talk-39547608)).

`react-i13n` utilizes the life cycle events provided by `React` to build an i13n tree that mirrors the React component hierarchy. This approach optimizes for performance by reducing the need to scrape the DOM for data before beaconing.

`react-i13n` is pluggable to integrate any data analytics library into the same tree architecture. All that is needed is to implement the plugin and the handler functions which integrate with the libraries transport functions.

### I13n Tree
![Instrumentation Tree](https://git.corp.yahoo.com/github-enterprise-assets/0000/1644/0003/9712/5811235c-f2b1-11e4-9692-becb91d7336d.png)
* `react-i13n` build the `I13n Tree` with `context` and life cycle event `componentWillMount`, we could define the `i13nModel` data we need. Which means we don't need addtional DOM manipulation when we want to get `i13nModel` values for sending out linkview/click beacon.
* `i13nModel` could be a plain object or a dynamic function with a proper `i13nModel` object return, which means we could dynamically change `i13nModel` data without causing rerender due to the `props` changes.
* Whenever we want to get the `i13nModel` for certain node, it traverses back to the root and merge all the `i13nModel` information in the path. Since the tree is already built and we don't need extra DOM access, it should be pretty cheap and efficient. 

### I13n Node
* The node in i13n Tree, it will be passed with the `payload` to the handler function, it provides APIs for users to get the informations needed for beaconing.
* `i13nNode.getModel` - get the i13nModel data of the node.
* `i13nNode.getMergedModel` - get the model data which is traversed and combined to the root.
* `i13nNode.getPosition` - get the position of its parent.
* `i13nNode.getText` - get the inner text value of that node.
* `i13nNode.isTraversed` - get is traversed or not.
* `i13nNode.isInViewport` - get is in viewport or not, if we didn't enable viewport checking, it will always be true
* `i13nNode.traverseNodes` - recursively traverse the nodes and users could pass handler into the function to do what they need, like gathering links.

### Isomorphic
All the components we provide are harmony with both server side and client side, If you are using isomorphic framework to build your app, you could get some events e.g., `pageview` on both server and client side, which means you could select a prefer way to handle the event. 

### Viewport Checking
We integrate the viewport checking and set the status in each `I13nNode`, it could be used to know if you want to send out the data only when node is in viewport.

## Install
```
ynpm install react-i13n
```

## Usage

### Init ReactI13n
We provide `setupI13n` as a convenient `higher order function` to setup the ReactI13n, you will need to pass your `top level component`, `options`, and `plugins` into. It takes care of creating a `ReactI13n` instance and setup the plugins. Just use the function to create a component then render it.
* `Component` - the top level component
* `options` - the options passed into ReactI13n
* `options.rootModelData` - defined the `i13nModel` data of the root.
* `options.I13nNodeClass` - you can inherit the `I13nNode` and add the functionality you need, just pass the class.
* `options.isViewportEnabled` - define if you want to enable the viewport checking.
* `plugins` - plugins array that you defined according to the definition below.

### Implement the plugin.
A valid plugin must contains
* `name` - the plugin name
* `eventHandlers` - handlers functions for the events, typically in the eventHandler function we would send out a tracking beacon, now `react-i13n` has `click`, `created` and `enterViewport`, you can define the events you need and implement the handlers function, e.g., `pageview`.
    * `click` - happens when user click a `I13nComponent` with `ClickHandler`
    * `created` - happens when the `I13nComponent` is created
    * `enterViewport` - happens when the `isViewportEnabled` is true and the node enter the viewport

All the `eventHandler` would receive a `payload` object and a `callback` function, in payload you will get:
* `payload.I13nNode` - the I13n node related to the event, then you could use the APIs provided by `I13nNode` to get the information you need.
* `payload.env` - `server` or `client`, some events e.g., `pageview` will fire on both server and client side, you can define the prefer way you want to handle the beacon.

```js
var React = require('react/addons');
var ReactI13n = require('react-i13n').ReactI13n;
var setupI13n = require('react-i13n').setupI13n;
// define the plugin
var gaPlugin = {
    name: 'ga',
    eventHandlers: {
        click: function (payload, callback) {
            // click handlers
        },
        event: function (payload, callback) {
            // event handlers
        },
        pageview: function (payload, callback) {
            if ('client' === payload.env) {
                // client side pageview handlers
            } else {
                // server side pageview handlers
            }
        },
        created: function (payload, callback) {
            // created handlers
        }
    }
};

var DemoApp = React.createClass({
    componentWillMount: function () {
        // you could fire page view in componentWillMount, which means you could get a pv event on both server and client side, 
        // then you could choose how to handle it.
        ReactI13n.getInstance().execute('pageview', {});
    }
});

var I13nDempApp = setupI13n(DemoApp, options, [gaPlugin]);
// then you could use I13nDemoApp to render you app
```

### I13nMixin and createI13nNode
Everything is done by i13n mixin, which means if we want to create an component to be an `I13nNode`, we will have to add the `I13nMixin` into the component.
We also provide `createI13nNode` as a `higher order function` for you to wrap your component as an `I13nNode`

```js
var I13nMixin = require('react-i13n').I13nMixin;
var Foo = React.createClass({
    mixins: [I13nMixin]
    ...
});

// in template
<Foo i13nModel={i13nModel}>
    // will create a i13n node for Foo
    ...
</Foo>
```

```js
var createI13nNode = require('react-i13n').createI13nNode;
var Foo = React.createClass({
    ...
});
var I13nFoo = createI13nNode(Foo);
// in template
<I13nFoo i13nModel={i13nModel}>
    // will create a i13n node for Foo
    ...
</I13nFoo>
```

### I13nComponent
Instead of adding `mixin` everywhere, we provide `I13nComponent` for you to add an additional level to pass `i13nModel` data.
* Please not that since we integrate the feature of `parent-based context`, with `dev` env, react will generate warning like

```js
Warning: owner-based and parent-based contexts differ (values: [object Object] vs [object Object]) for key (parentI13nNode) while mounting I13nAnchor (see: http://fb.me/react-context-by-parent)
```

* This feature can only used after `react-0.13`, if you are using older version, you will have to create a component by your own and add the [I13nMixin](#13n-mixin).


```js
var I13nComponent = require('react-i13n').I13nComponent;

// in template
<I13nComponent i13nModel={i13nModel}>
    <div>
        // the component inside would become the child node of I13nComponent
    </div>
</I13nComponent>
```

You can pass `component` into `I13nComponent`, it can be a tag name or a Component.

```js
var I13nComponent = require('react-i13n').I13nComponent;

// in template
<I13nComponent component='div' i13nModel={i13nModel}> // I13nComponent will also create a div if you define the component
    <div>
        // the component inside would become the child node of I13nComponent
    </div>
</I13nComponent>
```

We are also able to pass i13nModel as a function to get dynamical generated data.

```js
var I13nComponent = require('react-i13n').I13nComponent;

function getI13nModel: function () {
    return {
        // you can dynamical generate i13nModel data here based on the use case
    };
}

// in template
<I13nComponent component='div' i13nModel={getI13nModel}>
    <div>
        // the component inside would become the child node of I13nComponent
    </div>
</I13nComponent>
```

* `component` - the component to be rendered, we could either pass a string of native tag or React Component
* `i13nModel` - the i13nModel data object or a dynamic function returns the data object
* `isLeafNode` - define if it's a leaf node or not, we will fire `created` event for every node when it's created, `isLeafNode` will help us to know if we want to do the action. e.g, we might only want to send out beacons to record for the links. 
* `bindClickEvent` - define if want to bind a click handler or not
* `follow` - define if click handler need to redirect users to destination after sending beacon or not. You could set `follow=false` and the handler would send out beacon but will not redirect users.
* you can pass all the props you need, we will pass them to the component

```js
var I13nComponent = require('react-i13n').I13nComponent;

// in template, then the click handler would fire the click event without redirect users to the destination
<I13nComponent component='ul' i13nModel={i13nModel} isLeafNode={false} bindClickEvent={true}> follow={false}>
    // if the ul or any item in it is clicked, it would fire a click event
</I13nComponent>
```

For common usage, we define some components with specific setting, we can require them without duplicated `props`. These setting can be overwritten by `props`.

| Component | isLeafNode | bindClickEvent | follow |
| --------- | ---------- | -------------- | -------- |
| **I13nAnchor** | true | true | true |
| **I13nButton** | true | true | true |
| **I13nDiv** | false | false | false |

```js
var I13nAnchor = require('react-i13n').I13nAnchor

// use a tag like a normal a tag, you can even setup the click event and it will work with the click beacon sending.
<I13nAnchor href={herf} i13nModel={i13nModel} onClick={someClickHandler}>
    ... 
</I13nAnchor>
```

### Fire events
`react-i13n` automatically fire `click` and `updated` events, you can also fire other events via `reactI13n.execute`, just make sure you have proper event handler implemented.
* `eventName` - the event name
* `payload` - the payload object you want to pass into the event handler
* `callback` - the callback function after event is executed

```js
var ReactI13n = require('react-i13n').ReactI13n;
ReactI13n.getInstance().execute('pageview', {payload}, function callback () {
    // 
});
```

## Test

### Unit

`grunt test`

### Functional

Locally, via Chrome only:

`grunt functional`

On the selenium grid against a full suite of browsers:

`grunt functional-grid`

### Meeting Notes
https://git.corp.yahoo.com/gist/kaesonho/292016793f2d7f16e770
