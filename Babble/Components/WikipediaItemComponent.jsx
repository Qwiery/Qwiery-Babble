/***
 * Presents a Wikipedia item.
 *
 * <WikipediaItemComponent/>
 */
var WikipediaItemComponent = React.createClass({
    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        return {};
    },

    /***
     * Creates an entity from the item and switches the icon to a clickable link to the created item.
     * If it's a link the user can click through to the created item.
     *
     * This double behavior allows to click-add multiple items within the results.
     */
    createOrGoToEntity: function() {
        var $plus = $("#plus_" + this.componentId);
        if($plus.hasClass("fa-link")) {
            UI.ask("get:" + $plus.data("entityId"));
        } else {
            UI.saveAsEntity(this.props).then(function(newid) {
                if(Qwiery.isDefined(newid)) {
                    $plus.removeClass("fa-plus-circle");
                    $plus.addClass("fa-link");
                    $plus.data("entityId", newid);
                }
            })
        }
    },

    render: function() {
        var url = this.props.Url;
        return <div id={this.componentId} className="ItemComponentItem">
            <div className="WikipediaItem">
                <a href={url} target="_blank">
                    <i className="fa fa-wikipedia-w iconfix"></i><strong> Wikipedia: {this.props.PageName}</strong>
                </a>
                <i id={"plus_"+ this.componentId} onClick={this.createOrGoToEntity} className="fa fa-plus-circle iconadd" title="Create an entity from this."></i>
            </div>
        </div>;
    },

    componentDidMount: function() {
        var that = this;
        $.ajax({
            dataType: "jsonp",
            url: "https://en.wikipedia.org/w/api.php?action=query&titles=" + this.props.PageName + "&prop=pageimages&format=json&pithumbsize=500"
        }).then(function(r) {
            try {
                var imageUrl = r.query.pages[Object.keys(r.query.pages)[0]].thumbnail.source;
                $("#" + that.componentId).append("<img src='" + imageUrl + "' style='margin:30px; width:100%; max-width:500px;'/>");
            } catch(e) {

            }
        });
    }
});
