/***
 * A data grid of entities.
 */
var EntitiesComponent = React.createClass({

    getInitialState: function() {
        this.componentId = Qwiery.randomId();

        return {};
    },

    render: function() {
        return <div id={this.componentId}></div>
    },

    componentDidMount: function() {
        var that = this;
        var presentEntities = function(entities) {
            var cols = UI.getTypeColumns("IEntity");
            $("#" + that.componentId).kendoGrid({
                dataSource: {
                    data: entities,
                    pageSize: 10
                },
                height: 500,
                columns: cols,
                pageable: true
            });
        };
        UI.fetch(Qwiery.getRecentEntities(), presentEntities);
    }
});