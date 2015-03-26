/* global document, React */

'use strict';

var container = document.getElementById('container');

var RapidDemo = React.createClass({displayName: "RapidDemo",
    render: function () {
        return (
            React.createElement(Rapid, null)
        );
    }
});

var Demo = React.render(React.createElement(RapidDemo, null), container);
