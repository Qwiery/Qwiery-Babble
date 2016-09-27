/**
 * Renders the Bing element
 *
 * <BingComponent source="image" term="elephants" count="4"/>
 *
 * Via QTL this can be triggered using:
 *
 * {
 *	"Answer": {
 *		"DataType": "Bing",
 *		"Source": "Web",
 *		"Term": "elephants"
 *	}
 * }
 */
var BingComponent = React.createClass({
    getInitialState: function() {
        this.contentId = Qwiery.randomId();
        this.source = this.props.Source;
        var term;
        if(!Qwiery.isDefined(this.source)) {
            this.source = "web";
        }
        else {
            this.source = this.source.trim().toLowerCase();
        }
        this.count = this.props.count;
        if(Qwiery.isDefined(this.count)) {
            this.count = parseInt(this.count);
        }
        else {
            this.count = 10;
        }
        this.term = this.props.Term;
        if(!Qwiery.isDefined(this.term)) {
            if(this.source === "news") {
                this.term = "Latest";
            }
            else {
                throw "Search term is not defined";
            }
        }
        return {};
    },

    render: function() {
        return <div id={this.componentId} key={this.componentId}> <p>This is what I found on the net about '{this.props.Term}':</p><div>{this.items}</div> </div>;
    },
    
    componentDidMount: function() {
        var that = this;
        $.when(Qwiery.searchWeb(that.term, that.source, that.count)).then(function(data) {
            that.items = [];
            for(var i = 0; i < data.length; i++) {
                var entity = data[i];
                that.items.push(<div key={Qwiery.randomId()} >
                    <i className="BingIcon fa fa-anchor" aria-hidden="true"></i>
                    <a
                    target='_blank'
                    className="BingAnchor"
                    href={entity.Url}>{entity.Title}</a>
                </div>);
                if(Qwiery.isDefined(entity.Description) && entity.Description.length > 0) {
                    that.items.push(<div key={Qwiery.randomId()} className="BingDescription">{entity.Description}</div>);
                }
                if(Qwiery.isDefined(entity.MediaUrl) && entity.MediaUrl.length > 0) {
                    that.items.push(<img key={Qwiery.randomId()} style={{width:400}} src={entity.MediaUrl}/>);
                }
            }
            that.forceUpdate();
        })
    }
});
