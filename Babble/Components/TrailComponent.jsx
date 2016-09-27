var TrailItem = React.createClass({
    getInitialState: function() {
        this.itemId = null;
        return {};
    },

    render: function() {
        this.itemId = "trail_" + Qwiery.randomId();
        this.itemAId = "trail_a_" + Qwiery.randomId();
        var that = this;
        var thetitle = this.props.data.isEntity ? "Entity" : "Input";
        if(this.props.data.isEntity && Qwiery.isDefined(this.props.data.type)) {
            thetitle += " [" + this.props.data.type + "]";
        }
        return <li id={this.itemId} key={this.itemId}>
            <a id={this.itemAId} data-isentity={this.props.data.isEntity} data-nodeid={this.props.data.id}
               data-toggle="popover" data-html="true"
               data-type = {this.props.data.isEntity===true? "Entity": null}
               data-content={this.props.data.title} data-title={this.props.data.title}
               className={this.props.data.isEntity?"draggable":""}
               onClick={function(){UI.ask(that.props.data)}}
               href="#" title={thetitle}>
                {this.props.data.title}
            </a>
        </li>;
    },
    componentDidMount: function() {
    }

});

/***
 * This component shows a trail of previous interactions.
 * A trail data item consists of
 * {id, isEntity, title, type}
 */
var TrailComponent = React.createClass(
    {
        getInitialState: function() {
            this.componentId = Qwiery.randomId();
            this.trail = [];
            return {
                visibility: "visible",
                dataLoaded: false
            };
        },
        componentDidUpdate: function() {
            $('[data-toggle="popover"]').popover({
                trigger: 'hover',
                'placement': 'top'
            });
            this.fetchData();
        },

        componentDidMount: function() {
            this.fetchData();
        },
        fetchData: function() {
            if(this.state.dataLoaded)return;
            var that = this;

            $.when(Qwiery.getTrail()).done(function(d) {
                if(Qwiery.isDefined(d)) {
                    for(var k = 0; k < d.length; k++) {
                        var t = d[k];
                        that.trail.push({
                            title: Qwiery.isDefined(t.Title) ? t.Title : t.Input,
                            id: t.Id,
                            isEntity: t.IsEntity,
                            type: t.DataType
                        });
                    }
                    that.setState({
                        visibility: "visible",
                        dataLoaded: true
                    });
                }
            });
        },
        render: function() {
            if(this.state.dataLoaded) {
                var items = this.renderTrailItems();
                if(items.length>0){
                    return <div id={this.componentId} key={this.componentId} className="trailer">
                        <div id="trailer" key={"trailer"}>
                            <ul className="breadcrumb">{items}</ul>
                        </div>
                    </div>;
                }else{
                    return <div id={this.componentId} key={this.componentId} className="trailer">No trail yet.</div>;
                }

            } else {
                return <div id={this.componentId} key={this.componentId} className="trailer"></div>;
            }
        },


        askFor: null,

        /***
         * Calls the askFor() if defined by the parent.
         */
        raiseAskFor: function(options) {
            if(Qwiery.isDefined(this.props.askFor)) {
                this.props.askFor(options);
            }
        },
        renderTrailItems: function() {
            var that = this;

            return _.map(that.trail, function(t) {
                return <TrailItem data={t} key={Qwiery.randomId()} handleClick={UI.handleClick}/>;
            });
        },
        /***
         *
         * @param d Either a string or an object of the form {id, isEntity, title, type}
         */
        addTrailItem: function(d) {
            if(_.isString(d)) { // just a title
                this.trail.unshift({
                    title: d,
                    id: null,
                    isEntity: false,
                    type: "Text"
                });
            } else {
                this.trail.unshift(d);
            }
            this.setState({
                visibility: "visible",
                dataLoaded: true
            });
        },


        refresh: function() {
            this.trail=[];
            this.setState({
                visibility: "visible",
                dataLoaded: false
            });
        }
    }
);