/***
 * Presents Wolfram Alpha results.
 *
 * <WolframAlphaComponent term="chromatic" />
 */
var ItemComponent = React.createClass({
    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        return {};
    },
    render: function() {
        var seq = [];
        if(Qwiery.isDefined(this.props.Title) && this.props.Title.length > 0) {
            if(Qwiery.isDefined(this.props.Url) && this.props.Url.length > 0) {
                seq.push(<div ><strong><a href={this.props.Url} target="_blank">{this.props.Title}</a></strong></div>);
            }
            else {
                seq.push(<div ><strong>{this.props.Title}</strong></div>);
            }
        }
        if(Qwiery.isDefined(this.props.Description) && this.props.Description.length > 0) {
            seq.push(<div>{this.props.Description}</div>);
        }
        if(Qwiery.isDefined(this.props.ImageSource) && this.props.ImageSource.length > 0) {
            seq.push(<img style={{width:400}} src={this.props.ImageSource}/>);
        }


        return <div id={this.componentId} className="ItemComponentItem">{seq}</div>;
    },

    componentDidMount: function() {

    }
});
