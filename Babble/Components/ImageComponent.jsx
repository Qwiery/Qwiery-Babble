var ImageComponent = React.createClass({
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
        var postUpdate = function(data) {
            console.log("Upserted the Image " + that.entity.Id);
            //showMessage(data === true ? "The data was saved." : "Please try again, something happened along the way."); }
            that.finishedEditing({
                refresh: false,
                entity: that.entity
            });
        };
        $.when(Qwiery.upsertEntity(this.entity)).then(postUpdate);//UI.serializeForm($("#ImageEditor")))
    },

    render: function() {
        if(this.state.mode === "error") {
            return <div id={this.componentId} key={this.componentId} className="alert alert-danger" role="alert"><span
                className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> {this.error}</div>;
        }
        else if(this.state.mode === "read") {
            return <div id={this.componentId} key={this.componentId}>
                <img src={ "/Babble/uploads/" + this.entity.Source} style={{width: "100%", padding: 15}}/>
            </div>;
        } else if(this.state.mode === "edit") {
            return <div id={this.componentId} key={this.componentId}>
                <div>Editing an image is not possible yet.</div>
            </div>;
        }
        else if(this.state.mode === "deleted") {
            return <div id={this.componentId} key={this.componentId}>
                <div className="well"><span
                    className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> This entity was deleted.
                </div>
            </div>;
        }


    }
});