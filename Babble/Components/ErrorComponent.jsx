
/***
 * Displays a message as an error.
 *
 * <Error error='some error message here'/>
 */
var ErrorComponent = React.createClass({
    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        this.error = this.props.error || "The 'error' attribute of the ErrorComponent was not specified.";
        return {};
    },
    render: function() {
        var err = this.props.error;
        if(Qwiery.isUndefined(err)){
            err = "Hm, there was an error somewhere but it did not reach me on time. Sorry.";
        }
        if(err.toLowerCase().indexOf("error:")===0){
            err = err.substring(6);
        }
        return <div id={this.componentId} key={this.componentId} className="alert alert-danger" role="alert"><span
            className="glyphicon glyphicon-exclamation-sign"  aria-hidden="true"></span> {err}</div>;
    }
});