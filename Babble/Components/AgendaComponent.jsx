
/***
 * Presents the agenda items.
 *
 * <AgendaComponent />
 */
var AgendaComponent = React.createClass({
    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        return {};
    },
    render: function() {

        return <div id={this.componentId}></div>;
    },
    componentDidMount: function() {
        var that = this;
        $.when(Qwiery.getAgenda()).done(function(data) {
            if(data.length > 0) {
                /*
                 var r = "<div>";
                 for (var i = 0; i < data.length; i++) {
                 var item = data[i];
                 var from = parseInt(item.Start) || -1;
                 var to = parseInt(item.End) || -1;
                 r += "<br/><div>" + item.Title + "</div>";
                 if (from > -1) {
                 r += "<div>From: " + Texture.GetDateTimeString(from) + "</div>";
                 }
                 if (to > -1) {
                 r += "<div>To: " + Texture.GetDateTimeString(to) + "</div>";
                 }
                 }
                 r += "</div>";
                 $("#content" + contentId).html(r);*/
                var source = [];
                for(var i = 0; i < data.length; i++) {
                    var item = data[i];
                    var from = parseInt(item.Start) || -1;
                    var to = parseInt(item.End) || -1;
                    try {
                        if(from > 0) {
                            if(to > 0) {
                                if(to === from) {
                                    source.push({
                                        id: item.Id,
                                        start: new Date(from),
                                        end: new Date(to),
                                        isAllDay: true,
                                        title: item.Title || "No title",
                                        description: "This fella needs to work on this."
                                    });
                                }
                                else {
                                    source.push({
                                        id: item.Id,
                                        start: new Date(from),
                                        end: new Date(to),
                                        isAllDay: false,
                                        title: item.Title || "No title",
                                        description: "This fella needs to work on this."
                                    });
                                }
                            }
                            else {
                                source.push({
                                    id: item.Id,
                                    start: new Date(from),
                                    end: new Date(from),
                                    isAllDay: true,
                                    title: item.Title || "No title",
                                    description: "This fella needs to work on this."
                                });
                            }
                        }
                    }
                    catch(e) {
                    }
                }
                $("#" + that.componentId).kendoScheduler({
                    date: new Date(),
                    startTime: new Date(),
                    height: 600,
                    views: [
                        "day",
                        //"workweek"
                        "week",
                        "month",
                        {type: "agenda", selected: true}
                    ],
                    timezone: "Etc/UTC",
                    dataSource: source
                });
            }
            else {
                $("#" + that.componentId).html("<p>Your agenda is empty. You can add an appointment in various ways, for example</p><blockquote><ul>" +
                    "<li>Tomorrow I need to go shopping.</li>" +
                    "<li>Next Tuesday: leaving earlier from work</li>" +
                    "</ul></blockquote>");
            }
        }).fail(function(error) {
            UI.showError(error);
        });
    }
});
