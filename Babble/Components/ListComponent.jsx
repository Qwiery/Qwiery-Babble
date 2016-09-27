var ListComponent = React.createClass({
    getInitialState: function() {
        this.items = [];
        this.componentId = Qwiery.randomId();
        return {};
    },

    render: function() {
        return <div className="lister" id={this.componentId} key={this.componentId}>
            <ul className="list-inline">{this.renderItems()}</ul>
        </div>;
    },
    renderItems: function() {
        var that = this;
        return _.map(this.items, function(t) {
            return <li key={t.Id}><span className="glyphicon glyphicon-triangle-right"
                                        style={{top:2, color:"grey"}}></span><a href="#" id={Qwiery.randomId()}
                                                                                data-type={t.Type}
                                                                                onClick={UI.handleClick}
                                                                                data-toggle="popover" title={t.Type}
                                                                                data-html="true"
                                                                                data-content={t.Title}>{t.Title}</a>
            </li>;
        });
    },
    componentDidMount: function() {

    },
    
    askFor: null,

    addItem: function(item) {
        if(this.items.length > 10) {
            delete this.items[this.items.length - 1];
        }
        this.items.unshift(item);
        this.forceUpdate();

    }
});