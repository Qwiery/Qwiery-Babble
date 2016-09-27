var UsersComponent = React.createClass({
    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        this
        busy = false;
        return {};
    },
    render: function() {
        return <div id={this.componentId}></div>;
    },
    deleteUser: function(e) {
        var that = this;
        if(this.busy)return;
        this.busy = true;
        e.preventDefault();
        var gridObject = $("#" + this.componentId).getKendoGrid();
        var dataItem = gridObject.dataItem($(e.currentTarget).closest("tr"));
        var userId = dataItem.Id;
        var goAhead = confirm("Are you sure?");
        if(goAhead) {
            Qwiery.deleteUser(userId).then(function(d) {
                that.setState({});
            });
        }
        this.busy = false;
    },
    adorn: function() {
        var that = this;
        var grid = $("#" + this.componentId).getKendoGrid();
        if(Qwiery.isDefined(grid)){
            grid.destroy();
            $("#" + this.componentId).empty();
        }
        Qwiery.getAllUsers()
            .then(function(data) {

                $("#" + that.componentId).kendoGrid({
                    dataSource: {
                        data: data,
                        pageSize: 10
                    },
                    columns: [
                        {field: "UserId", title: "User Id", width: "130px"},
                        {field: "CreationDate", title: "Created", width: "130px"},
                        {command: {text: "Delete", click: that.deleteUser}, title: " ", width: "140px"}
                    ],
                    pageable: true
                    // dataBinding: function () { record = (this.dataSource.page() - 1) * this.dataSource.pageSize() - 1; }
                });

            }).fail(function(error) {
            $("#content" + that.componentId).html(error);

        });
    },
    componentDidUpdate: function() {
        this.adorn();
    },
    componentDidMount: function() {
        this.adorn();
    }

});
