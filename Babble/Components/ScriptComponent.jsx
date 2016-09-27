/***
 * A component which executes the given script.
 * For instance:
 *
 * {
	"Answer": {
		"DataType": "Script",
		"Script": "UI.injectFlickr"
	}
    }
 */
var ScriptComponent = React.createClass({

    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        return {};
    },

    render: function() {
        return <div id={this.componentId}></div>
    },

    componentDidMount: function() {
        var that = this;
        eval(this.props.Script)(this.componentId);
    }
});