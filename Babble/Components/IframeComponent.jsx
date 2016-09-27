/***
 * A component to present an iframe.
 */
var IframeComponent = React.createClass({

    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        this.url = this.props.URL;
        return {};
    },

    render: function() {
        return <div id={this.componentId}></div>
    },

    componentDidMount: function() {
        var html = "<iframe ";
        if(this.props.Width) {
            html += "width=\"" + this.props.Width + "\"";
        }
        if(this.props.Height) {
            html += "height=\"" + this.props.Height + "\"";
        }
        html += "src=\"" + this.url + "\"></iframe>";
        $("#" + this.componentId).html(html);
    }
});