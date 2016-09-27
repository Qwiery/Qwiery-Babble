var WikipediaComponent = React.createClass({
    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        return {};
    },
    render: function() {
        return <div id={this.componentId}></div>;
    },

    componentDidMount: function() {
        var that = this;
        var items = [];
        var container = $("#" + this.componentId);
        $.when(Qwiery.searchWikipedia(that.props.Term.trim())).then(function(data) {
            var page = data.Page;
            that.items = data.Other;
            var pageName = data.PageName;

            // for(var i = 0; i < data.length; i++) {
            //     var entity = data[i];
            //     that.items.push(<div style={{fontWeight:"bold","margin":"10px 0 5px 0"}}><a target='_blank'
            //                                                                                 style={{'textDecoration':"none"}}
            //                                                                                 href={entity.Url}>{entity.Text}</a>
            //     </div>);
            //     if(Qwiery.isDefined(entity.Description) && entity.Description.length > 0) {
            //         that.items.push(<div>{entity.Description}</div>);
            //     }
            //     if(Qwiery.isDefined(entity.ImageUrl) && entity.ImageUrl.length > 0) {
            //         that.items.push(<img style={{width:400}} src={entity.ImageUrl}/>);
            //     }
            // }

            //that.forceUpdate();
            if(Qwiery.isDefined(page)) {
                $.ajax({dataType: "jsonp", url: "https://en.wikipedia.org/w/api.php?action=query&titles=" + pageName + "&prop=pageimages&format=json&pithumbsize=500"}).then(function(r) {
                    try {
                        var imageUrl = r.query.pages[Object.keys(r.query.pages)[0]].thumbnail.source;
                        container.append("<img src='" + imageUrl + "'/>");
                    } catch(e) {

                    }
                    if(_.keys(page).length === 0) {
                        container.append("<div>Wikipedia did not respond to a request. Try again or try asking in a different way.</div>");
                    } else {
                        container.append("<ul>");

                        _.forEach(page, function(v, k) {
                            k = k.replace(/_/gi, "");
                            if(v.indexOf("plainlist") > 0) {

                            } else {
                                container.append("<li><strong>" + k + "</strong>: " + v + "</li>")
                            }
                        });
                        container.append("</ul>");
                    }

                })

            } else {
                container.html("<div>Sorry, the info could not be found.</div>")
            }
        })
    }
});