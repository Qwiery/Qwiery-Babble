

/***
 * Presents a collection of GraphDB entities.
 */
var MultiEntityComponent = React.createClass({
    render: function() {
        return <GridComponent type={this.props.Type} entities={this.props.Entities}/>;
    }
});