/***
 * A component to present data from a REST service.
 */
var ServiceComponent = React.createClass({

    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        this.url = this.props.URL;
        this.path = this.props.Path;
        this.method = this.props.Method;
        this.data = this.props.Data;
        return {};
    },

    getData: function(definition) {
        var options = {
            method: definition.Method || 'GET',
            url: definition.URL,
            dataType: "jsonp",
            headers: {
                "Content-type": "application/json",
                "Accept": "application/json"
            },
            timeout: Qwiery.timeout
        };
        if(definition.Data) {
            options.data = _.isString(definition.Data) ? JSON.stringify({data: definition.Data}) : JSON.stringify(definition.Data);
        }
        return $.ajax(options);
    },
    render: function() {
        return <div id={this.componentId}></div>
    },

    componentDidMount: function() {
        var that = this;
        var res;
        this.getData(this.props).then(function(d) {
            if(Qwiery.isDefined(d)) {
                if(Qwiery.isDefined(that.path)) {
                    if(that.path.indexOf('.') > 0) {
                        var split = that.path.split('.');
                        while(split.length > 0) {
                            d = d[split.shift()];
                        }
                        res = d;
                    } else {
                        res = d[that.path]
                    }
                } else {
                    res = d;
                }
            } else {
                res = "The service did not return any data, sorry";
            }
            var header = "";
            if(that.props.Header) {
                header = "<h3>" + that.props.Header + "</h3>"
            }
            $("#" + that.componentId).html(header + res);
        });


    }
});