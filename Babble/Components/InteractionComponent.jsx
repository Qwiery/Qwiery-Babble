//babel components --out-dir components

/***
 * The main component presenting Qwiery answers and other info.
 */
var InteractionComponent = React.createClass({
    newTrailItem: null,
    newTraceItem: null,

    getInitialState: function() {
        this.componentId = Qwiery.randomId();

        this.showMainHeader = true;
        return {
            visibility: "visible",
            showMainHeader: false,
            mode: "idle"
        };
    },

    render: function() {

        var preloaderIndex = Math.ceil(Math.random() * 18);
        var preloader = "/Babble/images/Preloader" + preloaderIndex + ".gif";
        var showRenderer = Qwiery.isDefined(this.Letter) && this.state.mode.trim() !== "idle";
        var display = showRenderer ? {display: "block"} : {display: "none"};
        var invdisplay = showRenderer ? {display: "none"} : {display: "block"};
        return <div className="interacter" id={this.componentId} key={this.componentId}>
            <div style={display}>
                {this.renderMainHeader()}
                <div id="podContainer"></div>
                <div className="FeebackLine" style={display}>
                    <div className="FeedbackLink" onClick={UI.showFeedbackDialog}>Feedback</div>
                </div>
            </div>
            <div style={invdisplay}><img src={preloader}/></div>
        </div>;

    },

    componentDidMount: function() {
        this.podRenderer = ReactDOM.render(React.createElement(PodRenderingComponent, {}), $("#podContainer")[0]);
    },

    componentDidUpdate: function() {

    },

    present: function(obj) {
        if(Qwiery.isUndefined(obj)) {
            this.Letter = null;
            return;
        }

        if(Qwiery.isString(obj)) {
            this.Letter = this.podRenderer.present(obj);
            this.showMainHeader = false;
            this.raiseNewTraceItem(this.Letter);
        }
        else if(obj.hasOwnProperty(UI.constants.ExchangeId)) {
            this.Letter = this.podRenderer.present(obj);
            this.showMainHeader = true;
            this.raiseNewTraceItem(this.Letter);
        }
        else if(_.isError(obj)) {
            this.Letter = this.podRenderer.present(obj);
            this.showMainHeader = false;
        }
        else {
            this.Letter = this.podRenderer.present("Error: The pod renderer is not handling this type it seems.");
        }
        this.setState({
            mode: "normal"
        })
    },


    getHistory: function() {
        UI.ask("History");
    },

    renderMainHeader: function() {
        if(Qwiery.isUndefined(this.Letter)) {
            return null;
        }
        var mainHeader = null, badge;
        if(Qwiery.isDefined(this.Letter.ExchangId)) {
            badge = <span title="Click to see your history" onClick={this.getHistory}
                          className='badge'>{this.Letter.ExchangId}</span>;
        }
        if(Qwiery.isDefined(this.Letter.Header)) {
            mainHeader = <span id='header'>{this.Letter.Header}</span>;
        }
        else {
            // we don't want the ugly 'get: 3452-we-34-...'
            if(this.Letter.Pods[0].DataType === "SingleEntity") {
                mainHeader = <span id='header'>{this.Letter.Pods[0].Type}</span>
            } else {
                mainHeader = <span id='header'>{this.Letter.Question}</span>
            }
        }
        if(this.showMainHeader) {
            if(this.Letter.Header === " Error") {
                return [];
            }
            return <div id="mainHeader">{badge}{mainHeader}</div>;
        }
    },


    raiseNewTrailItem: function(item) {
        if(Qwiery.isDefined(this.newTrailItem)) {
            this.newTrailItem(item);
        }
    },

    raiseNewTraceItem: function(item) {
        if(Qwiery.isDefined(this.newTraceItem)) {
            this.newTraceItem(item);
        }
    },


    showComponent: function() {
        this.setState({
            visibility: "visible",
            mode: "idle"
        })
    },

    hideComponent: function() {
        this.setState({
            visibility: " hidden",
            mode: "normal"
        })
    },

    setIdle: function() {
        this.setState({
            visibility: "visible",
            showMainHeader: false,
            mode: "idle"
        });
    }
});

