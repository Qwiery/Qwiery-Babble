/***
 * Renders anything Qwieryish you throw at.
 */
var PodRenderingComponent = React.createClass({
    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        this.Letter = null;
        this.specials = [];
        return {};
    },

    render: function() {
        // some special cases
        if(this.specials.length > 0) {
            return this.specials[0];
        }
        var preloaderIndex = Math.ceil(Math.random() * 18);
        var preloader = "/Babble/images/Preloader" + preloaderIndex + ".gif";
        if(Qwiery.isUndefined(this.Letter)) {
            return <div className="interacter" id={this.componentId} key={this.componentId}>
                <div><img src={preloader}/></div>
            </div>;
        } else {
            return <div className="PodRenderer" id={this.componentId} key={this.componentId}>
                { UI.getComponents(this.Letter.Pods)}
            </div>;
        }
    },
    componentDidMount: function() {

    },

    componentDidUpdate: function() {

    },
    /***
     * Current the entry point for this component via the UI.present method.
     * @param obj
     */
    present: function(obj) {
        this.reset();
        if(Qwiery.isUndefined(obj)) {
            return;
        }
        this.CurrentObject = obj;
        if(Qwiery.isString(obj)) {
            this.presentString(obj);
        }
        else if(obj.hasOwnProperty(UI.constants.ExchangeId)) {
            this.presentQwieryResponse(obj);
        }
        else if(_.isError(obj)) {
            this.presentErrorMessage(obj.message);
        }
        else {
            this.presentErrorMessage("The pod renderer is not handling this type it seems.");
        }
        this.setState({});
        return this.Letter;
    },

    presentString: function(content) {
        var letter = {};
        letter.Header = "";
        if(Qwiery.isUndefined(content)) {
            console.log(" Attempt to present an empty string.");
            return;
        }
        if(!$.type(content) === "string") {
            throw " The presentString method is used to present something else than a string.";
        }
        if(content.toLowerCase().startsWith("error:")) {
            var content = content.replace("error:", "");
            this.presentErrorMessage(content);
            return;
        }
        if(content.toLowerCase().startsWith("login")) {
            // this will bypass rendering the pods and inject directly the given component
            this.specials = [<LoginComponent/>];
            this.Letter = letter;
            return;
        }
        if(content.toLowerCase().startsWith("users")) {
            // this will bypass rendering the pods and inject directly the given component
            // note that you need admin priviledges to see the data and the component just presents this
            this.specials = [<UsersComponent/>];
            this.Letter = letter;
            return;
        }
        if(content.toLowerCase().startsWith("usage")) {
            // this will bypass rendering the pods and inject directly the given component
            // note that you need admin priviledges to see the data and the component just presents this
            this.specials = [<GlobalUsageComponent/>];
            this.Letter = letter;
            return;
        }
        if(content.toLowerCase().startsWith("logoff") || content.toLowerCase().startsWith("logout") || content.toLowerCase().startsWith("log off") || content.toLowerCase().startsWith("log out")) {
            if(Qwiery.apiKey === "Anonymous") {
                this.specials = [<div>No need to log out, you are anonymously talking to Qwiery.</div>];
            }
            if(Qwiery.isDefined(Qwiery.apiKey)) {
                this.logoff();
                // this will bypass rendering the pods and inject directly the given component
                this.specials = [<div>You are now logged off.</div>];
            } else {
                this.specials = [<div>No need to log off, you were not logged in. <a href="#"
                                                                                     onClick={function(){UI.ask("login")}}>Click
                    here if you wish to log in.</a></div>];
            }

            return;
        }
        letter.Pods = Pods.Create({DataType: UI.constants.SimpleContent, Content: content});
        this.Letter = letter;
    },

    presentLogin: function(email) {
        var letter = {};
        letter.Header = "";
        letter.Pods = Pods.Create({DataType: UI.constants.Login, email: email});
        this.Letter = letter;
    },

    presentQwieryResponse: function(qwieryResponse) {
        var session = qwieryResponse;
        var letter = {};
        letter.Trace = session.Trace;
        letter.ExchangId = session.ExchangeId;
        letter.Question = session.Input.Raw;
        letter.Pods = session.Output.Answer; // service always answers with Pods
        this.Letter = letter;

    },

    presentErrorMessage: function(error) {
        var letter = {};
        letter.Header = " Error";
        letter.Pods = Pods.Create({DataType: UI.constants.Error, Error: error});
        this.Letter = letter;

    },

    reset: function() {
        this.Letter = null;
        this.specials = [];
        this.setState({});
    },

    logoff: function() {
        Cookies.remove(UI.constants.CookieName);
        Qwiery.apiKey = "Anonymous";
        UI.removeAvatar();
    }
});