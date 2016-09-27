var ThoughtComponent = React.createClass({
    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        this.contentId = Qwiery.randomId();
        this.relatedId = Qwiery.randomId();

        // clone in case of cancel
        this.entity = jQuery.extend({}, this.props.entity);
        var mode = (this.props.mode || "read").toLowerCase();
        if(mode !== "read" && mode !== "edit" && mode !== "deleted") {
            this.error = "The 'mode' attribute can only be 'read', 'deleted' or 'edit'.";
            return {mode: "error"};
        }
        if(Qwiery.isUndefined(this.entity)) {
            this.error = "No 'entity' attribute specified.";
            return {mode: "error"};
        }
        this.markdownEditor = null;
        this.type = this.entity.Type;
        return {
            mode: mode
        };
    },

    finishedEditing: function(obj) {
        if(Qwiery.isDefined(this.props.finishedEditing)) {
            this.props.finishedEditing(obj);
        }
    },

    editEntity: function() {
        this.setState({mode: "edit"});
    },

    cancelEdit: function() {
        event.preventDefault();
        this.finishedEditing({
            refresh: false,
            entity: this.props.entity
        });
    },
    handleChange: function(event) {
        if(event.target.id === "titleBox")
            this.entity.Title = event.target.value;
        else
            this.entity.Description = event.target.value;
        this.setState({entity: this.entity});
    },
    saveEdit: function(event) {
        var that = this;
        event.preventDefault();
        this.entity.Description = this.markdownEditor.value();
        this.entity.Tags = $("#tagsBox").val().split(',');
        this.entity.Tags = _.map(this.entity.Tags, function(tagName){
           return tagName.trim();
        });
        var postUpdate = function(data) {
            console.log("Upserted the Thought " + that.entity.Id);
            that.finishedEditing({
                refresh: true,
                entity: that.entity
            });
        };
        $.when(Qwiery.upsertEntity(this.entity)).then(postUpdate);//UI.serializeForm($("#ThoughtEditor")))
    },

    render: function() {
        if(this.state.mode === "error") {
            return <div id={this.componentId} key={this.componentId} className="alert alert-danger" role="alert"><span
                className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> {this.error}</div>;
        }
        else if(this.state.mode === "read") {
            return <div id={this.componentId} key={this.componentId}>
                <div className="EntityTitle">{this.entity.Title}</div>
                <div id="renderedMarkdown"></div>
            </div>;
        } else if(this.state.mode === "edit") {
            return <div id={this.componentId} key={this.componentId}>

                <form id="ThoughtEditor">
                    <label style={{"margin": "10px 0"}} for="titleBox">Title:</label>
                    <input id="titleBox" name="Title" value={this.entity.Title} style={{width:"100%"}}
                           onChange={this.handleChange}/>
                    <label style={{"margin": "10px 0"}} for="descriptionBox">Description:</label>
                        <textarea id="descriptionBox" name="Description" rows="15" cols="20"
                                  onChange={this.handleChange} value={this.entity.Description}
                                  style={{height:350, width:"100%"}}>
                        </textarea>
                    <label style={{"margin": "10px 0"}} for="tagsBox">Tags:</label>
                    <input style={{width:"100%"}} type="text" id="tagsBox"/>
                    <div className="btn-group-right" role="group" style={{textAlign: "right", marginTop: "15px"}}>
                        <div className="btn btn-default" id="CancelButton" onClick={this.cancelEdit}>Cancel</div>
                        <div style={{marginLeft: "10px"}} className="btn btn-default" id="SaveButton" onClick={this.saveEdit}>Save</div>
                    </div>


                </form>
            </div>;
        }
        else if(this.state.mode === "deleted") {
            return <div id={this.componentId} key={this.componentId}>
                <div className="well"><span
                    className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> This entity was deleted.
                </div>
            </div>;
        }


    },
    componentDidMount: function() {
        if(this.state.mode === "read") {
            if(!UI.markdown) {
                UI.markdown = window.markdownit({html:true}).use(window.markdownitEmoji);
            }
            var html = UI.markdown.render(this.entity.Description);
            Qwiery.getEntityRandomImage(this.entity.Id).then(function(imentity) {
                var thumb = "";
                if(Qwiery.isDefined(imentity)) {
                    thumb = "<img style='width:40%; margin: 0 0 10px 15px; float: right;' src='/Uploads/" + imentity.Source + "'/>  ";
                }
                $("#renderedMarkdown").html(thumb + html);
            });

        } else {
            if(Qwiery.isUndefined(this.markdownEditor)) {
                var $markdownEditorArea = $("#descriptionBox");
                this.markdownEditor = new SimpleMDE({element: $markdownEditorArea[0]});
                this.markdownEditor.value(this.entity.Description)
            }
            var topdata = [];
            Qwiery.getTags().then(function(tagNames) {
                _.forEach(tagNames, function(tag) {
                    topdata.push(tag.Title);
                });
                $("#tagsBox").kendoAutoComplete({
                    dataSource: topdata,
                    filter: "startswith",
                    placeholder: "Add one or more tag...",
                    separator: ", "
                });
            });

            $("#tagsBox").val(this.entity.Tags.join(","));
        }
    }
});