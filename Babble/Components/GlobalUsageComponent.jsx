var GlobalUsageComponent = React.createClass({
    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        busy = false;
        return {};
    },
    render: function() {
        return <div id={this.componentId}></div>;
    },

    adorn: function() {
        var that = this;

        Qwiery.globalUsage()
            .then(function(data) {

                $("#" + that.componentId) .kendoChart({
                    title: {
                        text: "Global usage"
                    },
                    legend: {
                        visible: false
                    },
                    seriesDefaults: {
                        type: "column"
                    },
                    series: [{
                        name: "Question",
                        data: data,
                        field: "Weight",
                        overlay: {
                            gradient: "none"
                        },
                        categoryField: "Type"
                    }]

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
