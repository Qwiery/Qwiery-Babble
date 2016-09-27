
/***
 * Presents Wolfram Alpha results.
 *
 * <WolframAlphaComponent term="chromatic" />
 */
var WolframAlphaComponent = React.createClass({
    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        this.term = this.props.term;
        return {};
    },
    render: function() {
        return <div id={this.componentId}>{this.items}</div>;
    },

    componentDidMount: function() {
        var that = this;
        var items = [];
        if(Qwiery.isUndefined(this.term) || this.term.trim().length === 0) {
            return;
        }
        $.when(Qwiery.searchAlpha(that.term)).then(function(data) {
            that.items = [];
            for(var i = 0; i < data.Entities.length; i++) {
                var entity = data.Entities[i];
                that.items.push(<div style={{fontWeight:"bold","margin":"10px 0 5px 0"}}><a target='_blank'
                                                                                            style={{'textDecoration':"none"}}
                                                                                            href={entity.Url}>{entity.Title}</a>
                </div>);
                if(Qwiery.isDefined(entity.Description) && entity.Description.length > 0) {
                    that.items.push(<div>{entity.Description}</div>);
                }
                if(Qwiery.isDefined(entity.ImageSource) && entity.ImageSource.length > 0) {
                    that.items.push(<img style={{width:400}} src={entity.ImageSource}/>);
                }
            }

            that.forceUpdate();
        })
    }
});
