var DashboardComponent = React.createClass(
    {
        getInitialState: function() {
            this.componentId = Qwiery.randomId();
            this.trail = [];
            return {
                visibility: "visible",
                dataLoaded: false
            };
        },
        componentDidUpdate:function(){
            $('[data-toggle="popover"]').popover({
                trigger: 'hover',
                'placement': 'top'
            });
        },
        componentDidMount: function() {

        },
        render: function() {
            if(this.state.dataLoaded) {
                return <div id={this.componentId} key={this.componentId} className="trailer">
                    <div id="trailer" key={"trailer"}>
                        <ul className="breadcrumb">{this.renderTrailItems()}</ul>
                    </div>
                </div>;
            } else {
                return <div id={this.componentId} key={this.componentId} className="trailer"></div>;
            }
        } ,
        askFor: null,
        /***
         * Calls the askFo() if defined by the parent.
         */
        raiseAskFor: function(options) {
            if(Qwiery.isDefined(this.props.askFor)) {
                this.props.askFor(options);
            }
        },
        renderTrailItems: function() {
            var that = this;

            return _.map(this.trail, function(t) {
                return <TrailItem data={t} key={t.Id} handleClick={UI.handleClick}/>;
            });
        }
    }
);