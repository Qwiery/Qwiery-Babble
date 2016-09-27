/***
 * Presents a Wikipedia item.
 *
 * <BingItemComponent/>
 */
var BingItemComponent = React.createClass({
    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        this.items = this.props.Other;
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
        var seq = [];
        if(Qwiery.isDefined(this.props.Title) && this.props.Title.length > 0) {
            if(Qwiery.isDefined(this.props.Url) && this.props.Url.length > 0) {
                seq.push(<div ><strong><a href={this.props.Url} target="_blank">{this.props.Title}</a></strong></div>);
            }
            else {
                seq.push(<div ><strong>{this.props.Title}</strong></div>);
            }
        }
        if(Qwiery.isDefined(this.props.Description) && this.props.Description.length > 0) {
            seq.push(<div>{this.props.Description}</div>);
        }
        if(Qwiery.isDefined(this.props.ImageSource) && this.props.ImageSource.length > 0) {
            seq.push(<img style={{width:400}} src={this.props.ImageSource}/>);
        }
        return <div id={this.componentId} className="ItemComponentItem">
            <i className="fa fa-google iconfix"></i>
            <i id={"plus_"+ this.componentId} onClick={this.createOrGoToEntity} className="fa fa-plus-circle iconadd" title="Create an entity from this."></i>
            {seq}
        </div>;


    },

    componentDidMount: function() {

    }
});
