/* global document, React */

'use strict';

var container = document.getElementById('container');

var RapidDemo = React.createClass({
    render: function () {
        return (
            <Rapid />
        );
    }
});

var Demo = React.render(<RapidDemo />, container);
