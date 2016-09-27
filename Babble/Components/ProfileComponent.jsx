var ProfileComponent = React.createClass(
    {
        getInitialState: function() {
            this.componentId = Qwiery.randomId();
            return {};
        },
        componentDidUpdate: function() {
            //$('[data-toggle="popover"]').popover({
            //    trigger: 'hover',
            //    'placement': 'top'
            //});
        },
        componentDidMount: function() {
            var $personalization = $("#personalizationBlock");
            var $psy = $("#psyBlock");
            var $stats = $("#statsBlock");
            var $login = $("#loginBlock");
            var $history = $("#historyBlock");
            var $topics = $("#topicsBlock");
            var $files = $("#filesBlock");
            var $graph = $("#graphBlock");
            var $graphul = $("#graphul");
            Qwiery.getPersonalization().then(function(d) {
                if(Qwiery.isUndefined(d) || _.keys(d).length === 0) {
                    $personalization.append("<div>No personalizations recorded yet.</div>");
                } else {
                    _.forEach(d, function(v, k) {
                        $personalization.append("<div>" + k + ": " + v + "</div>");
                    })
                }
            });
            Qwiery.getPsy().then(function(d) {
                if(Qwiery.isUndefined(d) || d.length === 0) {
                    $("#psyChart").append("<div>No enough information yet to have a clear view of who you are.</div>");
                } else {
                    $("#psyChart").kendoChart({
                        title: {
                            text: "Your profile"
                        },
                        legend: {
                            visible: false
                        },
                        seriesDefaults: {
                            labels: {
                                template: "#=dataItem.Type#",
                                position: "outsideEnd",
                                visible: true,
                                background: "transparent"
                            }
                        },
                        dataSource: {
                            data: d
                        },
                        series: [{
                            type: "pie",
                            overlay: {
                                gradient: "none"
                            },
                            field: "Weight"
                        }]
                    });
                }

            });
            Qwiery.getStats().then(function(d) {
                $("#statsChart").kendoChart({
                    title: {
                        text: "You asked " + d.QuestionCount + " questions in the past 100 days"
                    },
                    legend: {
                        visible: false
                    },
                    seriesDefaults: {
                        type: "column"
                    },
                    series: [{
                        name: "Question",
                        data: d.Timeseries,
                        field: "Weight",
                        overlay: {
                            gradient: "none"
                        },
                        categoryField: "Type"
                    }]

                });
                $graphul.append("<li  class='list-group-item'> <span id='tagBadge' class='badge'>" + d.TagCount + "</span>Tags</li>");
                $graphul.append("<li  class='list-group-item'> <span id='entitiesBadge' class='badge'>" + d.NodeCount + "</span>Entities</li>");
                $graphul.append("<li  class='list-group-item'> <span id='workspacesBadge' class='badge'>" + d.WorkspaceCount + "</span>Workspaces</li>");
                $("#tagBadge").click(function() {
                    UI.ask("tags")
                });
                $("#entitiesBadge").click(function() {
                    UI.ask("entities")
                });
                $("#workspacesBadge").click(function() {
                    UI.ask("workspaces")
                });
            });
            if(Qwiery.apiKey === "Anonymous") {
                $login.append("You are using Qwiery anonymously.")
            } else {
                if(Qwiery.isDefined(UI.ticket.facebook)) {
                    $login.append("<div><strong>Facebook</strong>: <a target='_blank' href='http://www.facebook.com/" + UI.ticket.facebook.id + "'>" + UI.ticket.facebook.name + "</a> (<a href='mailto:" + UI.ticket.facebook.email + "'>" + UI.ticket.facebook.email + "</a>).</div>");
                }
                if(Qwiery.isDefined(UI.ticket.google)) {
                    $login.append("<div><strong>Google</strong>: <a target='_blank' href='" + UI.ticket.google.url + "'>" + UI.ticket.google.name + "</a>.</div>");
                }
            }


            Qwiery.getTrail().then(function(a) {
                if(Qwiery.isUndefined(a) || a.length === 0) {
                    $history.append("<div>You have not asked any questions yet!?</div>");
                } else {
                    $history.append("<div>Most recent items only, you can see your full history by clicking on the exchange badge, type 'history' or <span class='clickable' onClick='UI.ask(\"history\")'>click here</span>.</div>");
                    var $hul = $history.append("<ul></ul>");
                    _.forEach(a, function(e) {
                        $hul.append("<li><span>" + new Date(e.Timestamp).toGMTString() + ": " + e.Input + "</span></li>");
                    })
                }
            });

            Qwiery.getTopics().then(function(a) {
                if(Qwiery.isUndefined(a) || a.length === 0) {
                    $topics.append("<div>You don't have any topics yet.</div>");
                } else {
                    _.forEach(a, function(wi) {
                        $topics.append("<div>" + wi.Type + ": " + wi.Weight + "</div>");
                    })
                }
            });
            var presentFiles = function(a) {
                if(Qwiery.isUndefined(a) || a.length === 0) {
                    $files.append("<div>You have not uploaded any files yet.</div>");
                } else {
                    var $hul = $files.append("<ul></ul>");
                    _.forEach(a, function(e) {
                        var im = UI.getFileIcon(e.Title);
                        var toAppend = "<li><img style='width:15px; margin:0 5px;' src='" + im + "'/><span id=" + Qwiery.randomId() + " class='fileItem clickable'  data-nodeid='" + e.Id + "' data-title='" + e.Title + "' title='" + e.Title + "' data-type='" + e.Type + "' >" + e.Title + "</span></li>";
                        $hul.append(toAppend);
                    });
                    $(".fileItem").click(function(e) {
                        UI.entityClick(e);
                    });
                }
            };
            UI.fetch(Qwiery.getFiles(), presentFiles);

        },

        render: function() {
            return <div id={this.componentId} key={this.componentId} className="ProfileRoot">
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h3 className="panel-title">Statistics</h3>
                    </div>
                    <div id="statsBlock" className="panel-body">
                        <div id="statsChart" style={{"height":"200px"}}></div>
                    </div>
                </div>

                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h3 className="panel-title">Login</h3>
                    </div>
                    <div id="loginBlock" className="panel-body">
                    </div>
                </div>
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h3 className="panel-title">History</h3>
                    </div>
                    <div id="historyBlock" className="panel-body">

                    </div>
                </div>
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h3 className="panel-title">Personalization</h3>
                    </div>
                    <div id="personalizationBlock" className="panel-body">
                    </div>
                </div>
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h3 className="panel-title">Psychological profile</h3>
                    </div>
                    <div id="psyBlock" className="panel-body">
                        <div id="psyChart"></div>
                    </div>
                </div>
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h3 className="panel-title">Topics</h3>
                    </div>
                    <div id="topicsBlock" className="panel-body">
                    </div>
                </div>
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h3 className="panel-title">Graph</h3>
                    </div>
                    <div id="graphBlock" className="panel-body">
                        <ul id="graphul" className="list-group">

                        </ul>
                    </div>
                </div>
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h3 className="panel-title">Files</h3>
                    </div>
                    <div id="filesBlock" className="panel-body">
                    </div>
                </div>
            </div>;
        },

        askFor: null,

        raiseAskFor: function(options) {
            UI.ask(options);
        }
    }
);
