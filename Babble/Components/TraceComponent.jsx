var TraceItemBody = React.createClass({
    raiseShowEditorTemplate: function(data) {
        if(Qwiery.isDefined(this.props.editQTL)) {
            this.props.editQTL(data);
        }
    },
    render: function() {

        if(this.props.child.DataType === "OracleStackItem") {
            var clickable = {
                cursor: "pointer",
                "textDecoration": "underline"
            };

            var id = Qwiery.randomId();

            var grabber = _.isString(this.props.child.Grab) ? this.props.child.Grab : _.take(this.props.child.Grab, 2).join(", ") + "...";
            return <a href="#" className='traceChildBody' style={clickable} data-toggle="popover"
                      title={this.props.child.Grab} data-html="true"
                      data-content={this.props.child.Grab}
                      onClick={this.editTemplate}>{grabber}</a>

        }
        else if(this.props.child.DataType === "TraceStackItem") {
            return <span className='traceChildBody'>{this.props.child.Content}</span>
        }
        else {
            return <span className='traceChildBody'>Was expecting a trace item type but did not find it.</span>
        }

    },
    editTemplate: function(e) {
        this.raiseShowEditorTemplate(this.props.child);
    }
});

var TraceItem = React.createClass({
    raiseShowEditorTemplate: function(data) {
        if(Qwiery.isDefined(this.props.editQTL)) {
            this.props.editQTL(data);
        }
    },
    render: function() {
        var color = "Black";
        // helps to distinguish the QTL that is clean/approved
        if(this.props.child.Approved) {
            color = "Green";
        }
        return <div className='traceSection' key={Qwiery.randomId()}>
            <span className='traceSectionTitle' key={Qwiery.randomId()} style={{color:color}}>
                {this.props.child.Head}
            </span>
            <TraceItemBody child={this.props.child} editQTL={this.raiseShowEditorTemplate}/>
        </div>;
    }
});

/***
 * A component displaying the content of the session's trace.
 */
var TraceComponent = React.createClass({
    getInitialState: function() {
        this.editorId = Qwiery.randomId();
        this.editor = null;

        return {
            visibility: "visible",
            showTemplateEditor: false,
            trace:null
        };

    },

    componentDidMount: function() {
        this.refresh();
    },

    componentDidUpdate: function() {
        this.refresh();
    },

    refresh: function() {
        if(this.editor === null && $("#editor").length > 0) {
            this.editor = ReactDOM.render(React.createElement(QTLEditorComponent, {}), $("#editor")[0]);
        }

        $('[data-toggle="popover"]').popover({
            trigger: 'hover',
            'placement': 'top'
        });

    },

    render: function() {
        if(Qwiery.apiKey === "Anonymous") {
            return <div>Dear Anonymous, you need to be logged in to see the trace. </div>;
        }
        var display = {
            display: this.state.showTemplateEditor ? "block" : "none"
        };


        if(this.state.visibility === "hidden" || Qwiery.isUndefined(this.state.trace)) {
            return <div className='traceRoot'>No trace to display right now.</div>;
        }
        else {
            return <div>
                <div className='traceRoot' key={Qwiery.randomId()}>
                    {this.renderTraceChildren()}
                </div>
                <div id="editor"></div>
            </div>
        }
    },

    showTrace: function(trace) {

        this.setState({
            visibility: "visible",
            showTemplateEditor: false,
            trace: trace
        });
    },
    edit: function(qtl) {
        if(this.editor) {
            this.editor.edit(qtl);
        }
    },
    renderTraceChildren: function() {
        var that = this;
        if(this.state.trace.length === 0)return null;
        var result = [];
        _.forEach(this.state.trace, function(traceItem) {
            if(traceItem.Oracle) {
                var ostack = _.map(traceItem.Oracle, function(t) {
                    return <TraceItem child={t} key={Qwiery.randomId()} editQTL={that.edit}/>;
                });
                result.push(ostack);
            }
            if(traceItem.Commands) {
                var cstack = _.map(traceItem.Commands, function(t) {
                    return <TraceItem child={t} key={Qwiery.randomId()}/>;
                });
                result.push(cstack);
            }
        });

        result = _.flatten(result);
        return result;

    },

});
