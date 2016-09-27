/***
 * Renders your data.
 */
var DataVizComponent = React.createClass({

    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        this.config = this.props.Config;
        this.type = this.props.Viz;
        return {};
    },

    render: function() {
        return <div id={this.componentId} className="DataViz"></div>
    },

    componentDidMount: function() {
        switch(this.type.toLowerCase()) {
            case "grid":
                this.renderGrid();
                break;
            case "spreadsheet":
                this.renderSpreadsheet();
                break;
            case "chart":
                this.renderChart();
                break;
            case "stock":
                this.renderStock();
                break;
            case "treemap":
                this.renderTreemap();
                break;
            case "map":
                this.renderMap();
                break;
        }
    },
    renderGrid: function() {
        $("#" + this.componentId).kendoGrid(this.config);
    },
    renderSpreadsheet: function() {
        $("#" + this.componentId).kendoSpreadsheet(this.config);
    },
    renderChart: function() {
        $("#" + this.componentId).kendoChart(this.config);
    },
    renderStock: function() {
        $("#" + this.componentId).kendoStockChart(this.config);
    },
    renderTreemap: function() {
        $("#" + this.componentId).kendoTreeMap(this.config);
        var treeMap = $("#" + this.componentId).getKendoTreeMap();
        treeMap.resize();
    },
    renderMap: function() {
        $("#" + this.componentId).kendoMap(this.config);
    }

});