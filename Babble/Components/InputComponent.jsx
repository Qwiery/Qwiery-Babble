var InputComponent = React.createClass({
    getInitialState: function() {
        this.input = null;
        this.componentId = Qwiery.randomId();
        return {};
    },

    render: function() {
        return <div className="inputer" dataStuff="3" id={this.componentId} key={this.componentId}>
            <input type="text" id="inputBox" className="inputComponentBox"
                   style={{outline: "none", boxShadow:"none"}}
                   placeholder="ask something"/>
            <img id="avatar" src="https://graph.facebook.com/100006530520618/picture" onClick={this.gotoProfile}
                 className="avatar"/>
        </div>;
    },

    currentInput: function(value, showInput) {
        if(Qwiery.isUndefined(value)) {
            return this.input;
        } else {
            if(showInput) {
                this.input = value;
            }
            if(value.trim().length > 0)
                this.raiseInput(value);
            //window.history.pushState({"html":Qwiery.serviceURL + "/?q=" + value,"pageTitle":"Qwiery: " + value},"", Qwiery.serviceURL + "/?q=" + value);
        }
    },
    gotoProfile: function() {
        UI.ask("profile");
    },

    componentDidMount: function() {
        var that = this;
        var input = $("#inputBox");
        // the CTRL+Q combination gets a random question
        $("#inputBox").bind('keyup', 'ctrl+q', function() {
            UI.randomQuestion();
        });
        input.keyup(function(event) {
            that.input = $("#inputBox").val();
            if(event.which === 13) {
                if(Qwiery.isUndefined(that.input) || that.input.trim().length === 0) {
                    that.currentInput("");
                    event.preventDefault();
                    return;
                } else {
                    that.raiseInput(that.input);
                    that.currentInput("");
                    event.preventDefault();
                }
                $("#inputBox").val("");
            }
        });
        input.kendoAutoComplete({
            suggest: true,
            dataSource: {
                data: [
                    "what is anorexia",
                    "what is quantum mechanics",
                    "who am i",
                    "images of elephants",
                    "agenda",
                    "addresses",
                    "add person: John Field",
                    "news",
                    "favorites",
                    "clear",
                    "search: j*",
                    "add address: home",
                    "add idea: write some poetry in the morning",
                    "error",
                    "ideas",
                    "people",
                    "addresses",
                    "tasks",
                    "idea: string theory",
                    "trail",
                    "trace",
                    "elements",
                    "show all",
                    "hide all",
                    "login",
                    "the topic is food",
                    "current topic",
                    "logout",
                    "my personality is unique",
                    "my personality is extravert",
                    "my personality is introvert",
                    "Who are you",
                    "account",
                    "admin:users",
                    "admin:usage",
                    "profile"
                ]
            },
            select: function(e) {
                var item = e.item;
                var text = item.text();
                that.raiseInput(text);
            }
        });
        input.focus();
    },

    handleSpecialInput: null,

    handleInput: null,

    raiseSpecialInput: function(name, data) {
        if(Qwiery.isDefined(this.handleSpecialInput)) {
            this.handleSpecialInput(name, data);
        }
    },

    raiseInput: function(input) {
        if(Qwiery.isDefined(this.handleInput)) {
            this.handleInput(input);
        }
    }
});