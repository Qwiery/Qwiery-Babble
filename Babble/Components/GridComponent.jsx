
/***
 * A data grid of entities.
 */
var GridComponent = React.createClass({

    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        this.entities = this.props.entities;
        this.type = this.props.type;
        return {};
    },

    render: function() {
        return <div id={this.componentId}></div>
    },

    componentDidMount: function() {
        var cols = UI.getTypeColumns(this.type);
        $("#" + this.componentId).kendoGrid({
            dataSource: {
                data: this.entities,
                pageSize: 10
            },
            height: 500,
            columns: cols,
            pageable: true
        });
    }
});