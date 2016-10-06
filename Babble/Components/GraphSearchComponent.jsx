

var GraphSearchComponent = React.createClass({
    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        return {};
    },
    render: function() {
        return <div id={this.componentId}></div>;
    },
    componentDidMount: function() {
        var that = this;
        $.when(Qwiery.searchGraph(this.props.Term, this.props.EntityDataType))
            .then(function(data) {
                var cols = UI.getTypeColumns("SimpleSearchResult");
                $("#" + that.componentId).kendoGrid({
                    dataSource: {
                        data: data,
                        pageSize: 10
                    },
                    columns: cols,
                    pageable: true,
                    // dataBinding: function () { record = (this.dataSource.page() - 1) * this.dataSource.pageSize() - 1; }
                });

            }).fail(function(error) {
                $("#content" + that.componentId).html(error);

            });
    }

});
