var AddressComponent = React.createClass({
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
                <div className="EntityTitle">{this.entity.Title}</div>
                <div>{this.entity.Description}</div>

                    <div>$AddressLine1</div>
                    <div>$AddressLine2</div>
                    <div>$PostalCode</div>
                    <div>$City</div>
                    <div>$Country</div>
            </div>;
        } else if(this.state.mode === "edit") {
            return <div id={this.componentId} key={this.componentId}>

                <form id="AddressEditor">
                    <input name="Id" type="hidden" value="$Id" />
                    <input name="$typekey" type="hidden" value="$$typekey" />
                    <table>
                        <tr>
                            <td>
                                Title:
                            </td>
                            <td>
                                <input name="Title" value="$Title" width="150" />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Addressline 1:
                            </td>
                            <td>
                                <input name="AddressLine1" value="$AddressLine1" width="150" />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Addressline 2:
                            </td>
                            <td>
                                <input name="AddressLine2" value="$AddressLine2" width="150" />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Postal code:
                            </td>
                            <td>
                                <input name="PostalCode" value="$PostalCode" width="150" />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                City:
                            </td>
                            <td>
                                <input name="City" value="$City" width="150" />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Country:
                            </td>
                            <td>
                                <input name="Country" value="$Country" width="150" />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Description:
                            </td>
                            <td>
                                <input name="Description" value="$Description" width="150" />
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2">
                                <div>
                                    <input id="AddressSubmit" type="button" value="Save" /> <span id="Feedback" style="margin-left: 10px; color: limegreen;"></span>
                                </div>
                            </td>
                        </tr>
                    </table>
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