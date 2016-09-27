var HistoryComponent = React.createClass(
    {
        getInitialState: function() {
            this.componentId = Qwiery.randomId();
            return {};
        },
        componentDidUpdate: function() {
        },
        componentDidMount: function() {
            var $history = $("#" + this.componentId);
            var that = this;
            Qwiery.getHistory().then(function(data) {


                if(Qwiery.isUndefined(data) || data.length === 0) {
                    $history.append("<div>You have not asked any questions yet!?</div>");
                } else {
                    var mapped = _.map(data, function(e) {
                        return {
                            timestamp: new Date(e.Timestamp).toLocaleString(),
                            question: e.Input,
                            id: e.CorrelationId
                        };
                    });
                    $("#" + that.componentId).kendoGrid({
                        dataSource: {
                            data: mapped,
                            pageSize: 10
                        },
                        sortable: {
                            mode: "single",
                            allowUnsort: true
                        },
                        columns: [
                            {field: "timestamp", title: "When"},
                            {field: "question", title: "What"}
                        ],
                        detailTemplate: "<div id='bucket'></div>",
                        detailInit: that.detailInit,
                        pageable: true
                        // dataBinding: function () { record = (this.dataSource.page() - 1) * this.dataSource.pageSize() - 1; }
                    });
                }
            });
        },
        detailInit: function(e) {
            var detailRow = e.detailRow;
            var bucket = detailRow.find("#bucket");
            var id = e.data.id;
            if(Qwiery.isUndefined(id)) {
                throw "Ouch, the id is not available."
            }
            Qwiery.getHistoryItem(id).then(function(details) {
                var e = details;
                if(_.isString(e)) { // mock backend is JSON, remote is string
                    e = JSON.parse(e);
                }
                var trace = "";
                var oracleTraceItem = _.find(e.Trace, function(u) {
                    return u.Oracle !== undefined;
                });
                if(Qwiery.isDefined(oracleTraceItem) && oracleTraceItem.Oracle.length > 0) {
                    var stack = oracleTraceItem.Oracle;
                    trace += "<ul>";
                    for(var k = 0; k < stack.length; k++) {
                        var item = stack[k];
                        trace += "<li><strong>" + item.Head + "</strong>: " + item.Grab;
                        trace += "</li>";
                    }
                    trace += "</ul>";
                } else {
                    trace = "None received";
                }
                var errorTraceItems = _.filter(e.Trace, function(u) {
                    return u.Error !== undefined;
                });
                var html = "<div><strong>Exchange:</strong> " + e.ExchangeId + "</div>" +
                    "<div><strong>Input:</strong> " + e.Input.Raw + " &raquo; <span class='clickable' onClick='UI.ask(\"" + e.Input.Raw + "\")'>ask again</span></div>" +
                    "<div><strong>When:</strong> " + new Date(e.Input.Timestamp).toLocaleString() + "</div>" +
                    "<div><strong>CorrelationId:</strong> " + id + "</div>" +
                    "<div><strong>Answer type:</strong> " + e.Output.Answer[0].DataType + "</div>" +
                    "<div><strong>Processing errors:</strong> " + (errorTraceItems.length ) + "</div>" +
                    "<div><strong>Trace:</strong> " + trace + "</div>";

                bucket.append(html);
            });


        },
        render: function() {
            return <div id={this.componentId} key={this.componentId} className="ProfileRoot">
            </div>;
        },

        askFor: null,

        raiseAskFor: function(options) {
            UI.ask(options)
        }
    }
);