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
            delay: 100,
            suggest: false,
            ignoreCase: true,
            animation: false,
            dataSource: {
                data: [
                    "2.3*8/7.01/log(88/7)",
                    "10 inch to cm",
                    "1.7 liter to gallon",

                    "Account",
                    "Admin:users",
                    "Admin:usage",
                    "Agenda",
                    "Addresses",
                    "Add: apple cake",
                    "Add: space: genetics",
                    "Add address: home",
                    "Add idea: write some poetry in the morning",
                    "Add person: John Field",
                    "Add task: pick up the kids from school",
                    "Add: tag: Gardening",
                    "Add tag: Astronomy",

                    "Clear",
                    "Current topic",

                    "Define: deipnosophist",
                    "Delete: tag: music",
                    "Delete tag: music",

                    "Error",
                    "Elements",

                    "Favorites",
                    "Feedback",

                    "Get: tags:",
                    "Get: version:",

                    "Help",
                    "History",
                    "Help: login",
                    "Hide all",
                    "How do you feel?",
                    "https://www.youtube.com/watch?v=hAWyex1GKRU",

                    "Ideas",
                    "Idea: string theory",
                    "Images of elephants",
                    "Images of manifold learning",
                    "I need to go to Wimbledon next month.",

                    "Keywords: http://www.cnbc.com",

                    "Logout",
                    "Login",

                    "My personality is unique",
                    "My personality is extravert",
                    "My personality is introvert",

                    "News",
                    "News about the new MacBook",
                    "Notebooks:",

                    "People",
                    "plot:rpois(100,3)",
                    "Pos: Before I got married I had six theories about bringing up children; now I have six children and no theories.",

                    "Random words",

                    "Search: j*",
                    "Search: Peking",
                    "Search: alpha: coffee",
                    "Search: graph: j*",
                    "Set: pics: coffee grinder",
                    "Set: news: MacBook",
                    "Set: space: default",
                    "Show all",
                    "Send mail",
                    "Spaces:",
                    "Sentiment: I feel awesome today",
                    "Sentiment: http://www.bbc.co.uk",
                    "Synonyms: delight",
                    "Summary: http://www.qwiery.com",

                    "Tasks",
                    "Terms",
                    "Tags:",
                    "Trail",
                    "Trace",
                    "Time",
                    "The topic is food",
                    "Tomorrow I need to go shopping.",

                    "Profile",

                    "Who are you?",
                    "What is time?",
                    "What is quantum mechanics?",
                    "Who am I?",
                    "What date is today?",
                    "What is the GDP of India?"
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