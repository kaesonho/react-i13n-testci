/* global document, React */

'use strict';

function getJsonFromUrl() {
    var query = location.search.substr(1);
    var result = {};
    var parts = query.split("&");
    var i = 0;
    var length = parts.length;
    for (i; i < length; i ++ ) {
        var item = parts[i].split("=");
        result[item[0]] = decodeURIComponent(item[1]);
    }
    return result;
}

var container = document.getElementById('container');
var itemsNumber = getJsonFromUrl().items || 1;



var I13nComponentLevel1 = React.createClass({
    render: function () {
        var links = [];
        for (var i = 0; i < itemsNumber; i++) {
            var linkText = 'Button Level1 ' + i;
            var linkSec = 'level1-' + i
            links.push(
                <div className="P(4px) M(4px) Bgc(#ececec)" key={i}>
                </div>
            );
        }
        var getModelData = function () {
            return {
                sec: 'dynamical-generated'
            };
        };
        return (
            <div className="P(4px) M(4px) Bgc(#d9edf7) I13nComponentLevel1">
                Level 1 Links
                <div className="P(4px) M(4px) Bgc(#ececec) NormalLink">
                    <I13nAnchor className="NormalLink" model={{sec:'foo'}} follow={false} href="./mock-destination-page.html">NormalLink</I13nAnchor>
                </div>
                <div className="P(4px) M(4px) Bgc(#ececec) NormalLinkWithFunctionModel">
                    <I13nAnchor model={getModelData} follow={false} href="./mock-destination-page.html">NormalLinkWithFunctionModel</I13nAnchor>
                </div>
                <div className="P(4px) M(4px) Bgc(#ececec) LinkWithHashUrl">
                    <I13nAnchor model={{sec:'foo'}} href="#">LinkWithHashUrl</I13nAnchor>
                </div>
                <div className="P(4px) M(4px) Bgc(#ececec) NormalLinkWithFollow">
                    <I13nAnchor model={{sec:'foo'}} href="./mock-destination-page.html">NormalLinkWithFollow</I13nAnchor>
                </div>
                <div className="P(4px) M(4px) Bgc(#ececec) NormalButton">
                    <form action="/mock-destination-page.html">
                        <input type="text" name="fname"></input>
                        <I13nButton model={{sec:linkSec}} href="./mock-destination-page.html">NormalButton</I13nButton>
                    </form>
                </div>
                {links}
                <I13nComponentLevel2Hidden model={{sec:'hidden'}}/>
                <I13nComponentLevel2 model={{sec: 'level2'}}/>
                <I13nComponent className="NestTestI13nComponentLevel1" model={{vl1:'foo', vl3_ovr:'foo'}}>
                    <div>
                        <I13nComponent className="NestTestI13nComponentLevel2" model={{vl2:'bar'}}>
                            <div>
                                <I13nAnchor className="NestTestI13nComponentLevel3" follow={false} model={{vl3:'baz', vl3_ovr:'baz'}}>NestTestI13nComponentLevel3</I13nAnchor>
                            </div>
                        </I13nComponent>
                    </div>
                </I13nComponent>
            </div>
        );
    }
});

I13nComponentLevel1 = createI13nNode(I13nComponentLevel1);

var I13nComponentLevel2 = React.createClass({
    render: function () {
        var links = [];
        for (var i = 0; i < itemsNumber; i++) {
            var linkText = 'Link Level2 ' + i;
            var linkSec = 'level2-' + i
            links.push(
                <div className="P(4px) M(4px) Bgc(#ececec)" key={i}>
                    <I13nAnchor model={{sec:linkSec, lv2: 'foo'}} follow={false} href="https://yahoo.com">{linkText}</I13nAnchor>
                </div>
            );
        }
        return (
            <div className="P(4px) M(4px) Bgc(#fcf8e3) I13nComponentLevel2">
                Level 2 Links
                {links}
            </div>
        );
    }
});

I13nComponentLevel2 = createI13nNode(I13nComponentLevel2);

var I13nComponentLevel2Hidden = React.createClass({
    getInitialState: function () {
        return {
            expend: false
        };
    },
    clickHandler: function (e) {
        this.setState({expend: true});
    },
    render: function () {
        var links = [];
        if (this.state.expend) {
            for (var i = 0; i < itemsNumber; i++) {
                var linkText = 'Link Level2 Hidden ' + i;
                links.push(
                    <div className="P(4px) M(4px) Bgc(#ececec)" key={i}>
                        <I13nAnchor href="/mock-destination-page.html">{linkText}</I13nAnchor>
                    </div>
                );
            }
        }
        return (
            <div className="P(4px) M(4px) Bgc(#fcf8e3) I13nComponentLevel2Hidden">
                <I13nDiv className="HiddenBtn" onClick={this.clickHandler} bindClickEvent={true} model={{sec:'hidden-btn'}}>Show Hidden Links</I13nDiv>
                {links}
            </div>
        );
    }
});

I13nComponentLevel2Hidden = createI13nNode(I13nComponentLevel2Hidden);

var I13nDemo = React.createClass({
    componentWillMount: function () {
        ReactI13n.getInstance().execute('pageview', {});
    },
    render: function () {
        return (
            <I13nComponentLevel1 model={{sec:'level1'}}/>
        );
    }
});

window.firedEvents = [];

var testPlugin = {
    name: 'test',
    eventHandlers: {
        click: function (payload, callback) {
            // click handlers
            window.firedEvents.push({
                name: 'click',
                model: payload.i13nNode.getMergedModel(),
                text: payload.i13nNode.getText(),
                position: payload.i13nNode.getPosition()
            });
            callback();
        },
        event: function (payload, callback) {
            // event handlers
            window.firedEvents.push({
                name: 'event'
            });
            callback();
        },
        pageview: function (payload, callback) {
            if ('client' === payload.env) {
                // client side pageview handlers
                window.firedEvents.push({
                    name: 'pageview'
                });
            } else {
                // server side pageview handlers
            }
            callback();
        },
        created: function (payload, callback) {
            // updated handlers
            window.firedEvents.push({
                name: 'created'
            });
            callback();
        }
    }
};

I13nDemo = setupI13n(I13nDemo,
    {
        isViewportEnabled: true,
        rootModelData: {
            sec: 'default-section-name',
            page: 'test-page'
        }
    },
    [testPlugin]
);

var Demo = React.render(<I13nDemo />, container);
