
/***
 * A component to present HTML.
 */
var HtmlComponent = React.createClass({

    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        this.html = this.props.Html;
        this.javascript = this.props.JavaScript;
        return {};
    },

    render: function() {
        return <div id={this.componentId}></div>
    },

    componentDidMount: function() {
        $("#" + this.componentId).html(this.html);
        if(Qwiery.isDefined( this.javascript)){
            eval( this.javascript);
        }
    }
});