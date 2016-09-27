

var GraphContainerComponent = React.createClass({
    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        this.graph = this.props.Graph;
        this.nodes = this.graph.Nodes;
        this.error = null;
        if(this.nodes.length > 1) {
            this.error = "More than one node in the graph is currently not supported.";
        }
        this.id = this.nodes[0].Id;
        this.dataType = this.nodes[0].DataType;
        this.entity = null;
        return {};
    },
    render: function() {
        if(this.error !== null) {
            return <div>{this.error}</div>
        }
        if(Qwiery.isUndefined(this.entity)) {
            return <div></div>;
        }
        else
            return <SingleEntityComponent key={Qwiery.randomId()} entity={this.entity} askFor={this.props.askFor}/>;
    },
    componentDidMount: function() {
        var that = this;
        $.when(Qwiery.getEntity(this.id)).then(function(entity) {
            that.entity = entity;
            that.forceUpdate();
        });
        //$.when(Qwiery.getEntity(this.id), Qwiery.getEditor(this.dataType)).done(function(entityAnswer, editorAnswer) {
        //    var data = entityAnswer[0];
        //    var editor = editorAnswer[0];
        //    editor = editor.replace("$$typekey", data["$typekey"]);
        //    var matches = editor.match(/\$(\w*)/g);
        //    if(Qwiery.isDefined(matches)) {
        //        for(var i = 0; i < matches.length; i++) {
        //            var match = matches[i].slice(1).trim();
        //            if(match.indexOf("(") == 0 || match.length === 0 || match == "typekey")
        //                continue;
        //            if(data.hasOwnProperty(match)) {
        //                editor = editor.replace("$" + match, data[match]);
        //            }
        //            else {
        //                editor = editor.replace("$" + match, "");
        //            }
        //        }
        //    }
        //
        //    $("#" + that.componentId).html(editor);
        //
        //}).fail(function(error) {
        //    $("#content" + that.componentId).html(error);
        //
        //});


    }
});
