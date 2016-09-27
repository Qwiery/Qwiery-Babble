/***
 * Displays the tags of the user.
 */
var TagsComponent = React.createClass({

        getInitialState: function() {
            this.componentId = Qwiery.randomId();
            this.tags = [];
            return {dataLoaded: false};
        },
        
        render: function() {
            if(!this.state.dataLoaded){
                return <div id={this.componentId}></div>;
            }
            var renderedTags = [];
            if(Qwiery.isUndefined(this.tags) || this.tags.length === 0) {
                renderedTags.push(<div>You don't have any tags yet.</div>);
            } else {
                var lis = [];
                for(var k = 0; k < this.tags.length; k++) {
                    var t = this.tags[k];
                    var thetitle = t.isEntity?"Entity":"Input";
                    if(t.isEntity && Qwiery.isDefined(t.type)){
                        thetitle += " [" + t.type + "]";
                    }
                    lis.push(<li key={t.Id} style={{"list-style":"none"}}><span className="glyphicon glyphicon-triangle-right"
                                                  style={{top:2, color:"grey"}}></span><a href="#" id={Qwiery.randomId()}
                                                                                          data-type={t.Type}
                                                                                          data-title={t.Title}
                                                                                          data-nodeid={t.NodeId || t.Id}
                                                                                          data-isentity="true"
                                                                                          onClick={UI.handleClick}
                                                                                          data-toggle="popover"
                                                                                          title={thetitle}
                                                                                          data-html="true"
                                                                                          data-content={t.Title}>{t.Title}</a>
                    </li>);
                }
                renderedTags.push(<ul>{lis}</ul>);
            }

            return <div id={this.componentId}>
                {renderedTags}
            </div>
        },

        componentDidMount: function() {
            var that = this;
            var $el = $("#" + this.componentId);
            var presentTags = function(tags) {
                for(var k = 0; k < tags.length; k++) {
                    var tag = tags[k];
                    that.tags.push({
                        Id: tag.Id,
                        Title: tag.Title,
                        Type: "Tag"
                    })
                }
                that.setState({dataLoaded: true});
            };

            UI.fetch(Qwiery.getTags(), presentTags);
        }
    });
