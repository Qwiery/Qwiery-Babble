/***
 * Presents string and HTML content.
 *
 * <SimpleContentComponent
 */
var SimpleContentComponent = React.createClass({
    getInitialState: function() {
        this.componentId = Qwiery.randomId();

        return {};
    },
    render: function() {

        return <div id={this.componentId}></div>;
    },
    componentDidMount: function() {
        $("#" + this.componentId).html(UI.markdown.render(this.props.content));
    }
});
