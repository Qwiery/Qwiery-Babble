
/***
 * A component to present the uploaded files.
 */
var FilesComponent = React.createClass({

    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        return {};
    },

    render: function() {
        return <div id={this.componentId}></div>
    },

    componentDidMount: function() {
        var that = this;
        var presentFiles = function(a) {
            if(Qwiery.isUndefined(a) || a.length === 0) {
                $("#" + that.componentId).append("<div>You have not uploaded any files yet.</div>");
            } else {
                var $hul = $("#" + that.componentId).append("<ul></ul>");
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

    }
});