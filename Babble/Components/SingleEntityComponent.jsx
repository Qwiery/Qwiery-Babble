/***
 * Presents or edit an entity.
 * var item = {
        "Id": "acee7a14-0750-43be-98d3-926239a8a7a4",
        "IsList": false,
        "Type": "Thought",
        "Title": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus a mauris mollis, pellentesque metus nec, fermentum nunc. ",
    }
 * <SingleEntityComponent entity=item mode="edit|read|deleted"/>
 */
var SingleEntityComponent = React.createClass({

    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        this.contentId = Qwiery.randomId();
        this.relatedId = Qwiery.randomId();
        this.entity = this.props.entity;

        var mode = (this.props.mode || "read").toLowerCase();
        if(mode !== "read" && mode !== "edit" && mode !== "deleted") {
            this.error = "The 'mode' attribute can only be 'read', 'deleted' or 'edit'.";
            return {mode: "error"};
        }
        this.related = null;
        this.isFavorite = false;
        this.relatedNodes = [];
        this.relatedTags = [];
        if(Qwiery.isUndefined(this.entity)) {
            this.error = "No 'entity' attribute specified.";
            return {mode: "error"};
        }
        this.type = this.entity.DataType;

        this.hasRelatedItems = false;
        UI.onRefreshCurrentRequest = this.refresh;
        return {
            mode: mode,
            refreshRelated: true
        };
    },
    refresh: function() {
        this.hasRelatedItems = false;
        this.setState({
            mode: "read",
            refreshRelated: true
        });
    },
    /***
     * Switches the component to edit mode.
     */
    editEntity: function() {
        if(this.entity.UserId === UI.ticket.id) {
            this.setState({mode: "edit"});
        } else {
            UI.showError("You don't own this entity and hence can't edit it.");
        }

    },

    /***
     * Makes the current entity a favorite one.
     */
    toggleFavoriteEntity: function() {
        var that = this;
        if(this.isFavorite) {
            Qwiery.unFavorite(this.entity.Id).then(function() {
                UI.elementsComponent.removeFavorite(that.entity.Id);
                that.setState({mode: "read"});
            });
        } else {
            Qwiery.makeFavorite(this.entity.Id).then(function() {
                UI.elementsComponent.addFavorite({
                    Title: that.entity.Title,
                    Id: that.entity.Id,
                    IsEntity: true,
                    Type: "Entity"
                });
                that.setState({mode: "read"});
            });
        }


    },

    /***
     * Deletes the entity.
     */
    deleteEntity: function() {
        var id = this.entity.Id;
        var that = this;
        if(Qwiery.isUndefined(id)) {
            alert("This shouldn't happen; there is no entity id in the box...");
            return;
        }
        var goAhead = confirm("Are you sure?");
        if(goAhead) {
            $.when(Qwiery.deleteEntity(id)).then(function(data) {
                if(data == true) {
                    that.setState({
                        mode: "deleted",
                        refreshRelated: false
                    })
                }
                else {
                    that.error = "Failed to delete the entity.";
                    that.setState({
                        mode: "error",
                        refreshRelated: false
                    })
                }
            }).fail(function(error) {
                that.error = error;
                that.setState({
                    mode: "error",
                    refreshRelated: false
                })
            });
        }

    },
    /***
     * Shows a message.
     * @param msg
     */
    showMessage: function(msg) {
        //$("#Feedback").show();
        //$("#Feedback").html(msg);
        //setTimeout(function() {
        //    $("#Feedback").hide();
        //}, 2000);
    },

    /***
     * Re-fetches the entity from the id that the component current presents.
     * @returns {*} A promise.
     */
    fetchEntity: function() {
        var id = this.entity.Id;
        return Qwiery.getEntity(id);
    },

    /***
     * Called when the child notifies that editing is done.
     *
     * @param obj {refresh: true|false, message: ""}
     */
    childFinishedEditing: function(obj) {
        var that = this;
        var state = {
            mode: "read",
            refreshRelated: true
        };
        if(obj.entity) {
            state.entity = obj.entity;
            this.entity = state.entity;
        } else {
            state.entity = that.entity;
        }
        if(Qwiery.isUndefined(obj)) {
            $.when(this.fetchEntity()).then(function(d) {
                state.entity = d;
                that.entity = d;
                that.setState(state);
            });
        } else {
            var refresh = Qwiery.isUndefined(obj.refresh) ? true : obj.refresh;
            var message = obj.message || "";
            if(refresh) {
                $.when(this.fetchEntity()).then(function(d) {
                    that.entity = d;
                    that.setState(state);
                    that.showMessage(message);
                });
            } else {
                that.setState(state);
                that.showMessage(message);
            }

        }
        UI.refreshGraphSummary();

    },
    getReader: function() {
        var smallButton = {
            padding: 2, fontSize: 10,
            borderRadius: 0,
            outline: "none"
        };
        var reader = null;
        switch(this.type) {
            case "Thought":
                reader = <ThoughtComponent mode="read" entity={this.entity}/>;
                break;
            case "Image":
                reader = <ImageComponent mode="read" entity={this.entity}/>;
                break;
            case "Document":
                reader = <DocumentComponent mode="read" entity={this.entity}/>;
                break;
            case "Person":
                reader = <div>The Person reader here</div>;
                break;
            case "Address":
                reader = <div>The Address reader here</div>;
                break;
            case "Task":
                reader = <TaskComponent mode="read" entity={this.entity}/>;
                break;
            case "Video":
                reader = <VideoComponent mode="read" entity={this.entity}/>;
                break;
            default:
                reader = <div>The reader component for {this.type} is not available yet.</div>;
        }
        var relatedContent = <div className="well" id="dropContainer">Dragdrop other entities, files or images into this
            zone to link related items.</div>;
        if(this.hasRelatedItems) {
            relatedContent = <div className="panel panel-default">
                <div className="panel-heading">Related</div>
                <div className="panel-body" id="dropContainer">
                    <div id={this.relatedId} className='Card' style={{minHeight:10}}>{this.related}</div>
                </div>
            </div>;
        }
        return <div id={this.componentId} key={this.componentId}>
            <div id="Feedback" key="Feedback"
                 style={{float:"left", marginLeft: 10, marginTop: 2, color: "limegreen"}}></div>
            <div className="btn-group" style={{"float":"left", "margin":"0 0 0 -10px"}}>
                <button className="btn" style={smallButton} title='Toggle whether this is a favorite entity'
                        onClick={this.toggleFavoriteEntity}><span
                    className="glyphicon glyphicon-star" id="favstar"></span></button>
            </div>
            <div className="btn-group" style={{float:"right"}}>
                <button className="btn" style={smallButton} title='Delete this entity'
                        onClick={this.deleteEntity}><span
                    className="glyphicon glyphicon-remove"></span></button>
                <button className="btn" style={smallButton} title='Edit this entity'
                        onClick={this.editEntity}><span
                    className="glyphicon glyphicon-edit"></span></button>

            </div>
            <div className="well">
                {reader}
            </div>

            <div className="dropzone" data-targetid={this.entity.Id}>
                {relatedContent}
            </div>

        </div>;
    },
    getEditor: function() {
        var editor = null;
        switch(this.type) {
            case "Thought":
                editor = <div id={this.componentId} key={this.componentId}>
                    <div className="well">
                        <ThoughtComponent mode="edit" entity={this.entity}
                                          finishedEditing={this.childFinishedEditing}/>
                    </div>
                </div>;
                break;
            case "Image":
                editor = <div id={this.componentId} key={this.componentId}>
                    <div className="well">
                        <ImageComponent mode="edit" entity={this.entity}
                                        finishedEditing={this.childFinishedEditing}/>
                    </div>
                </div>;
                break;
            case "Task":
                editor = <div id={this.componentId} key={this.componentId}>
                    <div className="well">
                        <TaskComponent mode="edit" entity={this.entity}
                                       finishedEditing={this.childFinishedEditing}/>
                    </div>
                </div>;
                break;
            default:
                editor = <div>This type of editing component is not available yet.</div>;
        }
        return editor;
    },

    render: function() {
        if(this.state.mode === "error") {
            return <div id={this.componentId} key={this.componentId} className="alert alert-danger" role="alert"><span
                className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> {this.error}</div>;
        }
        else if(this.state.mode === "deleted") {
            return <div id={this.componentId} key={this.componentId}>
                <div className="well"><span
                    className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> This entity was deleted.
                </div>
            </div>;
        }
        else if(this.state.mode === "read") {
            return this.getReader();
        }
        else if(this.state.mode === "edit") {
            return this.getEditor();
        }
    },


    breakRelation: function(e) {
        e.preventDefault();
        var elem = $(e.target);
        var data = elem.data();
        if(data.tag) {
            var tagName = data.title;
            $.when(Qwiery.untagEntity(data.id, data.title)).then(function() {
                UI.refreshCurrent();
            });
        } else {
            var to = data.to;
            var from = data.from;
            $.when(Qwiery.unlinkEntities(from, to)).then(function() {
                UI.refreshCurrent();
            });
        }

    },
    /***
     * Calls the askFor() if defined by the parent.
     */
    raiseAskFor: function(options) {
        if(Qwiery.isDefined(this.props.askFor)) {
            if(Qwiery.isDefined(options.Id))
                this.props.askFor("get: " + options.Id);
            else
                this.props.askFor(options.title);
        }
    },
    insertRelated: function() {
        if(!this.state.refreshRelated) return;
        var that = this;
        var fileNodes = _.filter(that.relatedNodes, function(t) {
            return t.DataType === "Image" || t.DataType === "Document"
        });
        var otherNodes = _.filter(that.relatedNodes, function(t) {
            return t.DataType !== "Image" && t.DataType !== "Document"
        });
        otherNodes = otherNodes.concat(that.relatedTags);

        var documents = _.map(fileNodes, function(t) {
            var itemId = "related_" + t.Id;
            var title = t.Title;

            if(t.DataType === "Image") {
                t.Type = "Entity";
                return <div className="relatedLink" style={{float:"left"}}><img id={itemId} data-nodeid={t.Id}
                                                                                data-type={t.Type}
                                                                                className="draggable"
                                                                                data-title={t.Title} title={t.Title}
                                                                                onClick={function(){
                                                                                UI.ask({
                                                                                        type: "Entity",
                                                                                        id: t.Id,
                                                                                        title: t.Title,
                                                                                        isEntity: true
                                                                                    })
                                                                                } }
                                                                                style={{maxWidth:150, maxHeight:150, cursor:"pointer", verticalAlign: "top", padding:5}}
                                                                                src={Qwiery.serviceURL + "/uploads/" + t.Source}/><span
                    className="glyphicon glyphicon-remove imageDeleter" title="Remove this related item"
                    onClick={that.breakRelation} data-to={t.Id} data-from={that.entity.Id} data-tag="false"></span>
                </div>;
            } else if(t.DataType === "Document") {
                t.Type = "Entity";
                var source = UI.getFileIcon(t.Title);
                return <div className="relatedLink" style={{float:"left"}}><img id={itemId} data-nodeid={t.Id}
                                                                                data-type={t.Type}
                                                                                className="draggable"
                                                                                data-title={t.Title} title={t.Title}
                                                                                onClick={function(){
                                                                                UI.ask({
                                                                                        type: "Entity",
                                                                                        id: t.Id,
                                                                                        title: t.Title,
                                                                                        isEntity: true
                                                                                    })
                                                                                } }
                                                                                style={{maxWidth:150, maxHeight:150, cursor:"pointer", verticalAlign: "top", padding:5}}
                                                                                src={source}/><span
                    className="glyphicon glyphicon-remove imageDeleter" title="Remove this related item"
                    onClick={that.breakRelation} data-to={t.Id} data-from={that.entity.Id} data-tag="false"></span>
                </div>;
            }

        });
        var links = _.map(otherNodes, function(t) {
            var itemId = "related_" + t.Title;
            var title = t.Title;

            if(t.DataType !== "Image" && t.DataType !== "Document") {
                if(t.DataType === "Tag") {
                    return <li key={Qwiery.randomId()} className="relatedLink">
                        <div><span id={itemId} data-nodeid={t.Id} data-type="Tag" data-isentity="true"
                                   className="draggable" data-title={t.Title}
                                   onClick={UI.handleClick}>{title}</span><span
                            className="glyphicon glyphicon-remove textDeleter" title="Remove this related item"
                            onClick={that.breakRelation} data-id={that.entity.Id} data-tag="true"
                            data-title={t.Title}></span>
                        </div>
                    </li>;
                } else {
                    return <li key={Qwiery.randomId()} className="relatedLink">
                        <div><span id={itemId} data-nodeid={t.Id} data-type={t.DataType} data-isentity="true"
                                   className="draggable" data-title={t.Title}
                                   onClick={UI.handleClick}>{title}</span><span
                            className="glyphicon glyphicon-remove textDeleter" title="Remove this related item"
                            onClick={that.breakRelation} data-to={t.Id} data-from={that.entity.Id}
                            data-tag="false"></span>
                        </div>
                    </li>;
                }

            }
        });

        // add automatically the tags main link for corresponding type
        switch(this.type.toLowerCase()) {
            case "thought":
                links.push(<li key={Qwiery.randomId()} className="relatedLink">
                    <div><span id={Qwiery.randomId()} onClick={UI.handleClick}>All ideas</span>
                    </div>
                </li>);
                break;
            case "address":
                links.push(<li key={Qwiery.randomId()} className="relatedLink">
                    <div><span id={Qwiery.randomId()} onClick={UI.handleClick}>All addresses</span>
                    </div>
                </li>);
                break;
            case "task":
                links.push(<li key={Qwiery.randomId()} className="relatedLink">
                    <div><span id={Qwiery.randomId()} onClick={UI.handleClick}>All tasks</span>
                    </div>
                </li>);
                break;
            case "person":
                links.push(<li key={Qwiery.randomId()} className="relatedLink">
                    <div><span id={Qwiery.randomId()} onClick={UI.handleClick}>All people</span>
                    </div>
                </li>);
                break;
        }

        this.hasRelatedItems = links.length > 0 || documents.length > 0;
        // if no links then the right part is hanging a bit odd
        if(links.length > 0) {
            this.related = <div className="row">
                <div className="col-md-6">
                    <ul id="relatedLinks">{links}</ul>
                </div>
                <div className="col-md-6">
                    <div id="relatedFiles">{documents}</div>
                </div>
            </div>;
        } else {
            this.related = <div className="row">
                <div className="col-md-12">
                    <div id="relatedFiles">{documents}</div>
                </div>
            </div>;
        }
    },

    adorn: function() {
        var that = this;
        if(this.state.mode === "read") {
            Qwiery.isFavorite(this.entity.Id).then(function(yn) {
                that.isFavorite = yn;
                $("#favstar").css("color", yn ? "red" : "white");
            });
            if(this.state.refreshRelated) {
                $.when(Qwiery.getRelated(this.entity.Id), Qwiery.getEntityTags(this.entity.Id)).then(function(a, b) {
                    var nodes = a[0];
                    var tags = b[0];

                    that.relatedNodes = nodes || [];
                    if(Qwiery.isDefined(tags)) {
                        tags = _.map(tags, function(tag) {
                            return {
                                DataType: "Tag",
                                Title: tag
                            }
                        })
                    }
                    that.relatedTags = tags || [];
                    that.insertRelated();

                    that.setState({
                        refreshRelated: false
                    });

                });
            }
        }
        UI.enablePopovers();
        UI.makeDraggables();
    },
    componentDidUpdate: function() {
        this.adorn();
    },
    componentDidMount: function() {
        this.adorn();
    }
});
