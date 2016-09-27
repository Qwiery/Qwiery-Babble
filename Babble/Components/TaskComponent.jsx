var TaskComponent = React.createClass({
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
            console.log("Upserted the Task " + that.entity.Id);
            //showMessage(data === true ? "The data was saved." : "Please try again, something happened along the way."); }
            that.finishedEditing({
                refresh: false,
                entity: that.entity
            });
        };
        $.when(Qwiery.upsertEntity(this.entity)).then(postUpdate);
    },

    render: function() {
        if(this.state.mode === "error") {
            return <div id={this.componentId} key={this.componentId} className="alert alert-danger" role="alert"><span
                className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> {this.error}</div>;
        }
        else if(this.state.mode === "read") {
           return <div id={this.componentId} key={this.componentId}>
                <div>
                    <span className="glyphicon glyphicon-tasks" aria-hidden="true" style={{fontSize:20}}></span> <span className="EntityTitle">{this.entity.Title}</span>
                </div>
                <div className="EntityBody">
                    <div className="task-priority">Priority: {this.entity.Priority}</div>
                    <div>{this.entity.Description}</div>

                </div>
            </div>;

        } else if(this.state.mode === "edit") {
            return <div id={this.componentId} key={this.componentId}>

                <form id="TaskEditor">
                    <label for="titleBox">Title:</label>
                    <input id="titleBox" name="Title" value={this.entity.Title} style={{width:"100%"}}
                           onChange={this.handleChange}/>
                    <label for="descriptionBox">Description:</label>
                        <textarea id="descriptionBox" name="Description" rows="15" cols="20"
                                  onChange={this.handleChange} value={this.entity.Description}
                                  style={{height:350, width:"100%"}}>
                        </textarea>

                    <div className="btn-group-right" role="group" style={{textAlign: "right", marginTop:5}}>
                        <div className="btn btn-default" id="CancelButton" onClick={this.cancelEdit}>Cancel</div>
                        <div className="btn btn-default" id="SaveButton" onClick={this.saveEdit}>Save</div>
                    </div>
                    <div id="prioritySlider"></div>
                </form>
                <div>{this.entity.Id}</div>
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
        var that = this;
        $("#prioritySlider").kendoSlider({
            value: that.entity.Priority,
            min: 0,
            max: 10,
            change: function() {
                that.entity.Priority = this.value()
            }
        })
    }
});