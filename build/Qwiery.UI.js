var AddressComponent = React.createClass({displayName: "AddressComponent",
    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        this.contentId = Qwiery.randomId();
        this.relatedId = Qwiery.randomId();

        // clone in case of cancel
        this.entity = jQuery.extend({}, this.props.entity);
        var mode = (this.props.mode || "read").toLowerCase();
        if(mode !== "read" && mode !== "edit" && mode !== "deleted") {
            this.error = "The 'mode' attribute can only be 'read', 'deleted' or 'edit'.";
            return {mode: "error"};
        }
        if(Qwiery.isUndefined(this.entity)) {
            this.error = "No 'entity' attribute specified.";
            return {mode: "error"};
        }
        this.type = this.entity.Type;
        return {
            mode: mode
        };
    },

    finishedEditing: function(obj) {
        if(Qwiery.isDefined(this.props.finishedEditing)) {
            this.props.finishedEditing(obj);
        }
    },

    editEntity: function() {
        this.setState({mode: "edit"});
    },

    cancelEdit: function() {
        event.preventDefault();
        this.finishedEditing({
            refresh: false,
            entity: this.props.entity
        });
    },
    handleChange: function(event) {
        if(event.target.id === "titleBox")
            this.entity.Title = event.target.value;
        else
            this.entity.Description = event.target.value;
        this.setState({entity: this.entity});
    },
    saveEdit: function(event) {
        var that = this;
        event.preventDefault();
        var postUpdate = function(data) {
            console.log("Upserted the Task " + that.entity.Id);
            //showMessage(data === true ? "The data was saved." : "Please try again, something happened along the way."); }
            that.finishedEditing({
                refresh: false,
                entity: that.entity
            });
        };
        $.when(Qwiery.upsertEntity(this.entity)).then(postUpdate);
    },

    render: function() {
        if(this.state.mode === "error") {
            return React.createElement("div", {id: this.componentId, key: this.componentId, className: "alert alert-danger", role: "alert"}, React.createElement("span", {
                className: "glyphicon glyphicon-exclamation-sign", "aria-hidden": "true"}), " ", this.error);
        }
        else if(this.state.mode === "read") {
            return React.createElement("div", {id: this.componentId, key: this.componentId}, 
                React.createElement("div", {className: "EntityTitle"}, this.entity.Title), 
                React.createElement("div", null, this.entity.Description), 

                    React.createElement("div", null, "$AddressLine1"), 
                    React.createElement("div", null, "$AddressLine2"), 
                    React.createElement("div", null, "$PostalCode"), 
                    React.createElement("div", null, "$City"), 
                    React.createElement("div", null, "$Country")
            );
        } else if(this.state.mode === "edit") {
            return React.createElement("div", {id: this.componentId, key: this.componentId}, 

                React.createElement("form", {id: "AddressEditor"}, 
                    React.createElement("input", {name: "Id", type: "hidden", value: "$Id"}), 
                    React.createElement("input", {name: "$typekey", type: "hidden", value: "$$typekey"}), 
                    React.createElement("table", null, 
                        React.createElement("tr", null, 
                            React.createElement("td", null, 
                                "Title:"
                            ), 
                            React.createElement("td", null, 
                                React.createElement("input", {name: "Title", value: "$Title", width: "150"})
                            )
                        ), 
                        React.createElement("tr", null, 
                            React.createElement("td", null, 
                                "Addressline 1:"
                            ), 
                            React.createElement("td", null, 
                                React.createElement("input", {name: "AddressLine1", value: "$AddressLine1", width: "150"})
                            )
                        ), 
                        React.createElement("tr", null, 
                            React.createElement("td", null, 
                                "Addressline 2:"
                            ), 
                            React.createElement("td", null, 
                                React.createElement("input", {name: "AddressLine2", value: "$AddressLine2", width: "150"})
                            )
                        ), 
                        React.createElement("tr", null, 
                            React.createElement("td", null, 
                                "Postal code:"
                            ), 
                            React.createElement("td", null, 
                                React.createElement("input", {name: "PostalCode", value: "$PostalCode", width: "150"})
                            )
                        ), 
                        React.createElement("tr", null, 
                            React.createElement("td", null, 
                                "City:"
                            ), 
                            React.createElement("td", null, 
                                React.createElement("input", {name: "City", value: "$City", width: "150"})
                            )
                        ), 
                        React.createElement("tr", null, 
                            React.createElement("td", null, 
                                "Country:"
                            ), 
                            React.createElement("td", null, 
                                React.createElement("input", {name: "Country", value: "$Country", width: "150"})
                            )
                        ), 
                        React.createElement("tr", null, 
                            React.createElement("td", null, 
                                "Description:"
                            ), 
                            React.createElement("td", null, 
                                React.createElement("input", {name: "Description", value: "$Description", width: "150"})
                            )
                        ), 
                        React.createElement("tr", null, 
                            React.createElement("td", {colspan: "2"}, 
                                React.createElement("div", null, 
                                    React.createElement("input", {id: "AddressSubmit", type: "button", value: "Save"}), " ", React.createElement("span", {id: "Feedback", style: "margin-left: 10px; color: limegreen;"})
                                )
                            )
                        )
                    )
                ), 
                React.createElement("div", null, this.entity.Id)
            );
        }
        else if(this.state.mode === "deleted") {
            return React.createElement("div", {id: this.componentId, key: this.componentId}, 
                React.createElement("div", {className: "well"}, React.createElement("span", {
                    className: "glyphicon glyphicon-exclamation-sign", "aria-hidden": "true"}), " This entity was deleted."
                )
            );
        }


    },
    componentDidMount: function() {
        var that = this;
        $("#prioritySlider").kendoSlider({
            value: that.entity.Priority,
            min: 0,
            max: 10,
            change: function() {
                that.entity.Priority = this.value()
            }
        })
    }
});
/***
 * Presents the addresses.
 * var things = [
 {
           "Title": "Task 1",
           "Description": "",
           "Id": "9cd3ee05-7612-441d-b780-7dba087f4011",
 }
 *
 * ]
 * <AddressesComponent addresss=things/>
 */
var AddressesComponent = React.createClass({displayName: "AddressesComponent",
    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        this.addresss = this.props.addresss;
        return {};
    },
    render: function() {
        return React.createElement("div", {id: this.componentId, style: {border:"none"}});
    } ,
    adorn: function() {
        var that = this;
        $.when(Qwiery.getAddresses()).then(function(addresss) {
            that.addresss = addresss;
            for(var k = 0; k < addresss.length; k++) {
                var address = addresss[k];
                var $item;
                if(Qwiery.isDefined(address.Source)) {
                    $item = $('<div class="thought-wall-item"  onClick="UI.ask(\'get:' + address.Id + '\')"><span class="glyphicon glyphicon-leaf" style="font-size:15px; float: left;margin-right: 5px;"></span><span class="thought-title">' + address.Title + '</span><img class="thought-image" src="' + Qwiery.serviceURL + '/Uploads/' + address.Source + '"/><p class="thought-description">' + address.Description + '</p></div>');
                } else {
                    $item = $('<div class="thought-wall-item"  onClick="UI.ask(\'get:' + address.Id + '\')"><span class="glyphicon glyphicon-leaf" style="font-size:15px; float: left;margin-right: 5px;"></span><span class="thought-title">' + address.Title + '</span><p class="thought-description">' + address.Description + '</p></div>');
                }

                that.$container.append($item);
                $item.hide();
                that.iso.isotope('appended', $item);
                that.iso.isotope('layout');
                $item.fadeIn(500);
            }
        });
    },
    componentDidUpdate: function() {
        this.iso.isotope('layout');
    },
    componentDidMount: function() {
        this.$container = $("#" + this.componentId);
        this.iso = this.$container.isotope({
            itemSelector: '.thought-wall-item',
            masonry: {
                columnWidth: '.thought-wall-item'
            }
        });
        this.adorn();
    }
});


/***
 * Presents the agenda items.
 *
 * <AgendaComponent />
 */
var AgendaComponent = React.createClass({displayName: "AgendaComponent",
    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        return {};
    },
    render: function() {

        return React.createElement("div", {id: this.componentId});
    },
    componentDidMount: function() {
        var that = this;
        $.when(Qwiery.getAgenda()).done(function(data) {
            if(data.length > 0) {
                /*
                 var r = "<div>";
                 for (var i = 0; i < data.length; i++) {
                 var item = data[i];
                 var from = parseInt(item.Start) || -1;
                 var to = parseInt(item.End) || -1;
                 r += "<br/><div>" + item.Title + "</div>";
                 if (from > -1) {
                 r += "<div>From: " + Texture.GetDateTimeString(from) + "</div>";
                 }
                 if (to > -1) {
                 r += "<div>To: " + Texture.GetDateTimeString(to) + "</div>";
                 }
                 }
                 r += "</div>";
                 $("#content" + contentId).html(r);*/
                var source = [];
                for(var i = 0; i < data.length; i++) {
                    var item = data[i];
                    var from = parseInt(item.Start) || -1;
                    var to = parseInt(item.End) || -1;
                    try {
                        if(from > 0) {
                            if(to > 0) {
                                if(to === from) {
                                    source.push({
                                        id: item.Id,
                                        start: new Date(from),
                                        end: new Date(to),
                                        isAllDay: true,
                                        title: item.Title || "No title",
                                        description: "This fella needs to work on this."
                                    });
                                }
                                else {
                                    source.push({
                                        id: item.Id,
                                        start: new Date(from),
                                        end: new Date(to),
                                        isAllDay: false,
                                        title: item.Title || "No title",
                                        description: "This fella needs to work on this."
                                    });
                                }
                            }
                            else {
                                source.push({
                                    id: item.Id,
                                    start: new Date(from),
                                    end: new Date(from),
                                    isAllDay: true,
                                    title: item.Title || "No title",
                                    description: "This fella needs to work on this."
                                });
                            }
                        }
                    }
                    catch(e) {
                    }
                }
                $("#" + that.componentId).kendoScheduler({
                    date: new Date(),
                    startTime: new Date(),
                    height: 600,
                    views: [
                        "day",
                        //"workweek"
                        "week",
                        "month",
                        {type: "agenda", selected: true}
                    ],
                    timezone: "Etc/UTC",
                    dataSource: source
                });
            }
            else {
                $("#" + that.componentId).html("<p>Your agenda is empty. You can add an appointment in various ways, for example</p><blockquote><ul>" +
                    "<li>Tomorrow I need to go shopping.</li>" +
                    "<li>Next Tuesday: leaving earlier from work</li>" +
                    "</ul></blockquote>");
            }
        }).fail(function(error) {
            UI.showError(error);
        });
    }
});

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
var BingComponent = React.createClass({displayName: "BingComponent",
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
        return React.createElement("div", {id: this.componentId, key: this.componentId}, " ", React.createElement("p", null, "This is what I found on the net about '", this.props.Term, "':"), React.createElement("div", null, this.items), " ");
    },
    
    componentDidMount: function() {
        var that = this;
        $.when(Qwiery.searchWeb(that.term, that.source, that.count)).then(function(data) {
            that.items = [];
            for(var i = 0; i < data.length; i++) {
                var entity = data[i];
                that.items.push(React.createElement("div", {key: Qwiery.randomId()}, 
                    React.createElement("i", {className: "BingIcon fa fa-anchor", "aria-hidden": "true"}), 
                    React.createElement("a", {
                    target: "_blank", 
                    className: "BingAnchor", 
                    href: entity.Url}, entity.Title)
                ));
                if(Qwiery.isDefined(entity.Description) && entity.Description.length > 0) {
                    that.items.push(React.createElement("div", {key: Qwiery.randomId(), className: "BingDescription"}, entity.Description));
                }
                if(Qwiery.isDefined(entity.MediaUrl) && entity.MediaUrl.length > 0) {
                    that.items.push(React.createElement("img", {key: Qwiery.randomId(), style: {width:400}, src: entity.MediaUrl}));
                }
            }
            that.forceUpdate();
        })
    }
});

/***
 * Presents a Wikipedia item.
 *
 * <BingItemComponent/>
 */
var BingItemComponent = React.createClass({displayName: "BingItemComponent",
    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        this.items = this.props.Other;
        return {};
    },

    /***
     * Creates an entity from the item and switches the icon to a clickable link to the created item.
     * If it's a link the user can click through to the created item.
     *
     * This double behavior allows to click-add multiple items within the results.
     */
    createOrGoToEntity: function() {
        var $plus = $("#plus_" + this.componentId);
        if($plus.hasClass("fa-link")) {
            UI.ask("get:" + $plus.data("entityId"));
        } else {
            UI.saveAsEntity(this.props).then(function(newid) {
                if(Qwiery.isDefined(newid)) {
                    $plus.removeClass("fa-plus-circle");
                    $plus.addClass("fa-link");
                    $plus.data("entityId", newid);
                }
            })
        }
    },

    render: function() {
        var seq = [];
        if(Qwiery.isDefined(this.props.Title) && this.props.Title.length > 0) {
            if(Qwiery.isDefined(this.props.Url) && this.props.Url.length > 0) {
                seq.push(React.createElement("div", null, React.createElement("strong", null, React.createElement("a", {href: this.props.Url, target: "_blank"}, this.props.Title))));
            }
            else {
                seq.push(React.createElement("div", null, React.createElement("strong", null, this.props.Title)));
            }
        }
        if(Qwiery.isDefined(this.props.Description) && this.props.Description.length > 0) {
            seq.push(React.createElement("div", null, this.props.Description));
        }
        if(Qwiery.isDefined(this.props.ImageSource) && this.props.ImageSource.length > 0) {
            seq.push(React.createElement("img", {style: {width:400}, src: this.props.ImageSource}));
        }
        return React.createElement("div", {id: this.componentId, className: "ItemComponentItem"}, 
            React.createElement("i", {className: "fa fa-google iconfix"}), 
            React.createElement("i", {id: "plus_"+ this.componentId, onClick: this.createOrGoToEntity, className: "fa fa-plus-circle iconadd", title: "Create an entity from this."}), 
            seq
        );


    },

    componentDidMount: function() {

    }
});

var UI = {
    /***
     * Called by components and links when a new question needs to be presented, e.g. through clicking on a link.
     */
    ask: null,

    /***
     * Typically called when a drop occured and the presentation or state needs to be refreshed.
     */
    onRefreshCurrentRequest: null,

    // should be handled to present whatever needs to be presented
    present: null,

    // the authentication ticket from the cookie
    ticket: null,

    /***
     * Collects various constants used across the component logic.
     */
    constants: {
        Error: "SimpleError",
        CurrentAgenda: "CurrentAgenda",
        Script: "Script",
        GraphContainer: "GraphContainer",
        Tasks: "Tasks",
        Weather: "Weather",
        Favorites: "Favorites",
        Thoughts: "Thoughts",
        TagEntities: "TagEntities",
        Entities: "Entities",
        Tags: "Tags",
        People: "People",
        Files: "Files",
        Images: "Images",
        History: "History",
        Addresses: "Addresses",
        BingItem: "BingItem",
        GraphItem: "GraphItem",
        Item: "Item",
        WikipediaItem: "WikipediaItem",
        PersonalityOverview: "PersonalityOverview",
        SimpleContent: "SimpleContent",
        SingleEntity: "SingleEntity",
        MultiEntity: "MultiEntity",
        Wikipedia: "Wikipedia",
        EditEntity: "EditEntity",
        WolframAlpha: "WolframAlpha",
        GraphSearch: "GraphSearch",
        Bing: "Bing",
        News: "News",
        Profile: "Profile",
        session: "session",
        ExchangeId: "ExchangeId",
        Login: "Login",
        Html: "Html",
        Iframe: "Iframe",
        DataViz: "DataViz",
        Video: "Video",
        Error: "Error",
        Workspaces: "Workspaces",
        Service: "Service",
        LocalServer: "http://localhost:4785",
        RemoteServer: "http://api.qwiery.com",
        CookieName: "Qwiery",
        EnableLocalLogin: false
    },

    inputContainer: null,
    interactionContainer: null,
    trailContainer: null,
    elementsContainer: null,
    traceContainer: null,
    inputComponent: null,
    interactionComponent: null,
    trailComponent: null,
    favoritesComponent: null,
    tagsComponent: null,
    workspacesComponent: null,
    traceComponent: null,


    markdown: null,

    /***
     * Initializes the application
     */
    init: function() {
        // global ajax error handling
        $(document).ajaxError(function(xhr, status, err) {
            var error = status.responseText ? status.responseText : Qwiery.formatErrorMessage(xhr, err);
            UI.showError(error);
        });
        Qwiery.serviceURL = UI.constants.RemoteServer;

        // the user authentication ticket
        if(Qwiery.isDefined(Cookies.get(UI.constants.CookieName))) {
            UI.ticket = JSON.parse(Cookies.get(UI.constants.CookieName));
        } else {
            UI.ticket = {
                "username": "Anonymous",
                "apiKey": "Anonymous",
                "id": "Anonymous"
            };
        }

        // check if a different server was set
        if(UI.ticket && UI.ticket.server) {
            Qwiery.serviceURL = UI.ticket.server;
        }

        if(UI.isLoggedIn()) {
            Qwiery.apiKey = UI.getApiKey();
        }
        UI.ask = this.simulateInput;
        this.inputContainer = $("#inputContainer");
        this.interactionContainer = $("#interactionContainer");
        this.trailContainer = $("#trailContainer");
        this.elementsContainer = $("#elementsContainer");
        this.traceContainer = $("#traceContainer");

        if(this.inputContainer.length > 0) {
            this.inputComponent = ReactDOM.render(React.createElement(InputComponent, {}), this.inputContainer[0]);
            // when input is given we pass it on to the corresponding handler
            this.inputComponent.handleInput = this.handleInput;
        }
        else {
            console.warn("The input container tag was not present.");
        }

        if(this.interactionContainer.length > 0) {
            this.interactionComponent = ReactDOM.render(React.createElement(InteractionComponent, {askFor: UI.ask}), this.interactionContainer[0]);
        }
        else {
            console.warn("The interaction container tag was not present.");
        }

        if(this.trailContainer.length > 0) {
            this.trailComponent = ReactDOM.render(React.createElement(TrailComponent, {}), this.trailContainer[0]);
        }
        else {
            console.warn("The trail container tag was not present.");
        }

        if(this.elementsContainer.length > 0) {
            this.elementsComponent = ReactDOM.render(React.createElement(GraphSummaryComponent, {askFor: UI.ask}), this.elementsContainer[0]);
        }
        else {
            console.warn("The elements container tag was not present.");
        }
        if(this.traceContainer.length > 0) {
            if(UI.ticket.role === "Admin") {
                this.traceComponent = ReactDOM.render(React.createElement(TraceComponent, {}), this.traceContainer[0]);
            } else {
                this.traceContainer.hide();
            }
        }
        else {
            console.warn("The trace container tag was not present.");
        }


        // what to do with questions coming from components and not directly typed in by the user?
        // if you want to call an entity you need something like
        /*
         UI.ask({
         type: data === null ? null : data.type,
         id: data === null ? null : data.Id,
         title: text,
         isEntity: true
         });
         */

        // what happens when someone asks to present something
        UI.present = function(msg) {
            if(this.interactionContainer && this.interactionComponent) {
                this.interactionContainer.show();
                this.interactionComponent.present(msg);
            } else {
                alert("No interaction container, so I've put the answer is in the browser log.")
                console.log(msg);
            }
        };

        // UI.showError = function(msg) {
        //     if(Qwiery.isUndefined(msg)) {
        //         return;
        //     }
        //     if(msg.toLowerCase().indexOf("error:") < 0) {
        //         msg = "error: " + msg;
        //     }
        //     UI.present(msg);
        // };
        UI.makeInputSinkDroppable();
        if(UI.isLoggedIn()) {
            UI.setAvatar();
        }
        //$(".jumbotron").click(UI.changeBackgroundImage);
        this.markdown = window.markdownit({html: true}).use(window.markdownitEmoji);

        // check if a querysstring param was passed
        this.simulateInput(UI.getParameterByName("q"));

    },

    showFeedbackDialog: function() {
        $('#feedbackModal').modal()
    },

    collectFeedback: function() {
        var selection = $('#FeedbackSelection input:radio:checked').val();
        if(Qwiery.isUndefined(selection)) {
            selection = "None";
        }
        var currentObject = this.interactionComponent.CurrentObject;

        var comments = $("#FeedbackComments").val();
        Qwiery.feedback({
            User: UI.ticket.username + " [" + UI.ticket.id + "]",
            Category: selection,
            Comments: comments,
            Object: currentObject,
            Subject: "Qwiery feedback"
        });
        $("#FeedbackComments").val("");
        $("input:radio[name='answer']").each(function(i) {
            this.checked = false;
        });
        $('#feedbackModal').modal('hide');
    },

    refreshPods: function() {
        if(this.trailComponent) this.trailComponent.refresh();
        if(this.elementsComponent) this.elementsComponent.refresh();
        if(this.traceComponent) this.traceComponent.refresh();
    },

    handleLocalCommands: function(q) {
        var qlower = q.toLowerCase().trim();
        if(qlower.indexOf("login") === 0 || qlower.indexOf("account") === 0) {
            this.interactionContainer.show();
            UI.present("login");
            return true;
        }
        if(qlower.indexOf("logoff") === 0 || qlower.indexOf("logout") === 0 || qlower.indexOf("log off") === 0 || qlower.indexOf("log out") === 0) {
            this.interactionContainer.show();

            UI.present("logoff");
            this.refreshPods();
            return true;
        }
        if(qlower.indexOf("server:") === 0) {
            var server = qlower.replace("server:", "").trim().toLowerCase();
            switch(server) {
                case "local":
                    Qwiery.serviceURL = UI.constants.LocalServer;
                    UI.present("You are now talking to the <strong>local</strong> server.");
                    if(UI.ticket) {
                        UI.ticket.server = UI.constants.LocalServer;
                        UI.updateClientTicket();
                    }
                    break;
                case "remote":
                    Qwiery.serviceURL = UI.constants.RemoteServer;
                    UI.present("You are now talking to the <strong>remote</strong> server.");
                    if(UI.ticket) {
                        UI.ticket.server = UI.constants.RemoteServer;
                        UI.updateClientTicket();
                    }
                    break;
                default:
                    Qwiery.serviceURL = server;
                    UI.present("Hm, that's not a server I am aware of, but it might work. If not, you should try with 'server:local' or 'server:remote'.");
                    break;
            }
            return true;
        }

        if(qlower.indexOf("admin:") === 0) {
            var aspect = qlower.replace("admin:", "").trim().toLowerCase();
            switch(aspect) {
                case "users":
                    this.interactionContainer.show();
                    UI.present("users");
                    break;
                case "usage":
                    this.interactionContainer.show();
                    UI.present("usage");
                    break;

                default:
                    UI.present("This admin function is not available.");
                    break;
            }
            return true;
        }
        switch(qlower) {
            case "feedback":
                this.showFeedbackDialog();
                return true;
            case "clear":
                this.interactionContainer.hide();
                this.traceContainer.slideUp();
                this.trailContainer.slideUp();
                this.elementsContainer.slideUp();
                return true;
            case "trace":
                if(UI.ticket.role === "Admin") {
                    this.traceContainer.slideToggle();
                }
                return true;
            case "show trace":
                if(UI.ticket.role === "Admin") {
                    this.traceContainer.slideDown();
                }
                return true;
            case "hide trace":
                if(UI.ticket.role === "Admin") {
                    this.traceContainer.slideUp();
                }
                return true;
            case "trail":
                this.trailContainer.slideToggle();
                return true;
            case "show trail":
                this.trailContainer.slideDown();
                return true;
            case "hide trail":
                this.trailContainer.slideUp();
                return true;
            case "elements":
                this.elementsContainer.slideToggle();
                return true;
            case "show elements":
                this.elementsContainer.slideDown();
                return true;
            case "hide elements":
                this.elementsContainer.slideUp();
                return true;
            case "hide all":
                if(UI.ticket.role === "Admin") {
                    this.traceContainer.slideUp();
                }
                this.trailContainer.slideUp();
                this.elementsContainer.slideUp();
                return true;
            case "show all":
                if(UI.ticket.role === "Admin") {
                    this.traceContainer.slideDown();
                }
                this.trailContainer.slideDown();
                this.elementsContainer.slideDown();
                return true;
            case "random question":
            case "rnd":
                UI.randomQuestion();
                return true;
            default:
                return false;
        }
    },

    randomQuestion: function() {
        Qwiery.lexicRandomQuestion().then(function(randomQuestion) {
            if(Qwiery.isDefined(randomQuestion)) {
                UI.ask(randomQuestion);
            }
        });
    },

    updateClientTicket: function() {
        if(Qwiery.isUndefined(UI.ticket))return;
        var ticket = JSON.stringify(UI.ticket);
        Cookies.set(UI.constants.CookieName, ticket, {expires: 7});
    },

    /***
     * Presents the given input in the input box and automatically also calls for an answer.
     * @param q
     */
    simulateInput: function(q, showInput) {
        if(Qwiery.isUndefined(showInput)) {
            showInput = true;
        }
        if(Qwiery.isDefined(q)) {
            // a composite question
            if(q.isEntity) {
                switch(q.type) {
                    case "Entity":
                        UI.inputComponent.currentInput("get:" + q.id);
                        break;
                    case "Tag": // is answered from Oracle and not from QL right now
                        UI.inputComponent.currentInput("Entities tagged with " + q.title);
                        break;
                    case "Workspace":
                        UI.inputComponent.currentInput("workspace:" + q.title);
                        break;
                    default: // let's assume that it's a data entity in this case
                        UI.inputComponent.currentInput("get:" + q.id);
                }
            }
            else if(_.isObject(q)) {

                if(Qwiery.isDefined(q.title)) {
                    UI.inputComponent.currentInput(q.title.trim());
                }
            }
            else if(q.trim().length > 0) {
                UI.inputComponent.currentInput(q, showInput);
            }
        }

    },

    /***
     * The crucial handler which dispatches the input to either a local change or to Qwiery.
     * @param input
     */
    handleInput: function(input) {
        UI.interactionContainer.show();

        if(!UI.handleLocalCommands(input)) {
            if(UI.interactionComponent) UI.interactionComponent.setIdle();

            UI.fetch(Qwiery.ask(input), function(reply) {

                if(Qwiery.isUndefined(reply)) {
                    UI.present("Error: there was no reply from Qwiery.");
                }
                else {
                    UI.present(reply);
                    {

                        UI.showTrace(reply.Trace);
                        UI.addTrail(reply);
                    }

                }

            });
        }
        UI.enablePopovers();
        UI.makeDraggables();
    },

    showTrace: function(t) {
        if(UI.traceComponent) {
            UI.traceComponent.showTrace(t);
        }
    },

    removeAvatar: function() {
        $("#avatar").fadeOut(500);
    },

    /***
     * Sets the user avatar if logged in and available via social info.
     */
    setAvatar: function() {
        if(!UI.isLoggedIn()) {
            return;
        }
        var $avatar = $("#avatar");
        // can choose the priority here
        if(Qwiery.isDefined(UI.ticket.facebook) && Qwiery.isDefined(UI.ticket.facebook.thumbnail)) {
            $avatar.fadeIn(500);
            $avatar.attr("src", UI.ticket.facebook.thumbnail);
            $avatar.attr("title", UI.ticket.facebook.name);
        } else if(Qwiery.isDefined(UI.ticket.google) && Qwiery.isDefined(UI.ticket.google.thumbnail)) {
            $avatar.fadeIn(500);
            $avatar.attr("src", UI.ticket.google.thumbnail);
            $avatar.attr("title", UI.ticket.google.name);
        }else if(Qwiery.isDefined(UI.ticket.twitter) && Qwiery.isDefined(UI.ticket.twitter.thumbnail)) {
            $avatar.fadeIn(500);
            $avatar.attr("src", UI.ticket.twitter.thumbnail);
            $avatar.attr("title", UI.ticket.twitter.name);
        }
    },

    addTrail: function(reply) {
        if(Qwiery.isDefined(reply) && reply.Historize) {
            var item = {};
            var answer = reply.Output.Answer;
            if(answer.length > 0 && answer[0].DataType == UI.constants.SingleEntity && Qwiery.isDefined(answer[0].Entity)) {
                item.title = answer[0].Entity.Title;
                item.id = answer[0].Entity.Id;
                item.isEntity = true;
            }
            else {
                item.title = reply.Input.Raw;
                item.id = null;
                item.type = null;
                item.isEntity = false;
            }
            UI.trailComponent.addTrailItem(item);
        }
    },

    /***
     * Returns whether the current user is logged in.
     * @returns {*|boolean}
     */
    isLoggedIn: function() {
        return Qwiery.isDefined(UI.ticket);
    },

    /***
     * Return the API key of the current user if looged in, otherwise null.
     * @returns {*}
     */
    getApiKey: function() {
        if(!UI.isLoggedIn()) {
            return null;
        }
        return UI.ticket.apiKey;
    },

    /***
     * Makes the div around the InputComponent a dropzone so stuff can be uploaded via that way.
     */
    makeInputSinkDroppable: function() {
        var dropContainer = $("#inputSink");
        if(dropContainer.length > 0 && Qwiery.isUndefined(dropContainer.data("dropzone"))) {
            var dropOptions = {
                paramName: "dropContainer",
                url: Qwiery.serviceURL + "/files/upload",
                headers: {
                    "ApiKey": Qwiery.apiKey,
                },
                dragenter: function() {
                    //dropContainer.originalColor = dropContainer.css("border-color");
                    dropContainer.css({"border-color": "orange", "border-style": "solid"});
                },
                dragleave: function() {
                    dropContainer.css("background-color", dropContainer.originalColor);
                },
                maxFilesize: 2, // MB
                addRemoveLinks: false,
                clickable: false,
                success: function(file) {
                    var filename = file.name;
                    dropContainer.css("border-style", "none");
                    //UI.refreshCurrent();
                    UI.ask("get: " + file.xhr.responseText.replace(/"/g, ""));
                }

            };
            var dropzone = new Dropzone("#inputSink", dropOptions);
            dropContainer.data("dropzone", dropzone);
        }
    },

    /***
     * Makes
     * - .draggle class draggable
     * - .dropzone a zone where entities can be dropped
     * - .fileUploadZone a zone where file can be uploaded
     */
    makeDraggables: function() {
        var that = this;
        $(".draggable").kendoDraggable({
            hint: function(el) {
                var it = {
                    Title: el.data("title"),
                    Id: el.data("nodeid"),
                    Type: el.data("type")
                };
                var viz = $("<div class='trailDrag'>" + it.Title + "</div>");
                $.data(viz[0], "payload", it);
                return viz;
            },
            cursorOffset: {top: 0, left: 0}
        });
        var dropContainer = $("#dropContainer");
        $(".dropzone").kendoDropTarget({
            originalColor: null,
            dragenter: function() {
                dropContainer.originalColor = dropContainer.css("background-color");
                dropContainer.css("background-color", "orange");
            },
            dragleave: function() {
                dropContainer.css("background-color", dropContainer.originalColor);
            },
            drop: function(e) {
                //var payload = {
                //    Title: this.element.data("title"),
                //    Id: this.element.data("nodeid"),
                //    Type: this.element.data("type")
                //};
                var targetId = this.element.data("targetid");
                var payload = $.data(e.draggable["hint"][0], "payload");
                this.element.css("background-color", this.originalColor);

                if(payload.Type === "Entity") {
                    console.log("link: " + targetId + " with " + payload.Id);
                    $.when(Qwiery.linkEntities(targetId, payload.Id))
                        .fail(function(error) {
                            alert("Something went wrong. Did you try to link an entity to itself?");
                        })
                        .then(function(linkId) {
                            if(linkId === "00000000-0000-0000-0000-000000000000") {
                                alert("The link was not created; an object can't link to itself and a link between two entities can only be created once.");
                                return;
                            }
                            console.log("New link created with id " + linkId);
                            dropContainer.css("background-color", dropContainer.originalColor);
                            // ask to refresh the current item
                            UI.refreshCurrent();
                        });
                } else if(payload.Type === "Tag") {
                    Qwiery.tagEntity(targetId, payload.Title).fail(function(error) {
                        alert("Something went wrong. The entity was not tagged correctly.");
                    })
                        .then(function() {
                            dropContainer.css("background-color", dropContainer.originalColor);
                            // ask to refresh the current item
                            UI.refreshCurrent();
                        });
                } else
                    throw "Not sure what to do with type " + payload.Type;


            }
        });

        if(dropContainer.length > 0 && Qwiery.isUndefined(dropContainer.data("dropzone"))) {
            var dropOptions = {
                paramName: "dropContainer",
                url: Qwiery.serviceURL + "/files/upload",
                headers: {
                    "ApiKey": Qwiery.apiKey,
                    "targetId": $(".dropzone").data("targetid")
                },
                dragenter: function() {
                    dropContainer.originalColor = dropContainer.css("background-color");
                    dropContainer.css("background-color", "orange");
                },
                dragleave: function() {
                    dropContainer.css("background-color", dropContainer.originalColor);
                },
                maxFilesize: 2, // MB
                addRemoveLinks: false,
                clickable: false,
                success: function(file) {
                    var filename = file.name;
                    dropContainer.css("background-color", dropContainer.originalColor);
                    UI.refreshCurrent();
                }

            };
            var dropzone = new Dropzone("#dropContainer", dropOptions);
            dropContainer.data("dropzone", dropzone);
        }
    },

    /***
     * When an element has the data-toggle="popover" attribute then the
     * data-title and data-content attributes will be used to display a popover.
     */
    enablePopovers: function() {
        $('[data-toggle="popover"]').popover({
            trigger: 'hover',
            'placement': 'top'
        });
    },

    table: function(content) {
        var r = "<div>";
        var fields = UI.getTypeFields(content.Type);
        if(Qwiery.isUndefined(fields)) {
            r += "Fields for '" + content.Type + "' were not found.";
        }
        else {
            var tb = "<table>";
            for(var i = 0; i < fields.length; i++) {
                var field = fields[i];
                tb += "<tr><td style='width:150px;'>" +
                    field +
                    "</td><td><span class='fieldvalue'>" +
                    content[field] +
                    "</span></td></tr>";
            }
            tb += "</table>";
            r += tb;
        }
        r += "</div>";
        return r;
    },

    getTypeFields: function(type) {
        if(!type)
            return null;
        if(type.toLowerCase() === "string")
            return null;
        if(type.toLowerCase() === "tag") {
            return [
                "Title", "Description"
            ];
        }
        else if(type.toLowerCase() === "node") {
            return [
                "Title", "DataType"
            ];
        }
        else if(type.toLowerCase() === "person") {
            return [
                "Title", "FirstName", "LastName", "Description"
            ];
        }
        else if(type.toLowerCase() === "address") {
            return [
                "Title", "Addressline1", "Addressline2", "City", "Postalcode", "Country", "Description"
            ];
        }
        else if(type.toLowerCase() === "error") {
            return [
                "Title", "Severity", "Description"
            ];
        }
        else if(type.toLowerCase() === "simplesearchresult") {
            return [
                "Title", "WorkspaceName", "DataType"
            ];
        }
        else if(type.toLowerCase() === "userprofile") {
            return [
                "FriendlyName", "UserId"
            ];
        }
        else if(type.toLowerCase() === "workspace") {
            return [
                "Name"
            ];
        }
        else if(type.toLowerCase() === "workspaceinfo") {
            return [
                "Name", "Role"
            ];
        }
        else if(type.toLowerCase() === "thought") {
            return [
                "Title", "Description"
            ];
        }
        else if(type.toLowerCase() === "workspaceaccess") {
            return [
                "UserName", "Role"
            ];
        }
        console.log("List type " + type + " is not handled yet.");
        return null;
    },

    getTypeColumns: function(type) {
        if(!type)
            return null;
        if(type.toLowerCase() === "string")
            return null;
        if(type.toLowerCase() === "tag") {
            return [
                {
                    title: "&nbsp;",
                    template: "#= ++record #",
                    width: 30
                },
                {field: "Title", title: "Title", width: "130px"},
                {field: "Description", title: "Description", width: "130px"}
            ];
        }
        else if(type.toLowerCase() === "node" || type.toLowerCase() === "ientity") {
            return [

                {field: "Title", title: "Title", width: "130px"},
                {field: "DataType", title: "Type", width: "130px"},
                {command: {text: "View Details", click: UI.showRowDetails}, title: " ", width: "140px"}
            ];
        }
        else if(type.toLowerCase() === "error") {
            return [
                {field: "Title", title: "Title", width: "130px"},
                {field: "DataType", title: "Type", width: "130px"},
                {field: "Severity", title: "Severity", width: "30px"},
                {field: "Description", title: "Description", width: "30px"}
            ];
        }
        else if(type.toLowerCase() === "person") {
            return [
                {field: "Title", title: "Title", width: "130px"},
                {field: "Description", title: "Description", width: "130px"},
                {field: "FirstName", title: "First Name", width: "130px"},
                {command: {text: "View Details", click: UI.showRowDetails}, title: " ", width: "140px"}
            ];
        }
        else if(type.toLowerCase() === "appointment") {
            return [
                {field: "Title", title: "Title", width: "130px"},
                {field: "Description", title: "Description", width: "130px"},
                {field: "Start", title: "From", width: "130px"},
                {field: "End", title: "To", width: "130px"}
            ];
        }
        else if(type.toLowerCase() === "simplesearchresult") {
            return [
                {field: "Title", title: "Title", width: "130px"},
                {field: "WorkspaceName", title: "Space", width: "130px"},
                {field: "DataType", title: "Type", width: "130px"},
                {command: {text: "View Details", click: UI.showRowDetails}, title: " ", width: "140px"}
            ];
        }
        else if(type.toLowerCase() === "userprofile") {
            return [
                {field: "FriendlyName", title: "Name", width: "130px"},
                {field: "UserId", title: "Id", width: "130px"}
            ];
        }
        else if(type.toLowerCase() === "workspace") {
            return [
                {field: "Name", title: "Name", width: "130px"},
                {field: "Description", title: "Description", width: "130px"}
            ];
        }
        else if(type.toLowerCase() === "workspaceaccess") {
            return [
                {field: "FriendlyName", title: "Name", width: "130px"},
                {field: "Role", title: "Role", width: "130px"}
            ];
        }
        console.log("List type " + type + " is not handled yet.");
        return null;
    },

    serializeForm: function(form) {
        var o = {};
        var a = form.serializeArray();
        $.each(a, function() {
            if(o[this.name] !== undefined) {
                if(!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            }
            else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    },

    showRowDetails: function(e) {
        e.preventDefault();
        var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
        /*wnd.content(detailsTemplate(dataItem));
         wnd.center().open();*/
        UI.ask("get: " + (dataItem.NodeId || dataItem.Id));
    },

    changeBackgroundImage: function() {
        var choice = ["FreshGreen", "Bokhe", "Colorful", "BlueStars", "WildFlowers", "Sunset", "SmilingKids", "Minions", "Molecules", "Birdy", "Pencils", "Music", "Macarons"];
        $(".jumbotron").css("background-image", "url('/images/" + choice[Math.floor(Math.random() * choice.length)] + ".jpg')");
    },

    refreshCurrent: function() {
        if(Qwiery.isDefined(this.onRefreshCurrentRequest)) {
            this.onRefreshCurrentRequest();
        }
    },

    /***
     * Gets the querystring parameter with the given name.
     * @param name
     * @returns {string}
     */
    getParameterByName: function(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    },

    /***
     * Generic fail-handler for ajax requests.
     * @param deferred A promise.
     * @param callback The callback function or then-part.
     */
    fetch: function(deferred, callback) {
        try {
            $.when(deferred).then(callback).fail(function(xhr, status, err) {
                var error = Qwiery.formatErrorMessage(xhr, err);
                UI.showError(error);
            });
        }
        catch(e) {
            UI.showError(e.message);
            console.log(e.message);
        }
    },

    entityClick: function(e) {
        var item = $("#" + e.target.id);
        var data = item.data();
        var text = item.text();
        UI.ask({
            type: data === null ? null : data.type,
            id: data === null ? null : data.nodeid,
            title: text,
            isEntity: true
        });
    },

    getFileIcon: function(title) {
        var source = Qwiery.serviceURL + "/images/";
        if(title.toLowerCase().indexOf(".pdf") > 0) {
            source += "pdf.png";
        } else if(title.toLowerCase().indexOf(".jpg") > 0) {
            source += "image.png";
        } else if(title.toLowerCase().indexOf(".png") > 0) {
            source += "image.png";
        }
        else {
            source += "document.png";
        }
        return source;
    },

    /***
     * Parse the given input for things like
     * - keywords like 'agenda' which can be clicked to go straight to the agenda
     * @param input
     */
    parseMap: function(input) {
        //if(Qwiery.isUndefined(input)) return null;
        //var keywords = ['agenda', 'weather', 'ideas', 'images', 'favorites', 'people', 'tasks', 'documents', 'examples', 'thoughts', 'files'];
        //for(var k = 0; k < keywords.length; k++) {
        //    var keyword = keywords[k];
        //    input = input.replace(new RegExp(keyword, "gi"), "<span onClick='UI.ask(\"" + keyword + "\")' class='clickable'>" + keyword + "</span>");
        //}
        return input;
    },

    /***
     * Show an auto-hide success message.
     * @param msg
     */
    showSuccess: function(msg) {
        $("#successMessage").html(msg);
        $("#success-alert").show().fadeTo(5000, 500).slideUp(500, function() {
            $("#success-alert").hide();
        });
    },

    /***
     * Show an auto-hide error message.
     * @param msg
     */
    showError: function(msg) {

        $("#errorMessage").html(msg);
        $("#danger-alert").fadeTo(5000, 500).slideUp(500, function() {
            $("#danger-alert").hide();
        });
        console.log("Error> " + msg);
    },

    /***
     * Generic click handler on elements containing custom data attributes.
     * @param stuff
     */
    handleClick: function(self) {
        var item = $(self.target);
        var data = item.data();
        var text = item.text();
        // isentity comes from data-attribute and camelcase doesnt work well
        UI.ask({
            type: data === null ? null : data.type,
            id: data === null ? null : data.nodeid,
            title: text,
            isEntity: data === null ? null : data.isentity
        });
    },

    refreshGraphSummary: function() {
        if(this.elementsComponent) {
            this.elementsComponent.refresh();
        }
    },

    /***
     * Converts the session answer into renderable components.
     * @returns {Array}
     */
    getComponents: function(pods) {
        if(Qwiery.isUndefined(pods) || pods.length === 0) {
            return;
        }

        var components = [];
        // var dataTypeMap ={
        //     "SimpleContent": <SimpleContentComponent content={UI.parseMap(pod.Content)}/>
        // };

        for(var i = 0; i < pods.length; i++) {
            var pod = pods[i];
            if(Qwiery.isUndefined(pod.DataType)) {
                continue;
            }
            switch(pod.DataType) {
                case UI.constants.SimpleContent:
                    components.push(React.createElement(SimpleContentComponent, {content: UI.parseMap(pod.Content)}));
                    break;
                case UI.constants.SingleEntity:
                    if(Qwiery.isUndefined(pod.Entity)) {
                        UI.showError("This entity does not exist or has been deleted.");
                        continue;
                    }
                    components.push(React.createElement(SingleEntityComponent, {key: Qwiery.randomId(), entity: pod.Entity}));
                    break;
                case  UI.constants.MultiEntitycase :
                    components.push(React.createElement(MultiEntityComponent, React.__spread({},  pod)));
                    break;
                case   UI.constants.Error:
                    UI.showError(pod.Error);
                    continue;
                    break;
                case   UI.constants.CurrentAgenda:
                    components.push(React.createElement(AgendaComponent, React.__spread({},  pod)));
                    break;
                case   UI.constants.Files:
                    components.push(React.createElement(FilesComponent, React.__spread({},  pod)));
                    break;
                case   UI.constants.Images:
                    components.push(React.createElement(ImagesComponent, React.__spread({},  pod)));
                    break;
                case   UI.constants.Script:
                    components.push(React.createElement(ScriptComponent, React.__spread({},  pod)));
                    break;
                case   UI.constants.GraphContainer:
                    components.push(React.createElement(GraphContainerComponent, React.__spread({},  pod)));
                    break;
                case   UI.constants.Tasks:
                    components.push(React.createElement(TasksComponent, React.__spread({},  pod)));
                    break;
                case   UI.constants.Weather:
                    components.push(React.createElement(WeatherComponent, React.__spread({},  pod)));
                    break;
                case   UI.constants.Favorites:
                    components.push(React.createElement(FavoritesComponent, React.__spread({},  pod)));
                    break;
                case   UI.constants.Thoughts:
                    components.push(React.createElement(ThoughtsComponent, React.__spread({},  pod)));
                    break;
                case   UI.constants.TagEntities:
                    components.push(React.createElement(TagEntitiesComponent, React.__spread({tag: pod.Tag},  pod)));
                    break;
                case   UI.constants.Entities:
                    components.push(React.createElement(EntitiesComponent, React.__spread({},  pod)));
                    break;
                case   UI.constants.Item:
                    components.push(React.createElement(ItemComponent, React.__spread({},  pod)));
                    break;
                case   UI.constants.WikipediaItem:
                    components.push(React.createElement(WikipediaItemComponent, React.__spread({},  pod)));
                    break;
                case   UI.constants.GraphItem:
                    components.push(React.createElement(GraphItemComponent, React.__spread({},  pod)));
                    break;
                case   UI.constants.Addresses:
                    components.push(React.createElement(AddressesComponent, React.__spread({},   pod)));
                    break;
                case   UI.constants.BingItem:
                    components.push(React.createElement(BingItemComponent, React.__spread({},   pod)));
                    break;
                case   UI.constants.Tags:
                    components.push(React.createElement(TagsComponent, React.__spread({},   pod)));
                    break;
                case   UI.constants.People:
                    components.push(React.createElement(PeopleComponent, React.__spread({},  pod)));
                    break;
                case   UI.constants.History:
                    components.push(React.createElement(HistoryComponent, React.__spread({},  pod)));
                    break;
                case   UI.constants.PersonalityOverview:
                    components.push(React.createElement(PersonalityOverviewComponent, React.__spread({},  pod)));
                    break;
                case   UI.constants.Wikipedia:
                    components.push(React.createElement(WikipediaComponent, React.__spread({},  pod)));
                    break;
                case   UI.constants.EditEntity:
                    components.push(React.createElement(SingleEntityComponent, {key: Qwiery.randomId(), mode: " edit", entity: pod}));
                    break;
                case   UI.constants.WolframAlpha:
                    components.push(React.createElement(WolframAlphaComponent, React.__spread({},  pod)));
                    break;
                case   UI.constants.Bing:
                    components.push(React.createElement(BingComponent, React.__spread({},  pod)));
                    break;
                case   UI.constants.Workspaces:
                    components.push(React.createElement(WorkspacesComponent, React.__spread({},  pod)));
                    break;
                case   UI.constants.GraphSearch:
                    components.push(React.createElement(GraphSearchComponent, React.__spread({},  pod)));
                    break;
                case   UI.constants.Profile:
                    components.push(React.createElement(ProfileComponent, React.__spread({},  pod)));
                    break;
                case   UI.constants.Login:
                    components.push(React.createElement(LoginComponent, {email: pod.email}));
                    break;
                case   UI.constants.Html:
                    components.push(React.createElement(HtmlComponent, React.__spread({},  pod)));
                    break;
                case   UI.constants.Iframe:
                    components.push(React.createElement(IframeComponent, React.__spread({},  pod)));
                    break;
                case   UI.constants.Service:
                    components.push(React.createElement(ServiceComponent, React.__spread({},  pod)));
                    break;
                case   UI.constants.DataViz:
                    components.push(React.createElement(DataVizComponent, React.__spread({},  pod)));
                    break;
                case   UI.constants.Video:
                    components.push(React.createElement(VideoComponent, React.__spread({},  pod)));
                    break;
            }
        }
        return components;

    },

    /***
     * Async fetching the url of the main image of the Wikipedia article with the given page name.
     * @param pageName
     * @returns {Promise}
     */
    getWikipediaImage: function(pageName) {
        var url;
        return new Promise(function(resolve, reject) {
            $.ajax({
                dataType: "jsonp",
                url: "https://en.wikipedia.org/w/api.php?action=query&titles=" + pageName + "&prop=pageimages&format=json&pithumbsize=500",
                async: false
            }).then(function(r) {
                try {
                    resolve(r.query.pages[Object.keys(r.query.pages)[0]].thumbnail.source);
                } catch(e) {
                    reject(e.message);
                }
            });
        });
    },

    /***
     * Saves the given blob of info (WikipediaItem e.g.) to a graphdb entity.
     * @param blob Can be anything really.
     */
    saveAsEntity: function(blob) {
        var that = this;

        function saveit(resolve) {
            if(blob.DataType) {
                var entity;
                switch(blob.DataType) {
                    case "WikipediaItem":
                        that.getWikipediaImage(blob.PageName).then(function(url) {
                            entity = {
                                DataType: "Thought",
                                Title: blob.PageName,
                                Description: "![Image](" + url + ") See [the page](" + blob.Url + ") for more info."
                            };
                            Qwiery.upsertEntity(entity).then(function(newid) {
                                resolve(newid);
                            });
                        });
                        break;
                    case "BingItem":
                        entity = {
                            DataType: "Thought",
                            Title: blob.Title,
                            Description: blob.Description + "\n\nSee [the page](" + blob.Url + ") for more info."
                        };
                        Qwiery.upsertEntity(entity).then(function(newid) {
                            resolve(newid);
                        });
                        break;
                }

            } else {
                console.warn("The blob to be saved to GraphDB did not have a DataType.");
                UI.showError("The item could not be saved, no data type was specified.");
                resolve(null);
            }
        }

        return new Promise(function(resolve, reject) {
            saveit(resolve);
        });

    },

    /***
     * Injects a random Flickr image in the given HTML id.
     * @param id
     */
    injectFlickr: function(id) {
        $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
            {
                tags: "nature",
                tagmode: "any",
                format: "json"
            },
            function(data) {
                var rnd = Math.floor(Math.random() * data.items.length);

                var image_src = data.items[rnd]['media']['m'].replace("_m", "_b");
                $("#" + id).append("<img src='" + image_src + "' style='width:75%;'/>");
            });
    }

};

var Pods = {
    Create: function(options) {
        return [_.extend({
            Header: "",
            DataType: UI.constants.Error,
            HeaderIsVisible: true,
            BodyIsVisible: true,
            CanManipulate: false,
            IsError: true,
            Id: null
        }, options)];
    }
};
var DashboardComponent = React.createClass(
    {displayName: "DashboardComponent",
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
                return React.createElement("div", {id: this.componentId, key: this.componentId, className: "trailer"}, 
                    React.createElement("div", {id: "trailer", key: "trailer"}, 
                        React.createElement("ul", {className: "breadcrumb"}, this.renderTrailItems())
                    )
                );
            } else {
                return React.createElement("div", {id: this.componentId, key: this.componentId, className: "trailer"});
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
                return React.createElement(TrailItem, {data: t, key: t.Id, handleClick: UI.handleClick});
            });
        }
    }
);
/***
 * Renders your data.
 */
var DataVizComponent = React.createClass({displayName: "DataVizComponent",

    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        this.config = this.props.Config;
        this.type = this.props.Viz;
        return {};
    },

    render: function() {
        return React.createElement("div", {id: this.componentId, className: "DataViz"})
    },

    componentDidMount: function() {
        switch(this.type.toLowerCase()) {
            case "grid":
                this.renderGrid();
                break;
            case "spreadsheet":
                this.renderSpreadsheet();
                break;
            case "chart":
                this.renderChart();
                break;
            case "stock":
                this.renderStock();
                break;
            case "treemap":
                this.renderTreemap();
                break;
            case "map":
                this.renderMap();
                break;
        }
    },
    renderGrid: function() {
        $("#" + this.componentId).kendoGrid(this.config);
    },
    renderSpreadsheet: function() {
        $("#" + this.componentId).kendoSpreadsheet(this.config);
    },
    renderChart: function() {
        $("#" + this.componentId).kendoChart(this.config);
    },
    renderStock: function() {
        $("#" + this.componentId).kendoStockChart(this.config);
    },
    renderTreemap: function() {
        $("#" + this.componentId).kendoTreeMap(this.config);
        var treeMap = $("#" + this.componentId).getKendoTreeMap();
        treeMap.resize();
    },
    renderMap: function() {
        $("#" + this.componentId).kendoMap(this.config);
    }

});
var DocumentComponent = React.createClass({displayName: "DocumentComponent",
    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        this.contentId = Qwiery.randomId();
        this.relatedId = Qwiery.randomId();

        // clone in case of cancel
        this.entity = jQuery.extend({}, this.props.entity);
        var mode = (this.props.mode || "read").toLowerCase();
        if(mode !== "read" && mode !== "edit" && mode !== "deleted") {
            this.error = "The 'mode' attribute can only be 'read', 'deleted' or 'edit'.";
            return {mode: "error"};
        }
        if(Qwiery.isUndefined(this.entity)) {
            this.error = "No 'entity' attribute specified.";
            return {mode: "error"};
        }
        this.type = this.entity.Type;
        return {
            mode: mode
        };
    },

    finishedEditing: function(obj) {
        if(Qwiery.isDefined(this.props.finishedEditing)) {
            this.props.finishedEditing(obj);
        }
    },

    editEntity: function() {
        this.setState({mode: "edit"});
    },

    cancelEdit: function() {
        event.preventDefault();
        this.finishedEditing({
            refresh: false,
            entity: this.props.entity
        });
    },
    handleChange: function(event) {
        if(event.target.id === "titleBox")
            this.entity.Title = event.target.value;
        else
            this.entity.Description = event.target.value;
        this.setState({entity: this.entity});
    },
    saveEdit: function(event) {
        var that = this;
        event.preventDefault();
        var postUpdate = function(data) {
            console.log("Upserted the Image " + that.entity.Id);
            //showMessage(data === true ? "The data was saved." : "Please try again, something happened along the way."); }
            that.finishedEditing({
                refresh: false,
                entity: that.entity
            });
        };
        $.when(Qwiery.upsertEntity(this.entity)).then(postUpdate);//UI.serializeForm($("#ImageEditor")))
    },

    render: function() {
        if(this.state.mode === "error") {
            return React.createElement("div", {id: this.componentId, key: this.componentId, className: "alert alert-danger", role: "alert"}, React.createElement("span", {
                className: "glyphicon glyphicon-exclamation-sign", "aria-hidden": "true"}), " ", this.error);
        }
        else if(this.state.mode === "read") {
            var adr = UI.getFileIcon(this.entity.Title);
            return React.createElement("div", {id: this.componentId, key: this.componentId}, 
                React.createElement("p", null, "The document cannot be embedded here, you need to click on the link below to open it:"), 
                React.createElement("p", null, React.createElement("img", {src: adr, style: {"width":"15px", "margin":"0 5px"}}), React.createElement("a", {target: "_blank", href: Qwiery.serviceURL + "/uploads/" + this.entity.Source, style: {width: "100%", padding: 15}}, this.entity.Title))
            );
        } else if(this.state.mode === "edit") {
            return React.createElement("div", {id: this.componentId, key: this.componentId}, 
                React.createElement("div", null, "Editing an image is not possible yet.")
            );
        }
        else if(this.state.mode === "deleted") {
            return React.createElement("div", {id: this.componentId, key: this.componentId}, 
                React.createElement("div", {className: "well"}, React.createElement("span", {
                    className: "glyphicon glyphicon-exclamation-sign", "aria-hidden": "true"}), " This entity was deleted."
                )
            );
        }


    }
});
/***
 * A data grid of entities.
 */
var EntitiesComponent = React.createClass({displayName: "EntitiesComponent",

    getInitialState: function() {
        this.componentId = Qwiery.randomId();

        return {};
    },

    render: function() {
        return React.createElement("div", {id: this.componentId})
    },

    componentDidMount: function() {
        var that = this;
        var presentEntities = function(entities) {
            var cols = UI.getTypeColumns("IEntity");
            $("#" + that.componentId).kendoGrid({
                dataSource: {
                    data: entities,
                    pageSize: 10
                },
                height: 500,
                columns: cols,
                pageable: true
            });
        };
        UI.fetch(Qwiery.getRecentEntities(), presentEntities);
    }
});

/***
 * Displays a message as an error.
 *
 * <Error error='some error message here'/>
 */
var ErrorComponent = React.createClass({displayName: "ErrorComponent",
    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        this.error = this.props.error || "The 'error' attribute of the ErrorComponent was not specified.";
        return {};
    },
    render: function() {
        var err = this.props.error;
        if(Qwiery.isUndefined(err)){
            err = "Hm, there was an error somewhere but it did not reach me on time. Sorry.";
        }
        if(err.toLowerCase().indexOf("error:")===0){
            err = err.substring(6);
        }
        return React.createElement("div", {id: this.componentId, key: this.componentId, className: "alert alert-danger", role: "alert"}, React.createElement("span", {
            className: "glyphicon glyphicon-exclamation-sign", "aria-hidden": "true"}), " ", err);
    }
});
/***
 * Presents the favorites.
 * var things = [
 {
           "Title": "Task 1",
           "Description": "",
           "Id": "9cd3ee05-7612-441d-b780-7dba087f4011",
 }
 *
 * ]
 * <FavoritesComponent favorites=things/>
 */
var FavoritesComponent = React.createClass({displayName: "FavoritesComponent",
    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        this.favorites = this.props.favorites;

        return {};
    },
    render: function() {
        return React.createElement("div", {id: this.componentId, style: {border:"none","min-height":"30px"}});
    },
    
    adorn: function() {
        var that = this;

        $.when(Qwiery.getFavorites()).then(function(favorites) {
            that.favorites = favorites;
            if(Qwiery.isUndefined(favorites) || favorites.length === 0) {
                that.$container.append("<div>You don't have any favorites right now.</div>");
            }
            else {
                for(var k = 0; k < favorites.length; k++) {
                    var favorite = favorites[k];
                    var $item = $('<div class="favorite-wall-item"  onClick="UI.ask(\'get:' + favorite.Id + '\')"><span class="glyphicon glyphicon-star" style="font-size:15px; float: left;margin-right: 5px;"></span><span class="favorite-title">' + favorite.Title + '</span><p class="favorite-description">' + favorite.Description + '</p></div>');
                    that.$container.append($item);
                    $item.hide();
                    that.iso.isotope('appended', $item);
                    that.iso.isotope('layout');
                    $item.fadeIn(500);
                }
            }

        });
    },
    componentDidUpdate: function() {
        //this.adorn();
        this.iso.isotope('layout');
    },
    componentDidMount: function() {
        this.$container = $("#" + this.componentId);
        this.iso = this.$container.isotope({
            itemSelector: '.favorite-wall-item',
            masonry: {
                columnWidth: '.favorite-wall-item'
            }
        });
        this.adorn();
    }
});


/***
 * A component to present the uploaded files.
 */
var FilesComponent = React.createClass({displayName: "FilesComponent",

    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        return {};
    },

    render: function() {
        return React.createElement("div", {id: this.componentId})
    },

    componentDidMount: function() {
        var that = this;
        var presentFiles = function(a) {
            if(Qwiery.isUndefined(a) || a.length === 0) {
                $("#" + that.componentId).append("<div>You have not uploaded any files yet.</div>");
            } else {
                var $hul = $("#" + that.componentId).append("<ul></ul>");
                _.forEach(a, function(e) {
                    var im = UI.getFileIcon(e.Title);
                    var toAppend = "<li><img style='width:15px; margin:0 5px;' src='" + im + "'/><span id=" + Qwiery.randomId() + " class='fileItem clickable'  data-nodeid='" + e.Id + "' data-title='" + e.Title + "' title='" + e.Title + "' data-type='" + e.Type + "' >" + e.Title + "</span></li>";
                    $hul.append(toAppend);
                });
                $(".fileItem").click(function(e) {
                    UI.entityClick(e);
                });
            }
        };
        UI.fetch(Qwiery.getFiles(), presentFiles);

    }
});
var GlobalUsageComponent = React.createClass({displayName: "GlobalUsageComponent",
    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        busy = false;
        return {};
    },
    render: function() {
        return React.createElement("div", {id: this.componentId});
    },

    adorn: function() {
        var that = this;

        Qwiery.globalUsage()
            .then(function(data) {

                $("#" + that.componentId) .kendoChart({
                    title: {
                        text: "Global usage"
                    },
                    legend: {
                        visible: false
                    },
                    seriesDefaults: {
                        type: "column"
                    },
                    series: [{
                        name: "Question",
                        data: data,
                        field: "Weight",
                        overlay: {
                            gradient: "none"
                        },
                        categoryField: "Type"
                    }]

                });

            }).fail(function(error) {
            $("#content" + that.componentId).html(error);

        });
    },
    componentDidUpdate: function() {
        this.adorn();
    },
    componentDidMount: function() {
        this.adorn();
    }

});



var GraphContainerComponent = React.createClass({displayName: "GraphContainerComponent",
    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        this.graph = this.props.Graph;
        this.nodes = this.graph.Nodes;
        this.error = null;
        if(this.nodes.length > 1) {
            this.error = "More than one node in the graph is currently not supported.";
        }
        this.id = this.nodes[0].Id;
        this.dataType = this.nodes[0].DataType;
        this.entity = null;
        return {};
    },
    render: function() {
        if(this.error !== null) {
            return React.createElement("div", null, this.error)
        }
        if(Qwiery.isUndefined(this.entity)) {
            return React.createElement("div", null);
        }
        else
            return React.createElement(SingleEntityComponent, {key: Qwiery.randomId(), entity: this.entity, askFor: this.props.askFor});
    },
    componentDidMount: function() {
        var that = this;
        $.when(Qwiery.getEntity(this.id)).then(function(entity) {
            that.entity = entity;
            that.forceUpdate();
        });
        //$.when(Qwiery.getEntity(this.id), Qwiery.getEditor(this.dataType)).done(function(entityAnswer, editorAnswer) {
        //    var data = entityAnswer[0];
        //    var editor = editorAnswer[0];
        //    editor = editor.replace("$$typekey", data["$typekey"]);
        //    var matches = editor.match(/\$(\w*)/g);
        //    if(Qwiery.isDefined(matches)) {
        //        for(var i = 0; i < matches.length; i++) {
        //            var match = matches[i].slice(1).trim();
        //            if(match.indexOf("(") == 0 || match.length === 0 || match == "typekey")
        //                continue;
        //            if(data.hasOwnProperty(match)) {
        //                editor = editor.replace("$" + match, data[match]);
        //            }
        //            else {
        //                editor = editor.replace("$" + match, "");
        //            }
        //        }
        //    }
        //
        //    $("#" + that.componentId).html(editor);
        //
        //}).fail(function(error) {
        //    $("#content" + that.componentId).html(error);
        //
        //});


    }
});

/***
 * Presents a graph item.
 *
 * <GraphItemComponent/>
 */
var GraphItemComponent = React.createClass({displayName: "GraphItemComponent",
    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        this.page = this.props.Page;
        this.items = this.props.Other;
        this.pageName = this.props.PageName;
        return {};
    },
    render: function() {
        // $.ajax({dataType: "jsonp", url: "https://en.wikipedia.org/w/api.php?action=query&titles=" + pageName + "&prop=pageimages&format=json&pithumbsize=500"}).then(function(r) {
        //     try {
        //         var imageUrl = r.query.pages[Object.keys(r.query.pages)[0]].thumbnail.source;
        //         container.append("<img src='" + imageUrl + "'/>");
        //     } catch(e) {
        //
        //     }
        //     container.append("<ul>");
        //     _.forEach(page, function(v, k) {
        //         k = k.replace(/_/gi, "");
        //         if(v.indexOf("plainlist") > 0) {
        //
        //         } else {
        //             container.append("<li><strong>" + k + "</strong>: " + v + "</li>")
        //         }
        //     });
        //     container.append("</ul>");
        // })
        var seq = [];
        if(Qwiery.isDefined(this.props.Title) && this.props.Title.length > 0) {
            if(Qwiery.isDefined(this.props.Url) && this.props.Url.length > 0) {
                seq.push(React.createElement("div", null, React.createElement("strong", null, React.createElement("a", {href: this.props.Url, target: "_blank"}, this.props.Title))));
            }
            else {
                seq.push(React.createElement("div", null, 
                    React.createElement("strong", {className: "clickable", "data-type": "SingleEntity", "data-title": this.props.Title, "data-nodeid": this.props.Id, "data-isentity": "true", onClick: UI.handleClick}, this.props.Title)));
            }
        }
        if(Qwiery.isDefined(this.props.Description) && this.props.Description.length > 0) {
            seq.push(React.createElement("div", null, this.props.Description));
        }
        if(Qwiery.isDefined(this.props.ImageSource) && this.props.ImageSource.length > 0) {
            seq.push(React.createElement("img", {style: {width:400}, src: this.props.ImageSource}));
        }
        return React.createElement("div", {id: this.componentId, className: "GraphItem"}, React.createElement("i", {className: "fa fa-share-alt iconfix"}), seq);


    },

    componentDidMount: function() {

    }
});



var GraphSearchComponent = React.createClass({displayName: "GraphSearchComponent",
    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        return {};
    },
    render: function() {
        return React.createElement("div", {id: this.componentId});
    },
    componentDidMount: function() {
        var that = this;
        $.when(Qwiery.searchGraph(this.props.Term, this.props.DataType))
            .then(function(data) {
                var cols = UI.getTypeColumns("SimpleSearchResult");
                $("#" + that.componentId).kendoGrid({
                    dataSource: {
                        data: data,
                        pageSize: 10
                    },
                    columns: cols,
                    pageable: true,
                    // dataBinding: function () { record = (this.dataSource.page() - 1) * this.dataSource.pageSize() - 1; }
                });

            }).fail(function(error) {
                $("#content" + that.componentId).html(error);

            });
    }

});

var GraphSummaryComponent = React.createClass({displayName: "GraphSummaryComponent",
    getInitialState: function() {
        this.favorites = [];
        this.tags = [];
        this.componentId = Qwiery.randomId();
        return {
            dataLoaded: false
        };
    },

    render: function() {
        if(this.state.dataLoaded) {
            return React.createElement("div", {className: "lister", id: this.componentId, key: this.componentId}, 
                React.createElement("ul", {className: "list-inline"}, this.renderItems(this.favorites)), 
                React.createElement("ul", {className: "list-inline"}, this.renderItems(this.tags))
            );
        }
        else {
            return React.createElement("div", {className: "lister", id: this.componentId, key: this.componentId}
            );
        }
    },
    renderItems: function(items) {
        var that = this;
        return _.map(items, function(t) {
            var iconClass = "";
            var thetitle = "";
            if(t.Type === "Tag") {
                thetitle = "Tag";
                iconClass = "fa fa-tag TagIcon";
            } else if(t.IsEntity) {
                thetitle = "Entity [" + t.DataType + "]";

                if(t.IsFavorite) {
                    iconClass = "fa fa-star FavoriteIcon";
                } else {
                    iconClass = "fa fa-square EntityIcon";
                }
            } else {
                thetitle = "Entity";
            }

            return React.createElement("li", {key: t.Id}, React.createElement("i", {className: iconClass, ariaHidden: "true"}), React.createElement("a", {href: "#", id: Qwiery.randomId(), 
                                                                                    "data-type": t.Type, 
                                                                                    "data-title": t.Title, 
                                                                                    "data-nodeid": t.NodeId || t.Id, 
                                                                                    "data-isentity": t.IsEntity, 
                                                                                    onClick: UI.handleClick, 
                                                                                    "data-toggle": "popover", title: thetitle, 
                                                                                    "data-html": "true", 
                                                                                    className: "draggable", 
                                                                                    "data-content": t.Title}, t.Title)
            );
        });


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
    refresh: function() {
        this.tags = [];
        this.favorites = [];
        this.setState({
            visibility: "visible",
            dataLoaded: false
        });
    },
    fetchData: function() {
        if(this.state.dataLoaded)return;
        var that = this;
        $.when(Qwiery.getFavorites(), Qwiery.getTags()).then(function(f, t) {
            var favs = f[0];
            var tags = t[0];
            for(var k = 0; k < favs.length; k++) {
                var fav = favs[k];
                var item = {
                    Id: fav.Id,
                    Title: fav.Title,
                    IsEntity: true,
                    DataType: fav.DataType || "Entity",
                    IsFavorite: true
                };
                that.favorites.push(item);
            }
            for(var k = 0; k < tags.length; k++) {
                var tag = tags[k];
                that.tags.push({
                    Id: tag.Id,
                    Title: tag.Title,
                    IsEntity: true,
                    Type: "Tag",
                    IsFavorite: false
                })
            }
            that.setState({
                dataLoaded: true
            });
        });
    },

    askFor: null,

    addFavorite: function(item) {
        if(this.favorites.length > 10) {
            delete this.favorites[this.favorites.length - 1];
        }
        this.favorites.unshift(item);
        this.setState({
            dataLoaded: true
        });
    },
    removeFavorite: function(id) {
        _.remove(this.favorites, function(r) {
            return r.Id === id;
        });
        this.setState({
            dataLoaded: true
        });
    }
});

/***
 * A data grid of entities.
 */
var GridComponent = React.createClass({displayName: "GridComponent",

    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        this.entities = this.props.entities;
        this.type = this.props.type;
        return {};
    },

    render: function() {
        return React.createElement("div", {id: this.componentId})
    },

    componentDidMount: function() {
        var cols = UI.getTypeColumns(this.type);
        $("#" + this.componentId).kendoGrid({
            dataSource: {
                data: this.entities,
                pageSize: 10
            },
            height: 500,
            columns: cols,
            pageable: true
        });
    }
});
var HistoryComponent = React.createClass(
    {displayName: "HistoryComponent",
        getInitialState: function() {
            this.componentId = Qwiery.randomId();
            return {};
        },
        componentDidUpdate: function() {
        },
        componentDidMount: function() {
            var $history = $("#" + this.componentId);
            var that = this;
            Qwiery.getHistory().then(function(data) {


                if(Qwiery.isUndefined(data) || data.length === 0) {
                    $history.append("<div>You have not asked any questions yet!?</div>");
                } else {
                    var mapped = _.map(data, function(e) {
                        return {
                            timestamp: new Date(e.Timestamp).toLocaleString(),
                            question: e.Input,
                            id: e.CorrelationId
                        };
                    });
                    $("#" + that.componentId).kendoGrid({
                        dataSource: {
                            data: mapped,
                            pageSize: 10
                        },
                        sortable: {
                            mode: "single",
                            allowUnsort: true
                        },
                        columns: [
                            {field: "timestamp", title: "When"},
                            {field: "question", title: "What"}
                        ],
                        detailTemplate: "<div id='bucket'></div>",
                        detailInit: that.detailInit,
                        pageable: true
                        // dataBinding: function () { record = (this.dataSource.page() - 1) * this.dataSource.pageSize() - 1; }
                    });
                }
            });
        },
        detailInit: function(e) {
            var detailRow = e.detailRow;
            var bucket = detailRow.find("#bucket");
            var id = e.data.id;
            if(Qwiery.isUndefined(id)) {
                throw "Ouch, the id is not available."
            }
            Qwiery.getHistoryItem(id).then(function(details) {
                var e = details;
                if(_.isString(e)) { // mock backend is JSON, remote is string
                    e = JSON.parse(e);
                }
                var trace = "";
                var oracleTraceItem = _.find(e.Trace, function(u) {
                    return u.Oracle !== undefined;
                });
                if(Qwiery.isDefined(oracleTraceItem) && oracleTraceItem.Oracle.length > 0) {
                    var stack = oracleTraceItem.Oracle;
                    trace += "<ul>";
                    for(var k = 0; k < stack.length; k++) {
                        var item = stack[k];
                        trace += "<li><strong>" + item.Head + "</strong>: " + item.Grab;
                        trace += "</li>";
                    }
                    trace += "</ul>";
                } else {
                    trace = "None received";
                }
                var errorTraceItems = _.filter(e.Trace, function(u) {
                    return u.Error !== undefined;
                });
                var html = "<div><strong>Exchange:</strong> " + e.ExchangeId + "</div>" +
                    "<div><strong>Input:</strong> " + e.Input.Raw + " &raquo; <span class='clickable' onClick='UI.ask(\"" + e.Input.Raw + "\")'>ask again</span></div>" +
                    "<div><strong>When:</strong> " + new Date(e.Input.Timestamp).toLocaleString() + "</div>" +
                    "<div><strong>CorrelationId:</strong> " + id + "</div>" +
                    "<div><strong>Answer type:</strong> " + e.Output.Answer[0].DataType + "</div>" +
                    "<div><strong>Processing errors:</strong> " + (errorTraceItems.length ) + "</div>" +
                    "<div><strong>Trace:</strong> " + trace + "</div>";

                bucket.append(html);
            });


        },
        render: function() {
            return React.createElement("div", {id: this.componentId, key: this.componentId, className: "ProfileRoot"}
            );
        },

        askFor: null,

        raiseAskFor: function(options) {
            UI.ask(options)
        }
    }
);

/***
 * A component to present HTML.
 */
var HtmlComponent = React.createClass({displayName: "HtmlComponent",

    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        this.html = this.props.Html;
        this.javascript = this.props.JavaScript;
        return {};
    },

    render: function() {
        return React.createElement("div", {id: this.componentId})
    },

    componentDidMount: function() {
        $("#" + this.componentId).html(this.html);
        if(Qwiery.isDefined( this.javascript)){
            eval( this.javascript);
        }
    }
});
/***
 * A component to present an iframe.
 */
var IframeComponent = React.createClass({displayName: "IframeComponent",

    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        this.url = this.props.URL;
        return {};
    },

    render: function() {
        return React.createElement("div", {id: this.componentId})
    },

    componentDidMount: function() {
        var html = "<iframe ";
        if(this.props.Width) {
            html += "width=\"" + this.props.Width + "\"";
        }
        if(this.props.Height) {
            html += "height=\"" + this.props.Height + "\"";
        }
        html += "src=\"" + this.url + "\"></iframe>";
        $("#" + this.componentId).html(html);
    }
});
var ImageComponent = React.createClass({displayName: "ImageComponent",
    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        this.contentId = Qwiery.randomId();
        this.relatedId = Qwiery.randomId();

        // clone in case of cancel
        this.entity = jQuery.extend({}, this.props.entity);
        var mode = (this.props.mode || "read").toLowerCase();
        if(mode !== "read" && mode !== "edit" && mode !== "deleted") {
            this.error = "The 'mode' attribute can only be 'read', 'deleted' or 'edit'.";
            return {mode: "error"};
        }
        if(Qwiery.isUndefined(this.entity)) {
            this.error = "No 'entity' attribute specified.";
            return {mode: "error"};
        }
        this.type = this.entity.Type;
        return {
            mode: mode
        };
    },

    finishedEditing: function(obj) {
        if(Qwiery.isDefined(this.props.finishedEditing)) {
            this.props.finishedEditing(obj);
        }
    },

    editEntity: function() {
        this.setState({mode: "edit"});
    },

    cancelEdit: function() {
        event.preventDefault();
        this.finishedEditing({
            refresh: false,
            entity: this.props.entity
        });
    },
    handleChange: function(event) {
        if(event.target.id === "titleBox")
            this.entity.Title = event.target.value;
        else
            this.entity.Description = event.target.value;
        this.setState({entity: this.entity});
    },
    saveEdit: function(event) {
        var that = this;
        event.preventDefault();
        var postUpdate = function(data) {
            console.log("Upserted the Image " + that.entity.Id);
            //showMessage(data === true ? "The data was saved." : "Please try again, something happened along the way."); }
            that.finishedEditing({
                refresh: false,
                entity: that.entity
            });
        };
        $.when(Qwiery.upsertEntity(this.entity)).then(postUpdate);//UI.serializeForm($("#ImageEditor")))
    },

    render: function() {
        if(this.state.mode === "error") {
            return React.createElement("div", {id: this.componentId, key: this.componentId, className: "alert alert-danger", role: "alert"}, React.createElement("span", {
                className: "glyphicon glyphicon-exclamation-sign", "aria-hidden": "true"}), " ", this.error);
        }
        else if(this.state.mode === "read") {
            return React.createElement("div", {id: this.componentId, key: this.componentId}, 
                React.createElement("img", {src: Qwiery.serviceURL + "/uploads/" + this.entity.Source, style: {width: "100%", padding: 15}})
            );
        } else if(this.state.mode === "edit") {
            return React.createElement("div", {id: this.componentId, key: this.componentId}, 
                React.createElement("div", null, "Editing an image is not possible yet.")
            );
        }
        else if(this.state.mode === "deleted") {
            return React.createElement("div", {id: this.componentId, key: this.componentId}, 
                React.createElement("div", {className: "well"}, React.createElement("span", {
                    className: "glyphicon glyphicon-exclamation-sign", "aria-hidden": "true"}), " This entity was deleted."
                )
            );
        }


    }
});

/***
 * A component to present the image files.
 */
var ImagesComponent = React.createClass({displayName: "ImagesComponent",

    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        return {};
    },

    render: function() {
        return React.createElement("div", {id: this.componentId})
    },

    componentDidMount: function() {
        var that = this;
        var presentFiles = function(a) {
            if(Qwiery.isUndefined(a) || a.length === 0) {
                $("#" + that.componentId).append("<div>You have not uploaded any images yet.</div>");
            } else {
                var $hul = $("#" + that.componentId).append("<ul></ul>");
                _.forEach(a, function(e) {
                    var im = UI.getFileIcon(e.Title);
                    var toAppend = "<li><img style='width:15px; margin:0 5px;' src='" + im + "'/><span id=" + Qwiery.randomId() + " class='fileItem clickable'  data-nodeid='" + e.Id + "' data-title='" + e.Title + "' title='" + e.Title + "' data-type='" + e.Type + "' >" + e.Title + "</span></li>";
                    $hul.append(toAppend);
                });
                $(".fileItem").click(function(e) {
                    UI.entityClick(e);
                });
            }
        };
        UI.fetch(Qwiery.getImages(), presentFiles);

    }
});
var InputComponent = React.createClass({displayName: "InputComponent",
    getInitialState: function() {
        this.input = null;
        this.componentId = Qwiery.randomId();
        return {};
    },

    render: function() {
        return React.createElement("div", {className: "inputer", dataStuff: "3", id: this.componentId, key: this.componentId}, 
            React.createElement("input", {type: "text", id: "inputBox", className: "inputComponentBox", 
                   style: {outline: "none", boxShadow:"none"}, 
                   placeholder: "ask something"}), 
            React.createElement("img", {id: "avatar", src: "https://graph.facebook.com/100006530520618/picture", onClick: this.gotoProfile, 
                 className: "avatar"})
        );
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
//babel components --out-dir components

/***
 * The main component presenting Qwiery answers and other info.
 */
var InteractionComponent = React.createClass({displayName: "InteractionComponent",
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
        return React.createElement("div", {className: "interacter", id: this.componentId, key: this.componentId}, 
            React.createElement("div", {style: display}, 
                this.renderMainHeader(), 
                React.createElement("div", {id: "podContainer"}), 
                React.createElement("div", {className: "FeebackLine", style: display}, 
                    React.createElement("div", {className: "FeedbackLink", onClick: UI.showFeedbackDialog}, "Feedback")
                )
            ), 
            React.createElement("div", {style: invdisplay}, React.createElement("img", {src: preloader}))
        );

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
            badge = React.createElement("span", {title: "Click to see your history", onClick: this.getHistory, 
                          className: "badge"}, this.Letter.ExchangId);
        }
        if(Qwiery.isDefined(this.Letter.Header)) {
            mainHeader = React.createElement("span", {id: "header"}, this.Letter.Header);
        }
        else {
            // we don't want the ugly 'get: 3452-we-34-...'
            if(this.Letter.Pods[0].DataType === "SingleEntity") {
                mainHeader = React.createElement("span", {id: "header"}, this.Letter.Pods[0].Type)
            } else {
                mainHeader = React.createElement("span", {id: "header"}, this.Letter.Question)
            }
        }
        if(this.showMainHeader) {
            if(this.Letter.Header === " Error") {
                return [];
            }
            return React.createElement("div", {id: "mainHeader"}, badge, mainHeader);
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


/***
 * Presents Wolfram Alpha results.
 *
 * <WolframAlphaComponent term="chromatic" />
 */
var ItemComponent = React.createClass({displayName: "ItemComponent",
    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        return {};
    },
    render: function() {
        var seq = [];
        if(Qwiery.isDefined(this.props.Title) && this.props.Title.length > 0) {
            if(Qwiery.isDefined(this.props.Url) && this.props.Url.length > 0) {
                seq.push(React.createElement("div", null, React.createElement("strong", null, React.createElement("a", {href: this.props.Url, target: "_blank"}, this.props.Title))));
            }
            else {
                seq.push(React.createElement("div", null, React.createElement("strong", null, this.props.Title)));
            }
        }
        if(Qwiery.isDefined(this.props.Description) && this.props.Description.length > 0) {
            seq.push(React.createElement("div", null, this.props.Description));
        }
        if(Qwiery.isDefined(this.props.ImageSource) && this.props.ImageSource.length > 0) {
            seq.push(React.createElement("img", {style: {width:400}, src: this.props.ImageSource}));
        }


        return React.createElement("div", {id: this.componentId, className: "ItemComponentItem"}, seq);
    },

    componentDidMount: function() {

    }
});

var ListComponent = React.createClass({displayName: "ListComponent",
    getInitialState: function() {
        this.items = [];
        this.componentId = Qwiery.randomId();
        return {};
    },

    render: function() {
        return React.createElement("div", {className: "lister", id: this.componentId, key: this.componentId}, 
            React.createElement("ul", {className: "list-inline"}, this.renderItems())
        );
    },
    renderItems: function() {
        var that = this;
        return _.map(this.items, function(t) {
            return React.createElement("li", {key: t.Id}, React.createElement("span", {className: "glyphicon glyphicon-triangle-right", 
                                        style: {top:2, color:"grey"}}), React.createElement("a", {href: "#", id: Qwiery.randomId(), 
                                                                                "data-type": t.Type, 
                                                                                onClick: UI.handleClick, 
                                                                                "data-toggle": "popover", title: t.Type, 
                                                                                "data-html": "true", 
                                                                                "data-content": t.Title}, t.Title)
            );
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
/***
 * Handles everything login and social connection.
 *
 * <LoginComponent />
 */
var LoginComponent = React.createClass({displayName: "LoginComponent",
    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        hello.init({
            facebook: "362829230511744",
            twitter: "G69pUBd0yMSyNRCNxfckhw",
            google: "899171813633-bi89u7skhq05atrssbsp1j4rsvkhgtk6.apps.googleusercontent.com"
        });

        this.cookie = Cookies.get(UI.constants.CookieName);
        if(Qwiery.isDefined(this.cookie)) {
            var cookieContent = JSON.parse(this.cookie);
            // the Anonymous cannot be considered as authenticated, more sorta pseudo-user
            if(cookieContent.userId !== "Anonymous") {
                this.currentUser = cookieContent;
            }
        } else {
            this.currentUser = null;
        }

        this.localCredentials = {email: null, password: null};
        if(Qwiery.isUndefined(this.currentUser) || this.currentUser.id === "Anonymous") {
            return {local: "login"};
        } else {
            if(Qwiery.isDefined(this.currentUser.local)) {
                return {local: "loggedin"};
            } else {
                return {local: "register"};
            }
        }
    },

    componentDidMount: function() {
        if(Qwiery.isDefined(this.currentUser)) {
            $("#globalLoggedInInfo").show();
        } else {
            $("#globalLoggedInInfo").hide();
        }
        this.refresh();
        $("#emailBox").focus();
    },

    componentDidUpdate: function() {
        this.refresh();
    },

    handleChange: function(event) {
        if(event.target.id === "emailBox" || event.target.id === "registerEmailBox") {
            this.localCredentials.email = event.target.value;
        } else {
            this.localCredentials.password = event.target.value;
        }

        this.setState({});
    },

    loginKeyUp: function(event) {
        if(event.charCode === 13) {
            this.connectLocal();
        }
    },

    render: function() {

        var localSection = null;
        var localLogin = React.createElement("div", {id: "localLogin"}, 
            React.createElement("div", {className: "panel panel-success"}, 
                React.createElement("div", {className: "panel-heading"}, 
                    React.createElement("h3", {className: "panel-title"}, "Local Login")
                ), 
                React.createElement("div", {className: "panel-body"}, 
                    React.createElement("div", {className: "row"}, 
                        React.createElement("div", {className: "col-md-4", style: {"margin": "5px 0 0 0"}}, 
                            React.createElement("label", {htmlFor: "emailBox", style: {"width": "90px"}}, "Email:"), 
                            React.createElement("input", {type: "text", id: "emailBox", value: this.localCredentials.email, 
                                   keyUp: this.loginKeyUp, onChange: this.handleChange})
                        ), 
                        React.createElement("div", {className: "col-md-4", style: {"margin": "5px 0 10px 0"}}, React.createElement("label", {htmlFor: "passwordBox", 
                                                                                            style: {"width": "90px"}}, "Password:"), 
                            React.createElement("input", {type: "password", value: this.localCredentials.password, id: "passwordBox", 
                                   onChange: this.handleChange, onKeyPress: this.loginKeyUp})), 
                        React.createElement("div", {className: "col-md-3"}, 
                            React.createElement("button", {onClick: this.connectLocal, className: "btn btn-success"}, "Login"), 
                            React.createElement("span", {style: {"margin": "0 10px"}}, "or"), 
                            React.createElement("button", {onClick: this.showLocalRegister, className: "btn btn-primary"}, "Register"
                            )
                        )
                    )
                )
            )
        );
        var localRegister = React.createElement("div", {id: "registerLocal"}, 
            React.createElement("div", {className: "panel panel-primary"}, 
                React.createElement("div", {className: "panel-heading"}, 
                    React.createElement("h3", {className: "panel-title"}, "Local Register")
                ), 
                React.createElement("div", {className: "panel-body"}, 
                    React.createElement("p", null, "Note that if you are already connected with a social network this will add a local" + ' ' +
                        "account with" + ' ' +
                        "which you can connect."), 

                    React.createElement("div", {className: "row"}, 
                        React.createElement("div", {className: "col-md-3"}, 
                            React.createElement("label", {htmlFor: "registerEmailBox"}, "Email:"), 
                            React.createElement("input", {type: "text", id: "registerEmailBox", onChange: this.handleChange, 
                                   value: this.localCredentials.email})
                        ), 
                        React.createElement("div", {className: "col-md-4"}, React.createElement("label", {htmlFor: "registerPasswordBox"}, "Password:"), 
                            React.createElement("input", {type: "password", id: "registerPasswordBox", onChange: this.handleChange, 
                                   value: this.localCredentials.password})), 
                        React.createElement("div", {className: "col-md-3"}, 
                            React.createElement("button", {onClick: this.localCancelRegister, className: "btn btn-default"}, "Cancel"
                            ), 
                            React.createElement("button", {onClick: this.registerLocal, className: "btn btn-primary"}, "Register")
                        )
                    )
                )
            )
        );
        if(UI.constants.EnableLocalLogin) {
            switch(this.state.local) {
                case "login":
                    localSection = localLogin;
                    break;
                case "register":
                    localSection = localRegister;
                    break;
                case "loggedin":
                    localSection = null;
                    break;
            }
        } else {
            localSection = null;
        }

        return React.createElement("div", {id: this.componentId, key: this.componentId}, 
            React.createElement("div", {id: "globalLoggedInInfo", style: {"display": "none"}}, 
                React.createElement("div", {className: "panel panel-success"}, 
                    React.createElement("div", {className: "panel-heading"}, 
                        React.createElement("h3", {className: "panel-title"}, "Logged in")
                    ), 
                    React.createElement("div", {className: "panel-body"}, 
                        React.createElement("label", {htmlFor: "apiKey"}, "API key:"), 

                        React.createElement("div", {id: "apiKey"}), 
                        React.createElement("button", {style: {"margin": "10px 0 0 0"}, className: "btn btn-warning", id: "logoffButton", 
                                onClick: this.logoff}, "Logoff"
                        )
                    )
                )
            ), 
            React.createElement("div", {id: "localSection"}, 
                React.createElement("div", {id: "localDetails", style: {"display": "none"}}, 
                    React.createElement("div", {className: "panel panel-success"}, 
                        React.createElement("div", {className: "panel-heading"}, 
                            React.createElement("h3", {className: "panel-title"}, "Local Details")
                        ), 
                        React.createElement("div", {className: "panel-body"}, 
                            React.createElement("label", {htmlFor: "email"}, "Email:"), 

                            React.createElement("div", {id: "email"})
                        )
                    )
                ), 
                localSection
            ), 
            React.createElement("div", {id: "facebookSection"}, 
                React.createElement("div", {id: "facebookDetails", className: "panel panel-success"}, 
                    React.createElement("div", {className: "panel-heading"}, 
                        React.createElement("h3", {className: "panel-title"}, "Facebook details")
                    ), 
                    React.createElement("div", {className: "panel-body"}, 
                        React.createElement("div", {id: "facebookInfo"})
                    )
                ), 
                React.createElement("div", {id: "facebookLogin", className: "panel panel-success"}, 
                    React.createElement("div", {className: "panel-heading"}, 
                        React.createElement("h3", {className: "panel-title"}, "Facebook login")
                    ), 
                    React.createElement("div", {className: "panel-body"}, 
                        React.createElement("p", null, "You can connect via Facebook but please note that you will create multiple accounts if you" + ' ' +
                            "already" + ' ' +
                            "have a local account or one using another social network."), 

                        React.createElement("p", null, "If you are already logged in then you can add Facebook as another way to connect with this" + ' ' +
                            "site."), 
                        React.createElement("button", {id: "facebookButton", className: "zocial facebook", 
                                style: {"border": "none", "backgroundImage": "none"}, 
                                onClick: this.connectFacebook}, "Facebook"
                        )
                    )
                )
            ), 
            React.createElement("div", {id: "googleSection"}, 
                React.createElement("div", {id: "googleDetails", className: "panel panel-success"}, 
                    React.createElement("div", {className: "panel-heading"}, 
                        React.createElement("h3", {className: "panel-title"}, "Google details")
                    ), 
                    React.createElement("div", {className: "panel-body"}, 
                        React.createElement("div", {id: "googleInfo"})
                    )
                ), 
                React.createElement("div", {id: "googleLogin", className: "panel panel-success"}, 
                    React.createElement("div", {className: "panel-heading"}, 
                        React.createElement("h3", {className: "panel-title"}, "Google login")
                    ), 
                    React.createElement("div", {className: "panel-body"}, 
                        React.createElement("p", null, "You can connect via Google but please note that you will create multiple accounts if you" + ' ' +
                            "already have" + ' ' +
                            "a local account or one using another social network."), 

                        React.createElement("p", null, "If you are already logged in then you can add Facebook as another way to connect with this" + ' ' +
                            "site."), 
                        React.createElement("button", {id: "fgoogleButton", className: "zocial google", 
                                style: {"border": "none", "backgroundImage": "none"}, 
                                onClick: this.connectGoogle}, "Google"
                        )
                    )
                )
            ), 

            React.createElement("div", {id: "twitterSection"}, 
                React.createElement("div", {id: "twitterDetails", className: "panel panel-success"}, 
                    React.createElement("div", {className: "panel-heading"}, 
                        React.createElement("h3", {className: "panel-title"}, "Twitter details")
                    ), 
                    React.createElement("div", {className: "panel-body"}, 
                        React.createElement("div", {id: "twitterInfo"})
                    )
                ), 
                React.createElement("div", {id: "twitterLogin", className: "panel panel-success"}, 
                    React.createElement("div", {className: "panel-heading"}, 
                        React.createElement("h3", {className: "panel-title"}, "Twitter login")
                    ), 
                    React.createElement("div", {className: "panel-body"}, 
                        React.createElement("p", null, "You can connect via Twitter but please note that you will create multiple accounts if you" + ' ' +
                            "already have" + ' ' +
                            "a local account or one using another social network."), 

                        React.createElement("p", null, "If you are already logged in then you can add Facebook as another way to connect with this" + ' ' +
                            "site."), 
                        React.createElement("button", {id: "ftwitterButton", className: "zocial twitter", 
                                style: {"border": "none", "backgroundImage": "none"}, 
                                onClick: this.connectTwitter}, "Twitter"
                        )
                    )
                )
            )
        );
    },

    refresh: function() {
        $("#globalLoggedInInfo").hide();
        this.localLogic();
        this.facebookLogic();
        this.googleLogic();
        this.twitterLogic();
        if(Qwiery.apiKey !== "Anonymous") {
            UI.refreshPods();
        }
    },

    localLogic: function() {

        if(this.currentUser === null || this.currentUser.id === "Anonymous") {
            $("#localDetails").hide();
        } else {
            $("#globalLoggedInInfo").show();
            $("#apiKey").html(this.currentUser.apiKey);
            if(this.currentUser.local && UI.constants.EnableLocalLogin) {
                $("#localDetails").show();
                $("#email").html(this.currentUser.local.email);
            } else {
                $("#localDetails").hide();
            }
        }
    },

    facebookLogic: function() {
        if(Qwiery.isUndefined(this.currentUser)) {
            $("#facebookDetails").hide();
            $("#facebookLogin").show();
        } else {
            if(Qwiery.isDefined(this.currentUser.facebook)) {
                $("#facebookDetails").show();
                $("#facebookLogin").hide();
                this.getFacebookDetails();
            } else {
                $("#facebookDetails").hide();
                $("#facebookLogin").show();
            }
        }
    },

    googleLogic: function() {
        if(Qwiery.isUndefined(this.currentUser)) {
            $("#googleDetails").hide();
            $("#googleLogin").show();
        } else {
            if(Qwiery.isDefined(this.currentUser.google)) {
                $("#googleDetails").show();
                $("#googleLogin").hide();
                this.getGoogleDetails();
            } else {
                $("#googleDetails").hide();
                $("#googleLogin").show();
            }
        }
    },

    twitterLogic: function() {
        if(Qwiery.isUndefined(this.currentUser)) {
            $("#twitterDetails").hide();
            $("#twitterLogin").show();
        } else {
            if(Qwiery.isDefined(this.currentUser.twitter)) {
                $("#twitterDetails").show();
                $("#twitterLogin").hide();
                this.getTwitterDetails();
            } else {
                $("#twitterDetails").hide();
                $("#twitterLogin").show();
            }
        }
    },

    /***
     * This updates the cookie and sets the API key so from now on all
     * requests to Qwiery are authenticated.
     * @param obj the authentication ticket.
     */
    updateClientCredentials: function(obj) {
        if(obj.twitter){
            // when trying to set the cookie there seems to be an issue with these substructures
            delete obj.twitter.status;
            delete obj.twitter.entities;
        }
        var ticket = JSON.stringify(obj);
        Cookies.set(UI.constants.CookieName, ticket, {expires: 7});
        UI.ticket = obj;
        UI.setAvatar();
        Qwiery.apiKey = obj.apiKey;
    },

    /***
     * Removes all client credentials and makes the client anonymous.
     */
    logoff: function() {
        Cookies.remove(UI.constants.CookieName);
        hello.logout();
        this.cookie = null;
        this.currentUser = null;
        Qwiery.apiKey = "Anonymous";
        UI.removeAvatar();
        this.setState({
            local: "login"
        });
    },

    showLocalRegister: function() {
        $("#localDetails").hide();
        this.setState({
            local: "register"
        });
    },

    localCancelRegister: function() {
        this.setState({
            local: "login"
        });
        $("#localDetails").hide();
    },

    /***
     * Login with local credentials.
     * This does not register the user, use the registerLocal for this.
     */
    connectLocal: function() {
        var email = $("#emailBox").val().trim();
        var password = $("#passwordBox").val().trim();
        if(email.length === 0) {
            UI.showError("No email address specified.");
            return;
        }
        if(password.length === 0) {
            UI.showError("No password specified.");
            return;
        }
        var that = this;
        $.when(Qwiery.connectLocal(email, password))
            .then(function(r) {

                if(Qwiery.isDefined(r.error)) {
                    UI.showError(r.error);
                } else {
                    that.currentUser = {
                        local: r.local,
                        apiKey: r.apiKey,
                        facebook: r.facebook,
                        google: r.google,
                        twitter: r.twitter
                    };
                    that.updateClientCredentials(that.currentUser);
                    that.setState({
                        local: "loggedin"
                    });
                }
            })
            .fail(function(err) {
                UI.showError(err);
            });
    },

    /***
     * Connect with new credentials.
     * If already connected with other methods (e.g. Facebook) the accounts will be merged.
     */
    registerLocal: function() {
        var email = $("#registerEmailBox").val().trim();
        var password = $("#registerPasswordBox").val().trim();
        if(Qwiery.isDefined(this.currentUser) && Qwiery.isDefined(this.currentUser.local)) {
            UI.showError("There already is a local account...this should not happen.");
            return;
        }
        if(email.length === 0) {
            UI.showError("No email address specified.");
            return;
        }
        if(password.length === 0) {
            UI.showError("No password specified.");
            return;
        }
        var that = this;
        $.when(Qwiery.registerLocal(email, password, this.currentUser)).then(function(r) {
            if(Qwiery.isDefined(r.error)) {
                UI.showError(r.error);
            } else {
                that.currentUser = {
                    local: r.local,
                    apiKey: r.apiKey,
                    facebook: r.facebook,
                    google: r.google,
                    twitter: r.twitter
                };
                that.updateClientCredentials(that.currentUser);
                that.setState({
                    local: "loggedin"
                });
            }
        }).fail(function(err) {
            UI.showError(err);
        });
    },

    /***
     * Connects with Facebook credentials.
     * If the user has other accounts they will be merged.
     */
    connectFacebook: function() {
        if(Qwiery.isDefined(this.currentUser) && Qwiery.isDefined(this.currentUser.facebook)) {
            UI.showError("No need to login with Facebook, you already are known. This should not happen really.");
            return;
        }
        var that = this;
        hello('facebook').login().then(function(e) {
            hello('facebook').api('/me').then(function(facebookObject) {
                $.when(Qwiery.connectFacebook(facebookObject, that.currentUser))
                    .then(function(newUser) {
                        if(Qwiery.isDefined(newUser.error)) {
                            UI.showError(newUser.error);
                        } else {
                            that.currentUser = newUser;
                            that.updateClientCredentials(that.currentUser);

                            if(Qwiery.isDefined(that.currentUser.local)) {
                                that.setState({
                                    local: "loggedin"
                                });
                            } else {
                                that.setState({
                                    local: "register"
                                });
                            }

                        }
                    })
                    .fail(function(err) {
                        UI.showError(err);
                    });
            });
        });
    },

    /***
     * Presents the Facebook details
     */
    getFacebookDetails: function() {
        $("#facebookInfo").html('<img src="' + this.currentUser.facebook.picture + '" /> Hello ' + this.currentUser.facebook.name);
        $("#facebookDetails").show();
        $("#facebookLogin").hide();
    },

    /***
     * Connects with Google credentials.
     * If the user has other accounts they will be merged.
     */
    connectGoogle: function() {
        if(Qwiery.isDefined(this.currentUser) && Qwiery.isDefined(this.currentUser.google)) {
            UI.showError("No need to login with Google, you already are known. This should not happen really.");
            return;
        }
        var that = this;
        hello('google').login().then(function(e) {
            hello('google').api('/me').then(function(googleObject) {
                $.when(Qwiery.connectGoogle(googleObject, that.currentUser))
                    .then(function(newUser) {
                        if(Qwiery.isDefined(newUser.error)) {
                            UI.showError(newUser.error);
                        } else {
                            that.currentUser = newUser;
                            that.updateClientCredentials(that.currentUser);
                            if(Qwiery.isDefined(that.currentUser.local)) {
                                that.setState({
                                    local: "loggedin"
                                });
                            } else {
                                that.setState({
                                    local: "register"
                                });
                            }
                        }
                    })
                    .fail(function(err) {
                        UI.showError(err);
                    });
            });
        });
    },

    /***
     * Presents the Google details
     */
    getGoogleDetails: function() {
        $("#googleInfo").html('<img src="' + this.currentUser.google.picture + '" /> Hello ' + this.currentUser.google.name);
        $("#googleDetails").show();
        $("#googleLogin").hide();
    },

    /***
     * Connects with Twitter credentials.
     * If the user has other accounts they will be merged.
     *
     * Note that Hello.js seems to need registration at https//auth-server.herokuapp.com.
     * For this reason it's disabled by default.
     */
    connectTwitter: function() {
        if(Qwiery.isDefined(this.currentUser) && Qwiery.isDefined(this.currentUser.twitter)) {
            UI.showError("No need to login with Twitter, you already are known. This should not happen really.");
            return;
        }
        var that = this;
        hello('twitter').login()
        //    .then(console.log.bind(console), console.error.bind(console));
        .then(function(e) {
            hello('twitter').api('/me').then(function(twitterObject) {
                $.when(Qwiery.connectTwitter(twitterObject, that.currentUser))
                    .then(function(newUser) {
                        if(Qwiery.isDefined(newUser.error)) {
                            UI.showError(newUser.error);
                        } else {
                            that.currentUser = newUser;
                            that.updateClientCredentials(that.currentUser);
                            if(Qwiery.isDefined(that.currentUser.local)) {
                                that.setState({
                                    local: "loggedin"
                                });
                            } else {
                                that.setState({
                                    local: "register"
                                });
                            }
                        }
                    })
                    .fail(function(err) {
                        UI.showError(err);
                    });
            });
        });
    },

    /***
     * Presents the Twitter details
     */
    getTwitterDetails: function() {
        $("#twitterInfo").html('<img src="' + this.currentUser.twitter.thumbnail + '" /> Hello ' + this.currentUser.twitter.name);
        $("#twitterDetails").show();
        $("#twitterLogin").hide();
    }
});


/***
 * Presents a collection of GraphDB entities.
 */
var MultiEntityComponent = React.createClass({displayName: "MultiEntityComponent",
    render: function() {
        return React.createElement(GridComponent, {type: this.props.Type, entities: this.props.Entities});
    }
});
/***
 * Presents the people.
 * var things = [
 {
           "Title": "Task 1",
           "Description": "",
           "Id": "9cd3ee05-7612-441d-b780-7dba087f4011",
 }
 *
 * ]
 * <PeopleComponent persons=things/>
 */
var PeopleComponent = React.createClass({displayName: "PeopleComponent",
    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        this.persons = this.props.persons;
        return {};
    },
    render: function() {
        return React.createElement("div", {id: this.componentId, style: {border:"none"}});
    },
    adorn: function() {
        var that = this;
        $.when(Qwiery.getPeople()).then(function(persons) {
            that.persons = persons;
            $("#" + that.componentId).kendoListView({
                dataSource: that.persons,
                template: kendo.template('<div class="personItem"  onClick="UI.ask(\'get: #=Id#\')"><span class="glyphicon glyphicon-asterisk" style="float: left;margin-right: 5px;"></span><p class="personTitle">#:Title#</p><p class="personDescription">#:Description || ""#</p></div>')
            });
        });
    },
    componentDidUpdate: function() {
        this.adorn();
    },
    componentDidMount: function() {
        this.adorn();
    }
});

var PersonComponent = React.createClass({displayName: "PersonComponent",
    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        this.contentId = Qwiery.randomId();
        this.relatedId = Qwiery.randomId();

        // clone in case of cancel
        this.entity = jQuery.extend({}, this.props.entity);
        var mode = (this.props.mode || "read").toLowerCase();
        if(mode !== "read" && mode !== "edit" && mode !== "deleted") {
            this.error = "The 'mode' attribute can only be 'read', 'deleted' or 'edit'.";
            return {mode: "error"};
        }
        if(Qwiery.isUndefined(this.entity)) {
            this.error = "No 'entity' attribute specified.";
            return {mode: "error"};
        }
        this.type = this.entity.Type;
        return {
            mode: mode
        };
    },

    finishedEditing: function(obj) {
        if(Qwiery.isDefined(this.props.finishedEditing)) {
            this.props.finishedEditing(obj);
        }
    },

    editEntity: function() {
        this.setState({mode: "edit"});
    },

    cancelEdit: function() {
        event.preventDefault();
        this.finishedEditing({
            refresh: false,
            entity: this.props.entity
        });
    },
    handleChange: function(event) {
        if(event.target.id === "titleBox")
            this.entity.Title = event.target.value;
        else
            this.entity.Description = event.target.value;
        this.setState({entity: this.entity});
    },
    saveEdit: function(event) {
        var that = this;
        event.preventDefault();
        var postUpdate = function(data) {
            console.log("Upserted the Task " + that.entity.Id);
            //showMessage(data === true ? "The data was saved." : "Please try again, something happened along the way."); }
            that.finishedEditing({
                refresh: false,
                entity: that.entity
            });
        };
        $.when(Qwiery.upsertEntity(this.entity)).then(postUpdate);
    },

    render: function() {
        if(this.state.mode === "error") {
            return React.createElement("div", {id: this.componentId, key: this.componentId, className: "alert alert-danger", role: "alert"}, React.createElement("span", {
                className: "glyphicon glyphicon-exclamation-sign", "aria-hidden": "true"}), " ", this.error);
        }
        else if(this.state.mode === "read") {
            return React.createElement("div", {id: this.componentId, key: this.componentId}, 
                React.createElement("div", {className: "EntityTitle"}, this.entity.Title), 
                React.createElement("div", null, this.entity.Description), 
                React.createElement("div", null, "Priority: ", this.entity.Priority)
            );
        } else if(this.state.mode === "edit") {
            return React.createElement("div", {id: this.componentId, key: this.componentId}, 

                React.createElement("form", {id: "PersonEditor"}, 
                    React.createElement("input", {name: "Id", type: "hidden", value: "$Id"}), 
                    React.createElement("input", {name: "$typekey", type: "hidden", value: "$$typekey"}), 
                    React.createElement("table", null, 
                        React.createElement("tr", null, 
                            React.createElement("td", null, 
                                "Title:"
                            ), 
                            React.createElement("td", null, 
                                React.createElement("input", {name: "Title", value: "$Title", width: "150"})
                            )
                        ), 
                        React.createElement("tr", null, 
                            React.createElement("td", null, 
                                "First name:"
                            ), 
                            React.createElement("td", null, 
                                React.createElement("input", {name: "FirstName", value: "$FirstName", width: "150"})
                            )
                        ), 
                        React.createElement("tr", null, 
                            React.createElement("td", null, 
                                "Last name:"
                            ), 
                            React.createElement("td", null, 
                                React.createElement("input", {name: "LastName", value: "$LastName", width: "150"})
                            )
                        ), 
                        React.createElement("tr", null, 
                            React.createElement("td", null, 
                                "Description:"
                            ), 
                            React.createElement("td", null, 
                                React.createElement("input", {name: "Description", value: "$Description", width: "150"})
                            )
                        ), 
                        React.createElement("tr", null, 
                            React.createElement("td", {colspan: "2"}, 
                                React.createElement("div", null, 
                                    React.createElement("input", {id: "PersonSubmit", type: "button", value: "Save"}), " ", React.createElement("span", {id: "Feedback", style: "margin-left: 10px; color: limegreen;"})
                                )
                            )
                        )
                    )
                ), 
                React.createElement("div", null, this.entity.Id)
            );
        }
        else if(this.state.mode === "deleted") {
            return React.createElement("div", {id: this.componentId, key: this.componentId}, 
                React.createElement("div", {className: "well"}, React.createElement("span", {
                    className: "glyphicon glyphicon-exclamation-sign", "aria-hidden": "true"}), " This entity was deleted."
                )
            );
        }


    },
    componentDidMount: function() {
        var that = this;
        $("#prioritySlider").kendoSlider({
            value: that.entity.Priority,
            min: 0,
            max: 10,
            change: function() {
                that.entity.Priority = this.value()
            }
        })
    }
});


var PersonalityOverviewComponent = React.createClass({displayName: "PersonalityOverviewComponent",
    render: function() {
        return React.createElement("div", null, "PersonalityOverview");
    }
});

/***
 * Renders anything Qwieryish you throw at.
 */
var PodRenderingComponent = React.createClass({displayName: "PodRenderingComponent",
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
            return React.createElement("div", {className: "interacter", id: this.componentId, key: this.componentId}, 
                React.createElement("div", null, React.createElement("img", {src: preloader}))
            );
        } else {
            return React.createElement("div", {className: "PodRenderer", id: this.componentId, key: this.componentId}, 
                 UI.getComponents(this.Letter.Pods)
            );
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
            this.specials = [React.createElement(LoginComponent, null)];
            this.Letter = letter;
            return;
        }
        if(content.toLowerCase().startsWith("users")) {
            // this will bypass rendering the pods and inject directly the given component
            // note that you need admin priviledges to see the data and the component just presents this
            this.specials = [React.createElement(UsersComponent, null)];
            this.Letter = letter;
            return;
        }
        if(content.toLowerCase().startsWith("usage")) {
            // this will bypass rendering the pods and inject directly the given component
            // note that you need admin priviledges to see the data and the component just presents this
            this.specials = [React.createElement(GlobalUsageComponent, null)];
            this.Letter = letter;
            return;
        }
        if(content.toLowerCase().startsWith("logoff") || content.toLowerCase().startsWith("logout") || content.toLowerCase().startsWith("log off") || content.toLowerCase().startsWith("log out")) {
            if(Qwiery.apiKey === "Anonymous") {
                this.specials = [React.createElement("div", null, "No need to log out, you are anonymously talking to Qwiery.")];
            }
            if(Qwiery.isDefined(Qwiery.apiKey)) {
                this.logoff();
                // this will bypass rendering the pods and inject directly the given component
                this.specials = [React.createElement("div", null, "You are now logged off.")];
            } else {
                this.specials = [React.createElement("div", null, "No need to log off, you were not logged in. ", React.createElement("a", {href: "#", 
                                                                                     onClick: function(){UI.ask("login")}}, "Click" + ' ' +
                    "here if you wish to log in."))];
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
var ProfileComponent = React.createClass(
    {displayName: "ProfileComponent",
        getInitialState: function() {
            this.componentId = Qwiery.randomId();
            return {};
        },
        componentDidUpdate: function() {
            //$('[data-toggle="popover"]').popover({
            //    trigger: 'hover',
            //    'placement': 'top'
            //});
        },
        componentDidMount: function() {
            var $personalization = $("#personalizationBlock");
            var $psy = $("#psyBlock");
            var $stats = $("#statsBlock");
            var $login = $("#loginBlock");
            var $history = $("#historyBlock");
            var $topics = $("#topicsBlock");
            var $files = $("#filesBlock");
            var $graph = $("#graphBlock");
            var $graphul = $("#graphul");
            Qwiery.getPersonalization().then(function(d) {
                if(Qwiery.isUndefined(d) || _.keys(d).length === 0) {
                    $personalization.append("<div>No personalizations recorded yet.</div>");
                } else {
                    _.forEach(d, function(v, k) {
                        $personalization.append("<div>" + k + ": " + v + "</div>");
                    })
                }
            });
            Qwiery.getPsy().then(function(d) {
                if(Qwiery.isUndefined(d) || d.length === 0) {
                    $("#psyChart").append("<div>No enough information yet to have a clear view of who you are.</div>");
                } else {
                    $("#psyChart").kendoChart({
                        title: {
                            text: "Your profile"
                        },
                        legend: {
                            visible: false
                        },
                        seriesDefaults: {
                            labels: {
                                template: "#=dataItem.Type#",
                                position: "outsideEnd",
                                visible: true,
                                background: "transparent"
                            }
                        },
                        dataSource: {
                            data: d
                        },
                        series: [{
                            type: "pie",
                            overlay: {
                                gradient: "none"
                            },
                            field: "Weight"
                        }]
                    });
                }

            });
            Qwiery.getStats().then(function(d) {
                $("#statsChart").kendoChart({
                    title: {
                        text: "You asked " + d.QuestionCount + " questions in the past 100 days"
                    },
                    legend: {
                        visible: false
                    },
                    seriesDefaults: {
                        type: "column"
                    },
                    series: [{
                        name: "Question",
                        data: d.Timeseries,
                        field: "Weight",
                        overlay: {
                            gradient: "none"
                        },
                        categoryField: "Type"
                    }]

                });
                $graphul.append("<li  class='list-group-item'> <span id='tagBadge' class='badge'>" + d.TagCount + "</span>Tags</li>");
                $graphul.append("<li  class='list-group-item'> <span id='entitiesBadge' class='badge'>" + d.NodeCount + "</span>Entities</li>");
                $graphul.append("<li  class='list-group-item'> <span id='workspacesBadge' class='badge'>" + d.WorkspaceCount + "</span>Workspaces</li>");
                $("#tagBadge").click(function() {
                    UI.ask("tags")
                });
                $("#entitiesBadge").click(function() {
                    UI.ask("entities")
                });
                $("#workspacesBadge").click(function() {
                    UI.ask("workspaces")
                });
            });
            if(Qwiery.apiKey === "Anonymous") {
                $login.append("You are using Qwiery anonymously.")
            } else {
                if(Qwiery.isDefined(UI.ticket.facebook)) {
                    $login.append("<div><strong>Facebook</strong>: <a target='_blank' href='http://www.facebook.com/" + UI.ticket.facebook.id + "'>" + UI.ticket.facebook.name + "</a> (<a href='mailto:" + UI.ticket.facebook.email + "'>" + UI.ticket.facebook.email + "</a>).</div>");
                }
                if(Qwiery.isDefined(UI.ticket.google)) {
                    $login.append("<div><strong>Google</strong>: <a target='_blank' href='" + UI.ticket.google.url + "'>" + UI.ticket.google.name + "</a>.</div>");
                }
            }


            Qwiery.getTrail().then(function(a) {
                if(Qwiery.isUndefined(a) || a.length === 0) {
                    $history.append("<div>You have not asked any questions yet!?</div>");
                } else {
                    $history.append("<div>Most recent items only, you can see your full history by clicking on the exchange badge, type 'history' or <span class='clickable' onClick='UI.ask(\"history\")'>click here</span>.</div>");
                    var $hul = $history.append("<ul></ul>");
                    _.forEach(a, function(e) {
                        $hul.append("<li><span>" + new Date(e.Timestamp).toGMTString() + ": " + e.Input + "</span></li>");
                    })
                }
            });

            Qwiery.getTopics().then(function(a) {
                if(Qwiery.isUndefined(a) || a.length === 0) {
                    $topics.append("<div>You don't have any topics yet.</div>");
                } else {
                    _.forEach(a, function(wi) {
                        $topics.append("<div>" + wi.Type + ": " + wi.Weight + "</div>");
                    })
                }
            });
            var presentFiles = function(a) {
                if(Qwiery.isUndefined(a) || a.length === 0) {
                    $files.append("<div>You have not uploaded any files yet.</div>");
                } else {
                    var $hul = $files.append("<ul></ul>");
                    _.forEach(a, function(e) {
                        var im = UI.getFileIcon(e.Title);
                        var toAppend = "<li><img style='width:15px; margin:0 5px;' src='" + im + "'/><span id=" + Qwiery.randomId() + " class='fileItem clickable'  data-nodeid='" + e.Id + "' data-title='" + e.Title + "' title='" + e.Title + "' data-type='" + e.Type + "' >" + e.Title + "</span></li>";
                        $hul.append(toAppend);
                    });
                    $(".fileItem").click(function(e) {
                        UI.entityClick(e);
                    });
                }
            };
            UI.fetch(Qwiery.getFiles(), presentFiles);

        },

        render: function() {
            return React.createElement("div", {id: this.componentId, key: this.componentId, className: "ProfileRoot"}, 
                React.createElement("div", {className: "panel panel-default"}, 
                    React.createElement("div", {className: "panel-heading"}, 
                        React.createElement("h3", {className: "panel-title"}, "Statistics")
                    ), 
                    React.createElement("div", {id: "statsBlock", className: "panel-body"}, 
                        React.createElement("div", {id: "statsChart", style: {"height":"200px"}})
                    )
                ), 

                React.createElement("div", {className: "panel panel-default"}, 
                    React.createElement("div", {className: "panel-heading"}, 
                        React.createElement("h3", {className: "panel-title"}, "Login")
                    ), 
                    React.createElement("div", {id: "loginBlock", className: "panel-body"}
                    )
                ), 
                React.createElement("div", {className: "panel panel-default"}, 
                    React.createElement("div", {className: "panel-heading"}, 
                        React.createElement("h3", {className: "panel-title"}, "History")
                    ), 
                    React.createElement("div", {id: "historyBlock", className: "panel-body"}

                    )
                ), 
                React.createElement("div", {className: "panel panel-default"}, 
                    React.createElement("div", {className: "panel-heading"}, 
                        React.createElement("h3", {className: "panel-title"}, "Personalization")
                    ), 
                    React.createElement("div", {id: "personalizationBlock", className: "panel-body"}
                    )
                ), 
                React.createElement("div", {className: "panel panel-default"}, 
                    React.createElement("div", {className: "panel-heading"}, 
                        React.createElement("h3", {className: "panel-title"}, "Psychological profile")
                    ), 
                    React.createElement("div", {id: "psyBlock", className: "panel-body"}, 
                        React.createElement("div", {id: "psyChart"})
                    )
                ), 
                React.createElement("div", {className: "panel panel-default"}, 
                    React.createElement("div", {className: "panel-heading"}, 
                        React.createElement("h3", {className: "panel-title"}, "Topics")
                    ), 
                    React.createElement("div", {id: "topicsBlock", className: "panel-body"}
                    )
                ), 
                React.createElement("div", {className: "panel panel-default"}, 
                    React.createElement("div", {className: "panel-heading"}, 
                        React.createElement("h3", {className: "panel-title"}, "Graph")
                    ), 
                    React.createElement("div", {id: "graphBlock", className: "panel-body"}, 
                        React.createElement("ul", {id: "graphul", className: "list-group"}

                        )
                    )
                ), 
                React.createElement("div", {className: "panel panel-default"}, 
                    React.createElement("div", {className: "panel-heading"}, 
                        React.createElement("h3", {className: "panel-title"}, "Files")
                    ), 
                    React.createElement("div", {id: "filesBlock", className: "panel-body"}
                    )
                )
            );
        },

        askFor: null,

        raiseAskFor: function(options) {
            UI.ask(options);
        }
    }
);

/***
 * A component editing QTL.
 */
var QTLEditorComponent = React.createClass({displayName: "QTLEditorComponent",
    getInitialState: function() {
        this.jsonEditor = null;
        this.currentEditorMode = "json";
        this.editorId = Qwiery.randomId();
        return {
            visibility: "visible",
            showTemplateEditor: false
        };

    },

    componentDidMount: function() {
        this.refresh();
    },

    componentDidUpdate: function() {
        this.refresh();
    },

    refresh: function() {
        this.createEditors();
    },

    render: function() {
        var display = {
            display: this.state.showTemplateEditor ? "block" : "none"
        };

        return React.createElement("div", {className: "templateEditorRoot", id: this.editorId, key: this.editorId, style: display}, 
            React.createElement("div", {style: {"height":"25px"}}, 
                React.createElement("div", {id: "approvedLight"}), 
                React.createElement("span", {id: "editCloseIcon", style: {"margin": "-10px 0 0 0"}, className: "glyphicon glyphicon-remove editorCloseIcon pull-right", "aria-hidden": "true", 
                      onClick: this.hideEditorTemplate})
            ), 
            React.createElement("div", {className: "alert alert-success EditorNotification", id: "editor-success-alert"}, 
                React.createElement("button", {id: "editor-successClose", type: "button", className: "close"}, "x"), 
                React.createElement("strong", null, "Success! "), 
                React.createElement("span", {id: "editor-successMessage"})
            ), 
            React.createElement("div", {className: "alert alert-danger EditorNotification", id: "editor-danger-alert"}, 
                React.createElement("button", {id: "editor-dangerClose", type: "button", className: "close"}, "x"), 
                React.createElement("strong", null, "Error! "), 
                React.createElement("span", {id: "editor-errorMessage"})
            ), 
            React.createElement("div", {className: "form-group"}, 
                React.createElement("label", {className: "col-sm-1 control-label"}, "Id:"), 
                React.createElement("div", {className: "col-sm-11", style: {"height":"35px"}}, 
                    React.createElement("p", {id: "templateId", className: "form-control-static"})
                )
            ), 
            React.createElement("div", {className: "form-group"}, 
                React.createElement("label", {for: "templateSentence", className: "col-sm-1 control-label"}, "Question: "), 
                React.createElement("div", {className: "col-sm-11", style: {"minHeight": "35px"}}, 
                    React.createElement("textarea", {className: "form-control  input-sm", id: "templateSentence", rows: "4", placeholder: "The question to catch"})
                )
            ), 
            React.createElement("div", {className: "form-group"}, 
                React.createElement("label", {for: "topicsInput", className: "col-sm-1 control-label"}, "Topics: "), 
                React.createElement("div", {className: "col-sm-11", style: {marginTop:10}}, 
                    React.createElement("input", {type: "text", className: "form-control  input-sm", id: "topicsInput", style: {"width":"350px"}})
                )
            ), 
            React.createElement("div", {className: "form-group"}, 
                React.createElement("div", {className: "col-sm-offset-1 col-sm-11"}, 
                    React.createElement("div", {className: "btn-group btn-group-sm", style: {"marginTop":"10px"}, role: "group", "aria-label": "Toolbar"}, 
                        React.createElement("button", {type: "button", className: "btn btn-primary", id: "updateTemplateButton"}, "Update"), 
                        React.createElement("button", {type: "button", className: "btn btn-success", id: "newTemplateButton"}, "New"), 
                        React.createElement("button", {type: "button", className: "btn btn-danger", id: "deleteButton"}, "Delete"), 
                        React.createElement("button", {type: "button", className: "btn btn-default", id: "validateButton"}, "Validate"), 
                        React.createElement("button", {type: "button", className: "btn btn-default", id: "htmlSwitchButton"}, "Switch editor"), 
                        React.createElement("button", {type: "button", className: "btn btn-default", id: "randomButton"}, "Random")
                    ), 
                    React.createElement("div", {className: "btn-group btn-group-sm", style: {"marginTop":"10px"}}, 
                        React.createElement("button", {type: "button", className: "btn btn-default dropdown-toggle", "data-toggle": "dropdown", "aria-haspopup": "true", "aria-expanded": "false"}, 
                            "Personality ", React.createElement("span", {className: "caret"})
                        ), 
                        React.createElement("ul", {id: "PersonalitiesList", className: "dropdown-menu"}

                        )
                    ), 
                    React.createElement("div", {className: "btn-group btn-group-sm", style: {"marginTop":"10px"}}, 
                        React.createElement("button", {id: "CategoryListButton", type: "button", className: "btn btn-default dropdown-toggle", "data-toggle": "dropdown", "aria-haspopup": "true", "aria-expanded": "false"}, 
                            "Category ", React.createElement("span", {className: "caret"})
                        ), 
                        React.createElement("ul", {id: "CategoryList", className: "dropdown-menu"}
                        )
                    ), 
                    React.createElement("div", {id: "jsonEditorDiv"}, 
                        React.createElement("div", {id: "jsonEditor"})
                    ), 
                    React.createElement("div", {id: "mdEditorDiv", style: {display: "none"}}, 
                        React.createElement("textarea", {id: "markdownEditorArea", rows: "10", cols: "60"})
                    )
                )
            )
        );


    },

    /***
     * Creates the visuals.
     */
    createEditors: function() {
        var that = this;

        if(Qwiery.isUndefined(this.jsonEditor)) {
            var $jsonEditor = $("#jsonEditor");
            if($jsonEditor.length === 0) {
                console.warn("Element #jsonEditor was not found.");
                return;
            }
            // for CDN see http://cdnjs.com/libraries/ace/
            $jsonEditor.height("350px");
            this.jsonEditor = ace.edit("jsonEditor");
            this.jsonEditor.$blockScrolling = Infinity
            this.jsonEditor.setTheme("ace/theme/tomorrow");
            this.jsonEditor.getSession().setMode("ace/mode/json");

            //https://github.com/NextStepWebs/simplemde-markdown-editor
            var $markdownEditorArea = $("#markdownEditorArea");
            this.markdownEditor = new SimpleMDE({element: $markdownEditorArea[0]});
            $("#newTemplateButton").kendoButton({click: this.newTemplate});
            $("#updateTemplateButton").kendoButton({click: this.updateLexicRecord});
            $("#htmlSwitchButton").kendoButton({click: this.switchHtmlEditor});
            $("#randomButton").kendoButton({click: this.randomItem});
            $("#deleteButton").kendoButton({click: this.deleteItem});
            this.refreshPersonalities();


            $("#validateButton").kendoButton({click: this.validateTemplate});
            $("#editor-successClose").click(function() {
                $("#editor-success-alert").hide();
            });
            $("#editor-dangerClose").click(function() {
                $("#editor-danger-alert").hide();
            });

        }
    },

    refreshTopics: function() {
        var topdata = [];
        Qwiery.getStandardTopics().then(function(topics) {
            _.forEach(topics, function(topicName) {
                topdata.push(topicName);
            });
            $("#topicsInput").kendoAutoComplete({
                dataSource: topdata,
                filter: "startswith",
                placeholder: "Add one or more topics...",
                separator: ", "
            });
        });
    },

    refreshCategories: function(selectedCategory) {
        $("#CategoryList").empty();
        Qwiery.getCategories().then(function(topics) {
            _.forEach(topics, function(category) {
                $("#CategoryList").append("<li><a href='#'>" + category + "</a></li>");
            });
            $(".dropdown-menu li a").click(function() {
                var selText = $(this).text();
                $(this).parents('.btn-group').find('.dropdown-toggle').html(selText + ' <span class="caret"></span>');
            });
            if(selectedCategory) {
                $("#CategoryListButton").html(selectedCategory + ' <span class="caret"></span>')
            }
        });


    },
    refreshPersonalities: function() {
        $("#PersonalitiesList").empty();
        var that = this;
        Qwiery.getPersonalities().then(function(names) {
            _.forEach(names, function(name) {
                $("#PersonalitiesList").append("<li><a href='#'>" + name + "</a></li>");
            });
            $("#PersonalitiesList li").click(function() {
                that.insertPersonality($(this).text());
            });
        });
    },

    switchHtmlEditor: function() {

        if(this.currentEditorMode === "json") {
            this.showMarkdownEditor();
        }
        else {
            this.showJsonEditor();
        }
    },

    deleteItem: function() {

        var id = $("#templateId").html() || -1;
        var that = this;
        $.when(Qwiery.lexicDelete(id)).then(function(data) {
            $("#templateId").html("DELETED");
            $("#templateSentence").val("");
            that.setEditorNotification("Lexic item " + id + " was deleted.");
            that.setJsonEditorContent("");
        }).fail(function(error) {
            console.log(error.message);
        });
    },

    randomItem: function() {
        if(this.currentEditorMode === "markdown") this.showJsonEditor();
        var that = this;
        $.when(Qwiery.lexicRandomRecord()).then(function(data) {
            that.setJsonEditorContent(data.Template);
            $("#templateId").html(data.Id);
            if(_.isString(data.Grab)) {
                data.Grab = [data.Grab];
            }
            var questions = data.Grab.join("\n");
            $("#templateSentence").val(questions);
            that.refreshTopics();
            that.refreshCategories();
            if(data.Topics && data.Topics.length > 0) {
                $("#topicsInput").val(data.Topics.join(",") + ", ");
            } else {
                $("#topicsInput").val("");
            }

            if(data.Approved) {
                $("#approvedLight").css("background-color", (data.Approved === true ? '#81BF23' : 'darkred'));
                $("#approvedLight").attr("title", "This QTL is approved.")
            }
            else {
                $("#approvedLight").css("background-color", "darkred");
                $("#approvedLight").attr("title", "This QTL is not yet approved.")
            }
            //that.setEditorNotification("Random question " + data.Id + " fetched.");
        }).fail(function(error) {
            console.log(error.message);
        });
    },

    /***
     * Displays the given QTL in the editor.
     * @param qtl
     */
    edit: function(qtl) {
        $(ReactDOM.findDOMNode(this)).find("#templateId").html(qtl.Id);
        this.setJsonEditorContent(qtl.Template);
        if(_.isString(qtl.Grab)) {
            qtl.Grab = [qtl.Grab];
        }
        var questions = qtl.Grab.join("\n");
        $("#templateSentence").val(questions);
        if(qtl.Topics && qtl.Topics.length > 0) {
            $("#topicsInput").val(qtl.Topics.join(",") + ", ");
        } else {
            $("#topicsInput").val("");
        }
        this.refreshTopics();
        this.refreshCategories(qtl.Category);

        if(qtl.Approved) {
            $("#approvedLight").css("background-color", (qtl.Approved === true ? '#81BF23' : 'darkred'));
            $("#approvedLight").attr("title", "This QTL is approved.")
        }
        else {
            $("#approvedLight").css("background-color", "darkred");
            $("#approvedLight").attr("title", "This QTL is not yet approved.")
        }
        this.setState({
            visibility: "visible",
            showTemplateEditor: true
        });
    },

    newTemplate: function() {
        var that = this;
        Qwiery.lexicDefault().then(function(d) {
            $("#templateId").html("New template");
            $("#templateSentence").val(d.Question);
            that.setJsonEditorContent(JSON.parse(d.Template));
            $("#topicsInput").val("");
        });

    },

    setJsonEditorContent: function(jsonObject) {
        if(Qwiery.isUndefined(jsonObject))
            return;
        if(_.isString(jsonObject)) {
            jsonObject = JSON.parse(jsonObject)
        }
        this.jsonEditor.getSession().setValue(this.formatJson(jsonObject));
    },

    formatJson: function(json) {
        return JSON.stringify(json, null, "\t");
    },

    showJsonEditor: function() {
        $("#mdEditorDiv").css("display", "none");
        $("#jsonEditorDiv").css("display", "block");
        this.transferMarkdownToJson();
        $("#PersonalitiesList").show();
        this.currentEditorMode = "json";
    },

    transferMarkdownToJson: function() {
        if(Qwiery.isDefined(this.markdownEditor)) {
            var jsonContent = this.markdownToJson(this.markdownEditor.value());
            this.setJsonEditorContent(jsonContent);
        }
    },

    transferJsonToMarkdown: function() {
        var stringTemplate = this.jsonEditor.getSession().getValue();
        var jsonTemplate = this.findMdAnswer(stringTemplate);
        if(!Qwiery.isUndefined(jsonTemplate)) {
            this.markdownEditor.value(jsonTemplate);
        } else {
            this.markdownEditor.value("The template did not content a markdown answer.");
        }
    },

    showMarkdownEditor: function() {
        if(!this.jsonEditor) return;
        $("#mdEditorDiv").css("display", "block");
        $("#jsonEditorDiv").css("display", "none");
        this.transferJsonToMarkdown();
        $("#PersonalitiesList").hide();
        this.currentEditorMode = "markdown";
    },

    markdownToJson: function(mdstring) {
        if(Qwiery.isUndefined(mdstring))
            return null;
        mdstring = mdstring.trim();
        return {"Answer": mdstring};
    },

    updateLexicRecord: function() {

        var qtl = this.getQTL();
        var that = this;
        $.when(Qwiery.lexicUpsert(qtl)).then(
            function(data, status, headers, config) {
                var newid = data || -1;
                if(newid === -1) {
                    that.setEditorNotification("Something went wrong it seems, the record was not added or updated.");
                }
                else {
                    that.setEditorNotification(qtl.Id === -1 ? "The record was added." : "The record was updated.");
                    $("#templateId").html(data);
                    $("#approvedLight").css("background-color", '#81BF23');
                    $("#approvedLight").attr("title", "This QTL is approved.")
                }
            }).fail(function(error) {

            that.setEditorNotification(error.responseText ? error.responseText : error, "error");
        });

    },

    getQTL: function() {

        var id = $("#templateId").html() || -1;
        if(id === "New template") {
            id = -1;
        }
        if(this.currentEditorMode === "markdown") {
            // need to transfer the content to json
            this.transferMarkdownToJson();
        }
        var qlines = $("#templateSentence").val().split('\n');
        var questions = [];
        _.forEach(qlines, function(q) {
            if(q.trim().length > 0) {
                questions.push(q.trim());
            }
        });
        if(questions.length === 0) {
            this.showError("You need to specify one or more questions for a valid template.");
            return null;
        }
        var qtl = {
            Id: id,
            Grab: questions,
            That: null,
            Template: this.jsonEditor.getSession().getValue(),
            Category: $("#CategoryListButton").text().trim(),
            Topics: []
        };
        var topicsVal = _.uniq($("#topicsInput").val().split(','));
        _.forEach(topicsVal, function(n) {
            if(n.trim().length > 0) {
                qtl.Topics.push(n.trim());
            }
        });
        return qtl;
    },

    validateTemplate: function() {
        var qtl = this.getQTL();
        if(qtl === null) {
            return;
        }
        var that = this;
        Qwiery.lexicValidate(qtl).fail(function(xhr, textStatus, errorThrown) {
            that.showError(xhr.responseText);
        }).then(function(error) {
            if(Qwiery.isDefined(error)) {
                that.setEditorNotification("Not valid: " + error);
            } else {
                that.setEditorNotification("The template is valid");
            }
        });
    },

    insertPersonality: function(personality) {
        if(!this.jsonEditor) return;
        var jsonstring = this.jsonEditor.getSession().getValue();
        var json = JSON.parse(jsonstring);

        var $context;
        if(json.Think && json.Think.Context) {
            $context = json.Think.Context;
        }
        var newContext = {Name: "Personality", Value: personality};
        if(Qwiery.isDefined($context)) {
            $context.push(newContext);

        } else {
            if(!json.Think) {
                json.Think = {};
            }
            json.Think.Context = [newContext]
        }
        var result = JSON.stringify(json);
        this.setJsonEditorContent(result);
    },

    findMdAnswer: function(jsonTemplate) {
        try {
            var json = JSON.parse(jsonTemplate);
            if(!json.Answer) {
                return "The template is not valid current: no 'Answer' element.";
            }
            if(json.Answer.String) {
                return json.Answer.String;
            } else {
                if(_.isString(json.Answer)) {
                    return json.Answer;
                } else {
                    return null;
                }
            }
        }
        catch(e) {
            console.log(e.message);
            return null;
        }
    },
    /***
     * Show an auto-hide success message.
     * @param msg
     */
    showSuccess: function(msg) {
        $("#editor-successMessage").html(msg);
        $("#editor-success-alert").show().fadeTo(5000, 500).slideUp(500, function() {
            $("#editor-success-alert").hide();
        });
    },

    /***
     * Show an auto-hide error message.
     * @param msg
     */
    showError: function(msg) {

        $("#editor-errorMessage").html(msg);
        $("#editor-danger-alert").fadeTo(5000, 500);
        console.log("Error> " + msg);
    },

    setEditorNotification: function(data, type) {
        if(Qwiery.isUndefined(type)) {
            type = "success";
        }
        switch(type) {
            case "success":
                this.showSuccess(data);
                break;
            case "error":
                this.showError(data);
                break;
        }

    },

    hideEditorTemplate: function() {
        this.setState({
            visibility: "visible",
            showTemplateEditor: false
        });
    },

    // <editor-fold desc="Obsolete">
    getXmlAsString: function(xmlDom) {
        return (typeof XMLSerializer !== "undefined") ?
            (new XMLSerializer()).serializeToString(xmlDom) :
            xmlDom.xml;
    },

    xmlToHtml: function(content) {
        if(Qwiery.isUndefined(content))
            return null;
        var htmlContent = this.getXmlAsString(content).trim();
        return htmlContent.replace("<Html>", "<div>").replace("</Html>", "</div>");
    },

    formatXml: function(xml) {
        var formatted = '';
        var reg = /(>)(<)(\/*)/g;
        xml = xml.replace(reg, '$1\r\n$2$3');
        var pad = 0;
        jQuery.each(xml.split('\r\n'), function(index, node) {
            var indent = 0;
            if(node.match(/.+<\/\w[^>]*>$/)) {
                indent = 0;
            }
            else if(node.match(/^<\/\w/)) {
                if(pad != 0) {
                    pad -= 1;
                }
            }
            else if(node.match(/^<\w[^>]*[^\/]>.*$/)) {
                indent = 1;
            }
            else {
                indent = 0;
            }
            var padding = '';
            for(var i = 0; i < pad; i++) {
                padding += '  ';
            }
            formatted += padding + node + '\r\n';
            pad += indent;
        });
        return formatted;
    }
    // </editor-fold>
});
/***
 * A component which executes the given script.
 * For instance:
 *
 * {
	"Answer": {
		"DataType": "Script",
		"Script": "UI.injectFlickr"
	}
    }
 */
var ScriptComponent = React.createClass({displayName: "ScriptComponent",

    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        return {};
    },

    render: function() {
        return React.createElement("div", {id: this.componentId})
    },

    componentDidMount: function() {
        var that = this;
        eval(this.props.Script)(this.componentId);
    }
});
/***
 * A component to present data from a REST service.
 */
var ServiceComponent = React.createClass({displayName: "ServiceComponent",

    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        this.url = this.props.URL;
        this.path = this.props.Path;
        this.method = this.props.Method;
        this.data = this.props.Data;
        return {};
    },

    getData: function(definition) {
        var options = {
            method: definition.Method || 'GET',
            url: definition.URL,
            dataType: "jsonp",
            headers: {
                "Content-type": "application/json",
                "Accept": "application/json"
            },
            timeout: Qwiery.timeout
        };
        if(definition.Data) {
            options.data = _.isString(definition.Data) ? JSON.stringify({data: definition.Data}) : JSON.stringify(definition.Data);
        }
        return $.ajax(options);
    },
    render: function() {
        return React.createElement("div", {id: this.componentId})
    },

    componentDidMount: function() {
        var that = this;
        var res;
        this.getData(this.props).then(function(d) {
            if(Qwiery.isDefined(d)) {
                if(Qwiery.isDefined(that.path)) {
                    if(that.path.indexOf('.') > 0) {
                        var split = that.path.split('.');
                        while(split.length > 0) {
                            d = d[split.shift()];
                        }
                        res = d;
                    } else {
                        res = d[that.path]
                    }
                } else {
                    res = d;
                }
            } else {
                res = "The service did not return any data, sorry";
            }
            var header = "";
            if(that.props.Header) {
                header = "<h3>" + that.props.Header + "</h3>"
            }
            $("#" + that.componentId).html(header + res);
        });


    }
});
/***
 * Presents string and HTML content.
 *
 * <SimpleContentComponent
 */
var SimpleContentComponent = React.createClass({displayName: "SimpleContentComponent",
    getInitialState: function() {
        this.componentId = Qwiery.randomId();

        return {};
    },
    render: function() {

        return React.createElement("div", {id: this.componentId});
    },
    componentDidMount: function() {
        $("#" + this.componentId).html(UI.markdown.render(this.props.content));
    }
});

/***
 * Presents or edit an entity.
 * var item = {
        "Id": "acee7a14-0750-43be-98d3-926239a8a7a4",
        "IsList": false,
        "Type": "Thought",
        "Title": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus a mauris mollis, pellentesque metus nec, fermentum nunc. ",
    }
 * <SingleEntityComponent entity=item mode="edit|read|deleted"/>
 */
var SingleEntityComponent = React.createClass({displayName: "SingleEntityComponent",

    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        this.contentId = Qwiery.randomId();
        this.relatedId = Qwiery.randomId();
        this.entity = this.props.entity;

        var mode = (this.props.mode || "read").toLowerCase();
        if(mode !== "read" && mode !== "edit" && mode !== "deleted") {
            this.error = "The 'mode' attribute can only be 'read', 'deleted' or 'edit'.";
            return {mode: "error"};
        }
        this.related = null;
        this.isFavorite = false;
        this.relatedNodes = [];
        this.relatedTags = [];
        if(Qwiery.isUndefined(this.entity)) {
            this.error = "No 'entity' attribute specified.";
            return {mode: "error"};
        }
        this.type = this.entity.DataType;

        this.hasRelatedItems = false;
        UI.onRefreshCurrentRequest = this.refresh;
        return {
            mode: mode,
            refreshRelated: true
        };
    },
    refresh: function() {
        this.hasRelatedItems = false;
        this.setState({
            mode: "read",
            refreshRelated: true
        });
    },
    /***
     * Switches the component to edit mode.
     */
    editEntity: function() {
        if(this.entity.UserId === UI.ticket.id) {
            this.setState({mode: "edit"});
        } else {
            UI.showError("You don't own this entity and hence can't edit it.");
        }

    },

    /***
     * Makes the current entity a favorite one.
     */
    toggleFavoriteEntity: function() {
        var that = this;
        if(this.isFavorite) {
            Qwiery.unFavorite(this.entity.Id).then(function() {
                UI.elementsComponent.removeFavorite(that.entity.Id);
                that.setState({mode: "read"});
            });
        } else {
            Qwiery.makeFavorite(this.entity.Id).then(function() {
                UI.elementsComponent.addFavorite({
                    Title: that.entity.Title,
                    Id: that.entity.Id,
                    IsEntity: true,
                    Type: "Entity"
                });
                that.setState({mode: "read"});
            });
        }


    },

    /***
     * Deletes the entity.
     */
    deleteEntity: function() {
        var id = this.entity.Id;
        var that = this;
        if(Qwiery.isUndefined(id)) {
            alert("This shouldn't happen; there is no entity id in the box...");
            return;
        }
        var goAhead = confirm("Are you sure?");
        if(goAhead) {
            $.when(Qwiery.deleteEntity(id)).then(function(data) {
                if(data == true) {
                    that.setState({
                        mode: "deleted",
                        refreshRelated: false
                    })
                }
                else {
                    that.error = "Failed to delete the entity.";
                    that.setState({
                        mode: "error",
                        refreshRelated: false
                    })
                }
            }).fail(function(error) {
                that.error = error;
                that.setState({
                    mode: "error",
                    refreshRelated: false
                })
            });
        }

    },
    /***
     * Shows a message.
     * @param msg
     */
    showMessage: function(msg) {
        //$("#Feedback").show();
        //$("#Feedback").html(msg);
        //setTimeout(function() {
        //    $("#Feedback").hide();
        //}, 2000);
    },

    /***
     * Re-fetches the entity from the id that the component current presents.
     * @returns {*} A promise.
     */
    fetchEntity: function() {
        var id = this.entity.Id;
        return Qwiery.getEntity(id);
    },

    /***
     * Called when the child notifies that editing is done.
     *
     * @param obj {refresh: true|false, message: ""}
     */
    childFinishedEditing: function(obj) {
        var that = this;
        var state = {
            mode: "read",
            refreshRelated: true
        };
        if(obj.entity) {
            state.entity = obj.entity;
            this.entity = state.entity;
        } else {
            state.entity = that.entity;
        }
        if(Qwiery.isUndefined(obj)) {
            $.when(this.fetchEntity()).then(function(d) {
                state.entity = d;
                that.entity = d;
                that.setState(state);
            });
        } else {
            var refresh = Qwiery.isUndefined(obj.refresh) ? true : obj.refresh;
            var message = obj.message || "";
            if(refresh) {
                $.when(this.fetchEntity()).then(function(d) {
                    that.entity = d;
                    that.setState(state);
                    that.showMessage(message);
                });
            } else {
                that.setState(state);
                that.showMessage(message);
            }

        }
        UI.refreshGraphSummary();

    },
    getReader: function() {
        var smallButton = {
            padding: 2, fontSize: 10,
            borderRadius: 0,
            outline: "none"
        };
        var reader = null;
        switch(this.type) {
            case "Thought":
                reader = React.createElement(ThoughtComponent, {mode: "read", entity: this.entity});
                break;
            case "Image":
                reader = React.createElement(ImageComponent, {mode: "read", entity: this.entity});
                break;
            case "Document":
                reader = React.createElement(DocumentComponent, {mode: "read", entity: this.entity});
                break;
            case "Person":
                reader = React.createElement("div", null, "The Person reader here");
                break;
            case "Address":
                reader = React.createElement("div", null, "The Address reader here");
                break;
            case "Task":
                reader = React.createElement(TaskComponent, {mode: "read", entity: this.entity});
                break;
            case "Video":
                reader = React.createElement(VideoComponent, {mode: "read", entity: this.entity});
                break;
            default:
                reader = React.createElement("div", null, "The reader component for ", this.type, " is not available yet.");
        }
        var relatedContent = React.createElement("div", {className: "well", id: "dropContainer"}, "Dragdrop other entities, files or images into this" + ' ' +
            "zone to link related items.");
        if(this.hasRelatedItems) {
            relatedContent = React.createElement("div", {className: "panel panel-default"}, 
                React.createElement("div", {className: "panel-heading"}, "Related"), 
                React.createElement("div", {className: "panel-body", id: "dropContainer"}, 
                    React.createElement("div", {id: this.relatedId, className: "Card", style: {minHeight:10}}, this.related)
                )
            );
        }
        return React.createElement("div", {id: this.componentId, key: this.componentId}, 
            React.createElement("div", {id: "Feedback", key: "Feedback", 
                 style: {float:"left", marginLeft: 10, marginTop: 2, color: "limegreen"}}), 
            React.createElement("div", {className: "btn-group", style: {"float":"left", "margin":"0 0 0 -10px"}}, 
                React.createElement("button", {className: "btn", style: smallButton, title: "Toggle whether this is a favorite entity", 
                        onClick: this.toggleFavoriteEntity}, React.createElement("span", {
                    className: "glyphicon glyphicon-star", id: "favstar"}))
            ), 
            React.createElement("div", {className: "btn-group", style: {float:"right"}}, 
                React.createElement("button", {className: "btn", style: smallButton, title: "Delete this entity", 
                        onClick: this.deleteEntity}, React.createElement("span", {
                    className: "glyphicon glyphicon-remove"})), 
                React.createElement("button", {className: "btn", style: smallButton, title: "Edit this entity", 
                        onClick: this.editEntity}, React.createElement("span", {
                    className: "glyphicon glyphicon-edit"}))

            ), 
            React.createElement("div", {className: "well"}, 
                reader
            ), 

            React.createElement("div", {className: "dropzone", "data-targetid": this.entity.Id}, 
                relatedContent
            )

        );
    },
    getEditor: function() {
        var editor = null;
        switch(this.type) {
            case "Thought":
                editor = React.createElement("div", {id: this.componentId, key: this.componentId}, 
                    React.createElement("div", {className: "well"}, 
                        React.createElement(ThoughtComponent, {mode: "edit", entity: this.entity, 
                                          finishedEditing: this.childFinishedEditing})
                    )
                );
                break;
            case "Image":
                editor = React.createElement("div", {id: this.componentId, key: this.componentId}, 
                    React.createElement("div", {className: "well"}, 
                        React.createElement(ImageComponent, {mode: "edit", entity: this.entity, 
                                        finishedEditing: this.childFinishedEditing})
                    )
                );
                break;
            case "Task":
                editor = React.createElement("div", {id: this.componentId, key: this.componentId}, 
                    React.createElement("div", {className: "well"}, 
                        React.createElement(TaskComponent, {mode: "edit", entity: this.entity, 
                                       finishedEditing: this.childFinishedEditing})
                    )
                );
                break;
            default:
                editor = React.createElement("div", null, "This type of editing component is not available yet.");
        }
        return editor;
    },

    render: function() {
        if(this.state.mode === "error") {
            return React.createElement("div", {id: this.componentId, key: this.componentId, className: "alert alert-danger", role: "alert"}, React.createElement("span", {
                className: "glyphicon glyphicon-exclamation-sign", "aria-hidden": "true"}), " ", this.error);
        }
        else if(this.state.mode === "deleted") {
            return React.createElement("div", {id: this.componentId, key: this.componentId}, 
                React.createElement("div", {className: "well"}, React.createElement("span", {
                    className: "glyphicon glyphicon-exclamation-sign", "aria-hidden": "true"}), " This entity was deleted."
                )
            );
        }
        else if(this.state.mode === "read") {
            return this.getReader();
        }
        else if(this.state.mode === "edit") {
            return this.getEditor();
        }
    },


    breakRelation: function(e) {
        e.preventDefault();
        var elem = $(e.target);
        var data = elem.data();
        if(data.tag) {
            var tagName = data.title;
            $.when(Qwiery.untagEntity(data.id, data.title)).then(function() {
                UI.refreshCurrent();
            });
        } else {
            var to = data.to;
            var from = data.from;
            $.when(Qwiery.unlinkEntities(from, to)).then(function() {
                UI.refreshCurrent();
            });
        }

    },
    /***
     * Calls the askFor() if defined by the parent.
     */
    raiseAskFor: function(options) {
        if(Qwiery.isDefined(this.props.askFor)) {
            if(Qwiery.isDefined(options.Id))
                this.props.askFor("get: " + options.Id);
            else
                this.props.askFor(options.title);
        }
    },
    insertRelated: function() {
        if(!this.state.refreshRelated) return;
        var that = this;
        var fileNodes = _.filter(that.relatedNodes, function(t) {
            return t.DataType === "Image" || t.DataType === "Document"
        });
        var otherNodes = _.filter(that.relatedNodes, function(t) {
            return t.DataType !== "Image" && t.DataType !== "Document"
        });
        otherNodes = otherNodes.concat(that.relatedTags);

        var documents = _.map(fileNodes, function(t) {
            var itemId = "related_" + t.Id;
            var title = t.Title;

            if(t.DataType === "Image") {
                t.Type = "Entity";
                return React.createElement("div", {className: "relatedLink", style: {float:"left"}}, React.createElement("img", {id: itemId, "data-nodeid": t.Id, 
                                                                                "data-type": t.Type, 
                                                                                className: "draggable", 
                                                                                "data-title": t.Title, title: t.Title, 
                                                                                onClick: function(){
                                                                                UI.ask({
                                                                                        type: "Entity",
                                                                                        id: t.Id,
                                                                                        title: t.Title,
                                                                                        isEntity: true
                                                                                    })
                                                                                }, 
                                                                                style: {maxWidth:150, maxHeight:150, cursor:"pointer", verticalAlign: "top", padding:5}, 
                                                                                src: Qwiery.serviceURL + "/uploads/" + t.Source}), React.createElement("span", {
                    className: "glyphicon glyphicon-remove imageDeleter", title: "Remove this related item", 
                    onClick: that.breakRelation, "data-to": t.Id, "data-from": that.entity.Id, "data-tag": "false"})
                );
            } else if(t.DataType === "Document") {
                t.Type = "Entity";
                var source = UI.getFileIcon(t.Title);
                return React.createElement("div", {className: "relatedLink", style: {float:"left"}}, React.createElement("img", {id: itemId, "data-nodeid": t.Id, 
                                                                                "data-type": t.Type, 
                                                                                className: "draggable", 
                                                                                "data-title": t.Title, title: t.Title, 
                                                                                onClick: function(){
                                                                                UI.ask({
                                                                                        type: "Entity",
                                                                                        id: t.Id,
                                                                                        title: t.Title,
                                                                                        isEntity: true
                                                                                    })
                                                                                }, 
                                                                                style: {maxWidth:150, maxHeight:150, cursor:"pointer", verticalAlign: "top", padding:5}, 
                                                                                src: source}), React.createElement("span", {
                    className: "glyphicon glyphicon-remove imageDeleter", title: "Remove this related item", 
                    onClick: that.breakRelation, "data-to": t.Id, "data-from": that.entity.Id, "data-tag": "false"})
                );
            }

        });
        var links = _.map(otherNodes, function(t) {
            var itemId = "related_" + t.Title;
            var title = t.Title;

            if(t.DataType !== "Image" && t.DataType !== "Document") {
                if(t.DataType === "Tag") {
                    return React.createElement("li", {key: Qwiery.randomId(), className: "relatedLink"}, 
                        React.createElement("div", null, React.createElement("span", {id: itemId, "data-nodeid": t.Id, "data-type": "Tag", "data-isentity": "true", 
                                   className: "draggable", "data-title": t.Title, 
                                   onClick: UI.handleClick}, title), React.createElement("span", {
                            className: "glyphicon glyphicon-remove textDeleter", title: "Remove this related item", 
                            onClick: that.breakRelation, "data-id": that.entity.Id, "data-tag": "true", 
                            "data-title": t.Title})
                        )
                    );
                } else {
                    return React.createElement("li", {key: Qwiery.randomId(), className: "relatedLink"}, 
                        React.createElement("div", null, React.createElement("span", {id: itemId, "data-nodeid": t.Id, "data-type": t.DataType, "data-isentity": "true", 
                                   className: "draggable", "data-title": t.Title, 
                                   onClick: UI.handleClick}, title), React.createElement("span", {
                            className: "glyphicon glyphicon-remove textDeleter", title: "Remove this related item", 
                            onClick: that.breakRelation, "data-to": t.Id, "data-from": that.entity.Id, 
                            "data-tag": "false"})
                        )
                    );
                }

            }
        });

        // add automatically the tags main link for corresponding type
        switch(this.type.toLowerCase()) {
            case "thought":
                links.push(React.createElement("li", {key: Qwiery.randomId(), className: "relatedLink"}, 
                    React.createElement("div", null, React.createElement("span", {id: Qwiery.randomId(), onClick: UI.handleClick}, "All ideas")
                    )
                ));
                break;
            case "address":
                links.push(React.createElement("li", {key: Qwiery.randomId(), className: "relatedLink"}, 
                    React.createElement("div", null, React.createElement("span", {id: Qwiery.randomId(), onClick: UI.handleClick}, "All addresses")
                    )
                ));
                break;
            case "task":
                links.push(React.createElement("li", {key: Qwiery.randomId(), className: "relatedLink"}, 
                    React.createElement("div", null, React.createElement("span", {id: Qwiery.randomId(), onClick: UI.handleClick}, "All tasks")
                    )
                ));
                break;
            case "person":
                links.push(React.createElement("li", {key: Qwiery.randomId(), className: "relatedLink"}, 
                    React.createElement("div", null, React.createElement("span", {id: Qwiery.randomId(), onClick: UI.handleClick}, "All people")
                    )
                ));
                break;
        }

        this.hasRelatedItems = links.length > 0 || documents.length > 0;
        // if no links then the right part is hanging a bit odd
        if(links.length > 0) {
            this.related = React.createElement("div", {className: "row"}, 
                React.createElement("div", {className: "col-md-6"}, 
                    React.createElement("ul", {id: "relatedLinks"}, links)
                ), 
                React.createElement("div", {className: "col-md-6"}, 
                    React.createElement("div", {id: "relatedFiles"}, documents)
                )
            );
        } else {
            this.related = React.createElement("div", {className: "row"}, 
                React.createElement("div", {className: "col-md-12"}, 
                    React.createElement("div", {id: "relatedFiles"}, documents)
                )
            );
        }
    },

    adorn: function() {
        var that = this;
        if(this.state.mode === "read") {
            Qwiery.isFavorite(this.entity.Id).then(function(yn) {
                that.isFavorite = yn;
                $("#favstar").css("color", yn ? "red" : "white");
            });
            if(this.state.refreshRelated) {
                $.when(Qwiery.getRelated(this.entity.Id), Qwiery.getEntityTags(this.entity.Id)).then(function(a, b) {
                    var nodes = a[0];
                    var tags = b[0];

                    that.relatedNodes = nodes || [];
                    if(Qwiery.isDefined(tags)) {
                        tags = _.map(tags, function(tag) {
                            return {
                                DataType: "Tag",
                                Title: tag
                            }
                        })
                    }
                    that.relatedTags = tags || [];
                    that.insertRelated();

                    that.setState({
                        refreshRelated: false
                    });

                });
            }
        }
        UI.enablePopovers();
        UI.makeDraggables();
    },
    componentDidUpdate: function() {
        this.adorn();
    },
    componentDidMount: function() {
        this.adorn();
    }
});

/***
 * Presents the entities of a tag.
 */
var TagEntitiesComponent = React.createClass({displayName: "TagEntitiesComponent",
    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        this.tagName = this.props.Tag;
        return {};
    },
    render: function() {
        return React.createElement("div", {id: this.componentId, style: {border:"none"}});
    },
    adorn: function() {
        var that = this;
        $.when(Qwiery.getTagEntities(this.tagName)).then(function(entities) {
            that.thoughts = entities;
            for(var k = 0; k < entities.length; k++) {
                var thought = entities[k];
                var $item;
                if(!Qwiery.isDefined(thought.Source)) {
                    thought.Source = "cogs.png";
                }
                $item = $('<div class="thought-wall-item"  onClick="UI.ask(\'get:' + thought.Id + '\')"><span class="fa fa-lightbulb-o" style="font-size:15px; float: left;margin-right: 5px;"></span><span class="thought-title">' + thought.Title + '</span><img class="thought-image" src="' + Qwiery.serviceURL + '/Uploads/' + thought.Source + '"/><p class="thought-description">' + _.truncate(thought.Description, 60) + '</p></div>');
                that.$container.append($item);
                $item.hide();
                that.iso.isotope('appended', $item);
                that.iso.isotope('layout');
                $item.fadeIn(500);
            }
        });
    },
    componentDidUpdate: function() {
        this.iso.isotope('layout');
    },
    componentDidMount: function() {
        this.$container = $("#" + this.componentId);
        this.iso = this.$container.isotope({
            itemSelector: '.thought-wall-item',
            masonry: {
                columnWidth: '.thought-wall-item'
            }
        });
        this.adorn();
    }
});

/***
 * Displays the tags of the user.
 */
var TagsComponent = React.createClass({displayName: "TagsComponent",

        getInitialState: function() {
            this.componentId = Qwiery.randomId();
            this.tags = [];
            return {dataLoaded: false};
        },
        
        render: function() {
            if(!this.state.dataLoaded){
                return React.createElement("div", {id: this.componentId});
            }
            var renderedTags = [];
            if(Qwiery.isUndefined(this.tags) || this.tags.length === 0) {
                renderedTags.push(React.createElement("div", null, "You don't have any tags yet."));
            } else {
                var lis = [];
                for(var k = 0; k < this.tags.length; k++) {
                    var t = this.tags[k];
                    var thetitle = t.isEntity?"Entity":"Input";
                    if(t.isEntity && Qwiery.isDefined(t.type)){
                        thetitle += " [" + t.type + "]";
                    }
                    lis.push(React.createElement("li", {key: t.Id, style: {"list-style":"none"}}, React.createElement("span", {className: "glyphicon glyphicon-triangle-right", 
                                                  style: {top:2, color:"grey"}}), React.createElement("a", {href: "#", id: Qwiery.randomId(), 
                                                                                          "data-type": t.Type, 
                                                                                          "data-title": t.Title, 
                                                                                          "data-nodeid": t.NodeId || t.Id, 
                                                                                          "data-isentity": "true", 
                                                                                          onClick: UI.handleClick, 
                                                                                          "data-toggle": "popover", 
                                                                                          title: thetitle, 
                                                                                          "data-html": "true", 
                                                                                          "data-content": t.Title}, t.Title)
                    ));
                }
                renderedTags.push(React.createElement("ul", null, lis));
            }

            return React.createElement("div", {id: this.componentId}, 
                renderedTags
            )
        },

        componentDidMount: function() {
            var that = this;
            var $el = $("#" + this.componentId);
            var presentTags = function(tags) {
                for(var k = 0; k < tags.length; k++) {
                    var tag = tags[k];
                    that.tags.push({
                        Id: tag.Id,
                        Title: tag.Title,
                        Type: "Tag"
                    })
                }
                that.setState({dataLoaded: true});
            };

            UI.fetch(Qwiery.getTags(), presentTags);
        }
    });

var TaskComponent = React.createClass({displayName: "TaskComponent",
    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        this.contentId = Qwiery.randomId();
        this.relatedId = Qwiery.randomId();

        // clone in case of cancel
        this.entity = jQuery.extend({}, this.props.entity);
        var mode = (this.props.mode || "read").toLowerCase();
        if(mode !== "read" && mode !== "edit" && mode !== "deleted") {
            this.error = "The 'mode' attribute can only be 'read', 'deleted' or 'edit'.";
            return {mode: "error"};
        }
        if(Qwiery.isUndefined(this.entity)) {
            this.error = "No 'entity' attribute specified.";
            return {mode: "error"};
        }
        this.type = this.entity.Type;
        return {
            mode: mode
        };
    },

    finishedEditing: function(obj) {
        if(Qwiery.isDefined(this.props.finishedEditing)) {
            this.props.finishedEditing(obj);
        }
    },

    editEntity: function() {
        this.setState({mode: "edit"});
    },

    cancelEdit: function() {
        event.preventDefault();
        this.finishedEditing({
            refresh: false,
            entity: this.props.entity
        });
    },
    handleChange: function(event) {
        if(event.target.id === "titleBox")
            this.entity.Title = event.target.value;
        else
            this.entity.Description = event.target.value;
        this.setState({entity: this.entity});
    },
    saveEdit: function(event) {
        var that = this;
        event.preventDefault();
        var postUpdate = function(data) {
            console.log("Upserted the Task " + that.entity.Id);
            //showMessage(data === true ? "The data was saved." : "Please try again, something happened along the way."); }
            that.finishedEditing({
                refresh: false,
                entity: that.entity
            });
        };
        $.when(Qwiery.upsertEntity(this.entity)).then(postUpdate);
    },

    render: function() {
        if(this.state.mode === "error") {
            return React.createElement("div", {id: this.componentId, key: this.componentId, className: "alert alert-danger", role: "alert"}, React.createElement("span", {
                className: "glyphicon glyphicon-exclamation-sign", "aria-hidden": "true"}), " ", this.error);
        }
        else if(this.state.mode === "read") {
           return React.createElement("div", {id: this.componentId, key: this.componentId}, 
                React.createElement("div", null, 
                    React.createElement("span", {className: "glyphicon glyphicon-tasks", "aria-hidden": "true", style: {fontSize:20}}), " ", React.createElement("span", {className: "EntityTitle"}, this.entity.Title)
                ), 
                React.createElement("div", {className: "EntityBody"}, 
                    React.createElement("div", {className: "task-priority"}, "Priority: ", this.entity.Priority), 
                    React.createElement("div", null, this.entity.Description)

                )
            );

        } else if(this.state.mode === "edit") {
            return React.createElement("div", {id: this.componentId, key: this.componentId}, 

                React.createElement("form", {id: "TaskEditor"}, 
                    React.createElement("label", {for: "titleBox"}, "Title:"), 
                    React.createElement("input", {id: "titleBox", name: "Title", value: this.entity.Title, style: {width:"100%"}, 
                           onChange: this.handleChange}), 
                    React.createElement("label", {for: "descriptionBox"}, "Description:"), 
                        React.createElement("textarea", {id: "descriptionBox", name: "Description", rows: "15", cols: "20", 
                                  onChange: this.handleChange, value: this.entity.Description, 
                                  style: {height:350, width:"100%"}}
                        ), 

                    React.createElement("div", {className: "btn-group-right", role: "group", style: {textAlign: "right", marginTop:5}}, 
                        React.createElement("div", {className: "btn btn-default", id: "CancelButton", onClick: this.cancelEdit}, "Cancel"), 
                        React.createElement("div", {className: "btn btn-default", id: "SaveButton", onClick: this.saveEdit}, "Save")
                    ), 
                    React.createElement("div", {id: "prioritySlider"})
                ), 
                React.createElement("div", null, this.entity.Id)
            );
        }
        else if(this.state.mode === "deleted") {
            return React.createElement("div", {id: this.componentId, key: this.componentId}, 
                React.createElement("div", {className: "well"}, React.createElement("span", {
                    className: "glyphicon glyphicon-exclamation-sign", "aria-hidden": "true"}), " This entity was deleted."
                )
            );
        }


    },
    componentDidMount: function() {
        var that = this;
        $("#prioritySlider").kendoSlider({
            value: that.entity.Priority,
            min: 0,
            max: 10,
            change: function() {
                that.entity.Priority = this.value()
            }
        })
    }
});
/***
 * Presents the tasks.
 * var things = [
 {
           "Title": "Task 1",
           "Description": "",
           "Id": "9cd3ee05-7612-441d-b780-7dba087f4011",
 }
 *
 * ]
 * <TasksComponent tasks=things/>
 */
var TasksComponent = React.createClass({displayName: "TasksComponent",
    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        this.tasks = this.props.tasks;

        return {};
    },
    render: function() {
        return React.createElement("div", {id: this.componentId, style: {border:"none"}});
    },
    
    adorn: function() {
        var that = this;
        if(Qwiery.isDefined(this.tasks)) {
            that.presentThem(this.tasks);
        } else {
            $.when(Qwiery.getTasks()).then(function(tasks) {
                that.tasks = tasks;
                that.presentThem(tasks);
            });
        }

    },
    presentThem: function(tasks) {

        for(var k = 0; k < tasks.length; k++) {
            var task = tasks[k];
            var $item;
            if(task.Type === "Workflow") {
                $item = $('<div class="task-wall-item"  onClick="UI.ask(\'run:workflow:' + task.Id + '\', false)"><span class="glyphicon glyphicon-leaf" style="font-size:15px; float: left;margin-right: 5px;"></span><span class="task-title">' + task.Title + '</span><p class="task-description">' + task.Description + '</p></div>');
            } else {
                if(Qwiery.isDefined(task.Source)) {
                    $item = $('<div class="task-wall-item"  onClick="UI.ask(\'get:' + task.Id + '\')"><span class="glyphicon glyphicon-leaf" style="font-size:15px; float: left;margin-right: 5px;"></span><span class="task-title">' + task.Title + '</span><img class="task-image" src="' + Qwiery.serviceURL + '/Uploads/' + task.Source + '"/><p class="task-description">' + task.Description + '</p></div>');
                } else {
                    $item = $('<div class="task-wall-item"  onClick="UI.ask(\'get:' + task.Id + '\')"><span class="glyphicon glyphicon-leaf" style="font-size:15px; float: left;margin-right: 5px;"></span><span class="task-title">' + task.Title + '</span><p class="task-description">' + task.Description + '</p></div>');
                }
            }


            this.$container.append($item);
            $item.hide();
            this.iso.isotope('appended', $item);
            this.iso.isotope('layout');
            $item.fadeIn(500);
        }
        //that.iso.isotope('layout');
    },
    componentDidUpdate: function() {
        //this.adorn();
        this.iso.isotope('layout');
    },
    componentDidMount: function() {
        this.$container = $("#" + this.componentId);
        this.iso = this.$container.isotope({
            itemSelector: '.task-wall-item',
            masonry: {
                columnWidth: '.task-wall-item'
            }
        });
        this.adorn();
    }
});

var ThoughtComponent = React.createClass({displayName: "ThoughtComponent",
    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        this.contentId = Qwiery.randomId();
        this.relatedId = Qwiery.randomId();

        // clone in case of cancel
        this.entity = jQuery.extend({}, this.props.entity);
        var mode = (this.props.mode || "read").toLowerCase();
        if(mode !== "read" && mode !== "edit" && mode !== "deleted") {
            this.error = "The 'mode' attribute can only be 'read', 'deleted' or 'edit'.";
            return {mode: "error"};
        }
        if(Qwiery.isUndefined(this.entity)) {
            this.error = "No 'entity' attribute specified.";
            return {mode: "error"};
        }
        this.markdownEditor = null;
        this.type = this.entity.Type;
        return {
            mode: mode
        };
    },

    finishedEditing: function(obj) {
        if(Qwiery.isDefined(this.props.finishedEditing)) {
            this.props.finishedEditing(obj);
        }
    },

    editEntity: function() {
        this.setState({mode: "edit"});
    },

    cancelEdit: function() {
        event.preventDefault();
        this.finishedEditing({
            refresh: false,
            entity: this.props.entity
        });
    },
    handleChange: function(event) {
        if(event.target.id === "titleBox")
            this.entity.Title = event.target.value;
        else
            this.entity.Description = event.target.value;
        this.setState({entity: this.entity});
    },
    saveEdit: function(event) {
        var that = this;
        event.preventDefault();
        this.entity.Description = this.markdownEditor.value();
        this.entity.Tags = $("#tagsBox").val().split(',');
        this.entity.Tags = _.map(this.entity.Tags, function(tagName){
           return tagName.trim();
        });
        var postUpdate = function(data) {
            console.log("Upserted the Thought " + that.entity.Id);
            that.finishedEditing({
                refresh: true,
                entity: that.entity
            });
        };
        $.when(Qwiery.upsertEntity(this.entity)).then(postUpdate);//UI.serializeForm($("#ThoughtEditor")))
    },

    render: function() {
        if(this.state.mode === "error") {
            return React.createElement("div", {id: this.componentId, key: this.componentId, className: "alert alert-danger", role: "alert"}, React.createElement("span", {
                className: "glyphicon glyphicon-exclamation-sign", "aria-hidden": "true"}), " ", this.error);
        }
        else if(this.state.mode === "read") {
            return React.createElement("div", {id: this.componentId, key: this.componentId}, 
                React.createElement("div", {className: "EntityTitle"}, this.entity.Title), 
                React.createElement("div", {id: "renderedMarkdown"})
            );
        } else if(this.state.mode === "edit") {
            return React.createElement("div", {id: this.componentId, key: this.componentId}, 

                React.createElement("form", {id: "ThoughtEditor"}, 
                    React.createElement("label", {style: {"margin": "10px 0"}, for: "titleBox"}, "Title:"), 
                    React.createElement("input", {id: "titleBox", name: "Title", value: this.entity.Title, style: {width:"100%"}, 
                           onChange: this.handleChange}), 
                    React.createElement("label", {style: {"margin": "10px 0"}, for: "descriptionBox"}, "Description:"), 
                        React.createElement("textarea", {id: "descriptionBox", name: "Description", rows: "15", cols: "20", 
                                  onChange: this.handleChange, value: this.entity.Description, 
                                  style: {height:350, width:"100%"}}
                        ), 
                    React.createElement("label", {style: {"margin": "10px 0"}, for: "tagsBox"}, "Tags:"), 
                    React.createElement("input", {style: {width:"100%"}, type: "text", id: "tagsBox"}), 
                    React.createElement("div", {className: "btn-group-right", role: "group", style: {textAlign: "right", marginTop: "15px"}}, 
                        React.createElement("div", {className: "btn btn-default", id: "CancelButton", onClick: this.cancelEdit}, "Cancel"), 
                        React.createElement("div", {style: {marginLeft: "10px"}, className: "btn btn-default", id: "SaveButton", onClick: this.saveEdit}, "Save")
                    )


                )
            );
        }
        else if(this.state.mode === "deleted") {
            return React.createElement("div", {id: this.componentId, key: this.componentId}, 
                React.createElement("div", {className: "well"}, React.createElement("span", {
                    className: "glyphicon glyphicon-exclamation-sign", "aria-hidden": "true"}), " This entity was deleted."
                )
            );
        }


    },
    componentDidMount: function() {
        if(this.state.mode === "read") {
            if(!UI.markdown) {
                UI.markdown = window.markdownit({html:true}).use(window.markdownitEmoji);
            }
            var html = UI.markdown.render(this.entity.Description);
            Qwiery.getEntityRandomImage(this.entity.Id).then(function(imentity) {
                var thumb = "";
                if(Qwiery.isDefined(imentity)) {
                    thumb = "<img style='width:40%; margin: 0 0 10px 15px; float: right;' src='/Uploads/" + imentity.Source + "'/>  ";
                }
                $("#renderedMarkdown").html(thumb + html);
            });

        } else {
            if(Qwiery.isUndefined(this.markdownEditor)) {
                var $markdownEditorArea = $("#descriptionBox");
                this.markdownEditor = new SimpleMDE({element: $markdownEditorArea[0]});
                this.markdownEditor.value(this.entity.Description)
            }
            var topdata = [];
            Qwiery.getTags().then(function(tagNames) {
                _.forEach(tagNames, function(tag) {
                    topdata.push(tag.Title);
                });
                $("#tagsBox").kendoAutoComplete({
                    dataSource: topdata,
                    filter: "startswith",
                    placeholder: "Add one or more tag...",
                    separator: ", "
                });
            });

            $("#tagsBox").val(this.entity.Tags.join(","));
        }
    }
});
/***
 * Presents the thoughts.
 */
var ThoughtsComponent = React.createClass({displayName: "ThoughtsComponent",
    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        this.thoughts = this.props.thoughts;
        return {};
    },
    render: function() {
        return React.createElement("div", {id: this.componentId, style: {border:"none"}});
    },
    
    adorn: function() {
        var that = this;
        $.when(Qwiery.getThoughts()).then(function(thoughts) {
            that.thoughts = thoughts;
            for(var k = 0; k < thoughts.length; k++) {
                var thought = thoughts[k];
                var $item;
                if(!Qwiery.isDefined(thought.Source)) {
                  thought.Source = "cogs.png";  
                } 
                $item = $('<div class="thought-wall-item"  onClick="UI.ask(\'get:' + thought.Id + '\')"><span class="fa fa-lightbulb-o" style="font-size:15px; float: left;margin-right: 5px;"></span><span class="thought-title">' + thought.Title + '</span><img class="thought-image" src="' + Qwiery.serviceURL + '/Uploads/' + thought.Source + '"/><p class="thought-description">' + _.truncate(thought.Description, 60) + '</p></div>');
                that.$container.append($item);
                $item.hide();
                that.iso.isotope('appended', $item);
                that.iso.isotope('layout');
                $item.fadeIn(500);
            }
        });
    },
    componentDidUpdate: function() {
        // this.adorn();
        this.iso.isotope('layout');
    },
    componentDidMount: function() {
        this.$container = $("#" + this.componentId);
        this.iso = this.$container.isotope({
            itemSelector: '.thought-wall-item',
            masonry: {
                columnWidth: '.thought-wall-item'
            }
        });
        this.adorn();
    }
});

var TraceItemBody = React.createClass({displayName: "TraceItemBody",
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
            return React.createElement("a", {href: "#", className: "traceChildBody", style: clickable, "data-toggle": "popover", 
                      title: this.props.child.Grab, "data-html": "true", 
                      "data-content": this.props.child.Grab, 
                      onClick: this.editTemplate}, grabber)

        }
        else if(this.props.child.DataType === "TraceStackItem") {
            return React.createElement("span", {className: "traceChildBody"}, this.props.child.Content)
        }
        else {
            return React.createElement("span", {className: "traceChildBody"}, "Was expecting a trace item type but did not find it.")
        }

    },
    editTemplate: function(e) {
        this.raiseShowEditorTemplate(this.props.child);
    }
});

var TraceItem = React.createClass({displayName: "TraceItem",
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
        return React.createElement("div", {className: "traceSection", key: Qwiery.randomId()}, 
            React.createElement("span", {className: "traceSectionTitle", key: Qwiery.randomId(), style: {color:color}}, 
                this.props.child.Head
            ), 
            React.createElement(TraceItemBody, {child: this.props.child, editQTL: this.raiseShowEditorTemplate})
        );
    }
});

/***
 * A component displaying the content of the session's trace.
 */
var TraceComponent = React.createClass({displayName: "TraceComponent",
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
            return React.createElement("div", null, "Dear Anonymous, you need to be logged in to see the trace. ");
        }
        var display = {
            display: this.state.showTemplateEditor ? "block" : "none"
        };


        if(this.state.visibility === "hidden" || Qwiery.isUndefined(this.state.trace)) {
            return React.createElement("div", {className: "traceRoot"}, "No trace to display right now.");
        }
        else {
            return React.createElement("div", null, 
                React.createElement("div", {className: "traceRoot", key: Qwiery.randomId()}, 
                    this.renderTraceChildren()
                ), 
                React.createElement("div", {id: "editor"})
            )
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
                    return React.createElement(TraceItem, {child: t, key: Qwiery.randomId(), editQTL: that.edit});
                });
                result.push(ostack);
            }
            if(traceItem.Commands) {
                var cstack = _.map(traceItem.Commands, function(t) {
                    return React.createElement(TraceItem, {child: t, key: Qwiery.randomId()});
                });
                result.push(cstack);
            }
        });

        result = _.flatten(result);
        return result;

    },

});

var TrailItem = React.createClass({displayName: "TrailItem",
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
        return React.createElement("li", {id: this.itemId, key: this.itemId}, 
            React.createElement("a", {id: this.itemAId, "data-isentity": this.props.data.isEntity, "data-nodeid": this.props.data.id, 
               "data-toggle": "popover", "data-html": "true", 
               "data-type": this.props.data.isEntity===true? "Entity": null, 
               "data-content": this.props.data.title, "data-title": this.props.data.title, 
               className: this.props.data.isEntity?"draggable":"", 
               onClick: function(){UI.ask(that.props.data)}, 
               href: "#", title: thetitle}, 
                this.props.data.title
            )
        );
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
    {displayName: "TrailComponent",
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
                    return React.createElement("div", {id: this.componentId, key: this.componentId, className: "trailer"}, 
                        React.createElement("div", {id: "trailer", key: "trailer"}, 
                            React.createElement("ul", {className: "breadcrumb"}, items)
                        )
                    );
                }else{
                    return React.createElement("div", {id: this.componentId, key: this.componentId, className: "trailer"}, "No trail yet.");
                }

            } else {
                return React.createElement("div", {id: this.componentId, key: this.componentId, className: "trailer"});
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
                return React.createElement(TrailItem, {data: t, key: Qwiery.randomId(), handleClick: UI.handleClick});
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
var UsersComponent = React.createClass({displayName: "UsersComponent",
    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        this
        busy = false;
        return {};
    },
    render: function() {
        return React.createElement("div", {id: this.componentId});
    },
    deleteUser: function(e) {
        var that = this;
        if(this.busy)return;
        this.busy = true;
        e.preventDefault();
        var gridObject = $("#" + this.componentId).getKendoGrid();
        var dataItem = gridObject.dataItem($(e.currentTarget).closest("tr"));
        var userId = dataItem.Id;
        var goAhead = confirm("Are you sure?");
        if(goAhead) {
            Qwiery.deleteUser(userId).then(function(d) {
                that.setState({});
            });
        }
        this.busy = false;
    },
    adorn: function() {
        var that = this;
        var grid = $("#" + this.componentId).getKendoGrid();
        if(Qwiery.isDefined(grid)){
            grid.destroy();
            $("#" + this.componentId).empty();
        }
        Qwiery.getAllUsers()
            .then(function(data) {

                $("#" + that.componentId).kendoGrid({
                    dataSource: {
                        data: data,
                        pageSize: 10
                    },
                    columns: [
                        {field: "UserId", title: "User Id", width: "130px"},
                        {field: "CreationDate", title: "Created", width: "130px"},
                        {command: {text: "Delete", click: that.deleteUser}, title: " ", width: "140px"}
                    ],
                    pageable: true
                    // dataBinding: function () { record = (this.dataSource.page() - 1) * this.dataSource.pageSize() - 1; }
                });

            }).fail(function(error) {
            $("#content" + that.componentId).html(error);

        });
    },
    componentDidUpdate: function() {
        this.adorn();
    },
    componentDidMount: function() {
        this.adorn();
    }

});

/***
 * A component to present video content.
 */
var VideoComponent = React.createClass({displayName: "VideoComponent",

    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        return {};
    },
    // <video id="thevideo" width="670" height="377" autoplay="true" controls="controls">
    //     <source src="" type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"'/>
    // </video>
    render: function() {
        return React.createElement("div", {id: this.componentId}, 
            React.createElement("iframe", {id: "thevideo", width: "560", height: "315", src: "", frameborder: "0", allowfullscreen: true})
        )
    },

    componentDidMount: function() {
        //$("#thevideo" + " > source").attr("src", this.props.entity.Url);
        $("#thevideo").attr("src", this.props.entity.Url);
    }
});
/***
 * A component to present weather info.
 */
var WeatherComponent = React.createClass({displayName: "WeatherComponent",

    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        this.location = this.props.Location;
        return {};
    },

    render: function() {
        return React.createElement("div", {id: this.componentId}, 
            React.createElement("div", {id: "weather"})
        );
    },
    componentWillMount: function() {
        $("<link/>", {
            rel: "stylesheet",
            type: "text/css",
            href: "/styles/weather.css"
        }).appendTo("head");

    },
    componentDidMount: function() {
        // var html = "<span>Sorry, could not fetch the weather data.</span>";
         var that = this;
        // $.ajax({
        //     url: "https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='" + this.location + "') and u='c'&format=json&jsoncallback=json",
        //     dataType: "jsonp",
        //     headers: {
        //         "Content-type": "application/json",
        //         "Accept": "application/json"
        //     },
        //     timeout: Qwiery.timeout
        // }).fail(function(error) {
        //     $("#" + that.componentId).html(html);
        // }).then(function(data) {
        //
        //     html = "<div>" + data.query.results.channel.item.condition.text + "</div>";
        //     $("#" + that.componentId).html(html);
        // });
        $.getScript("/Babble/scripts/simpleWeather.min.js", function() {
            $.simpleWeather({
                location: that.location,
                woeid: '',
                unit: 'c',
                success: function(weather) {
                    html = '<h2><i class="icon-' + weather.code + '"></i> ' + weather.temp + '&deg;' + weather.units.temp + '</h2>';
                    html += '<ul><li>' + weather.city + ', ' + weather.region + '</li>';
                    html += '<li class="currently">' + weather.currently + '</li>';
                    html += '<li>' + weather.wind.direction + ' ' + weather.wind.speed + ' ' + weather.units.speed + '</li></ul>';

                    $("#weather").html(html);
                },
                error: function(error) {
                    $("#weather").html('<p>' + error + '</p>');
                }
            });
        });

    }
});

var WikipediaComponent = React.createClass({displayName: "WikipediaComponent",
    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        return {};
    },
    render: function() {
        return React.createElement("div", {id: this.componentId});
    },

    componentDidMount: function() {
        var that = this;
        var items = [];
        var container = $("#" + this.componentId);
        $.when(Qwiery.searchWikipedia(that.props.Term.trim())).then(function(data) {
            var page = data.Page;
            that.items = data.Other;
            var pageName = data.PageName;

            // for(var i = 0; i < data.length; i++) {
            //     var entity = data[i];
            //     that.items.push(<div style={{fontWeight:"bold","margin":"10px 0 5px 0"}}><a target='_blank'
            //                                                                                 style={{'textDecoration':"none"}}
            //                                                                                 href={entity.Url}>{entity.Text}</a>
            //     </div>);
            //     if(Qwiery.isDefined(entity.Description) && entity.Description.length > 0) {
            //         that.items.push(<div>{entity.Description}</div>);
            //     }
            //     if(Qwiery.isDefined(entity.ImageUrl) && entity.ImageUrl.length > 0) {
            //         that.items.push(<img style={{width:400}} src={entity.ImageUrl}/>);
            //     }
            // }

            //that.forceUpdate();
            if(Qwiery.isDefined(page)) {
                $.ajax({dataType: "jsonp", url: "https://en.wikipedia.org/w/api.php?action=query&titles=" + pageName + "&prop=pageimages&format=json&pithumbsize=500"}).then(function(r) {
                    try {
                        var imageUrl = r.query.pages[Object.keys(r.query.pages)[0]].thumbnail.source;
                        container.append("<img src='" + imageUrl + "'/>");
                    } catch(e) {

                    }
                    if(_.keys(page).length === 0) {
                        container.append("<div>Wikipedia did not respond to a request. Try again or try asking in a different way.</div>");
                    } else {
                        container.append("<ul>");

                        _.forEach(page, function(v, k) {
                            k = k.replace(/_/gi, "");
                            if(v.indexOf("plainlist") > 0) {

                            } else {
                                container.append("<li><strong>" + k + "</strong>: " + v + "</li>")
                            }
                        });
                        container.append("</ul>");
                    }

                })

            } else {
                container.html("<div>Sorry, the info could not be found.</div>")
            }
        })
    }
});
/***
 * Presents a Wikipedia item.
 *
 * <WikipediaItemComponent/>
 */
var WikipediaItemComponent = React.createClass({displayName: "WikipediaItemComponent",
    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        return {};
    },

    /***
     * Creates an entity from the item and switches the icon to a clickable link to the created item.
     * If it's a link the user can click through to the created item.
     *
     * This double behavior allows to click-add multiple items within the results.
     */
    createOrGoToEntity: function() {
        var $plus = $("#plus_" + this.componentId);
        if($plus.hasClass("fa-link")) {
            UI.ask("get:" + $plus.data("entityId"));
        } else {
            UI.saveAsEntity(this.props).then(function(newid) {
                if(Qwiery.isDefined(newid)) {
                    $plus.removeClass("fa-plus-circle");
                    $plus.addClass("fa-link");
                    $plus.data("entityId", newid);
                }
            })
        }
    },

    render: function() {
        var url = this.props.Url;
        return React.createElement("div", {id: this.componentId, className: "ItemComponentItem"}, 
            React.createElement("div", {className: "WikipediaItem"}, 
                React.createElement("a", {href: url, target: "_blank"}, 
                    React.createElement("i", {className: "fa fa-wikipedia-w iconfix"}), React.createElement("strong", null, " Wikipedia: ", this.props.PageName)
                ), 
                React.createElement("i", {id: "plus_"+ this.componentId, onClick: this.createOrGoToEntity, className: "fa fa-plus-circle iconadd", title: "Create an entity from this."})
            )
        );
    },

    componentDidMount: function() {
        var that = this;
        $.ajax({
            dataType: "jsonp",
            url: "https://en.wikipedia.org/w/api.php?action=query&titles=" + this.props.PageName + "&prop=pageimages&format=json&pithumbsize=500"
        }).then(function(r) {
            try {
                var imageUrl = r.query.pages[Object.keys(r.query.pages)[0]].thumbnail.source;
                $("#" + that.componentId).append("<img src='" + imageUrl + "' style='margin:30px; width:100%; max-width:500px;'/>");
            } catch(e) {

            }
        });
    }
});


/***
 * Presents Wolfram Alpha results.
 *
 * <WolframAlphaComponent term="chromatic" />
 */
var WolframAlphaComponent = React.createClass({displayName: "WolframAlphaComponent",
    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        this.term = this.props.term;
        return {};
    },
    render: function() {
        return React.createElement("div", {id: this.componentId}, this.items);
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
                that.items.push(React.createElement("div", {style: {fontWeight:"bold","margin":"10px 0 5px 0"}}, React.createElement("a", {target: "_blank", 
                                                                                            style: {'textDecoration':"none"}, 
                                                                                            href: entity.Url}, entity.Title)
                ));
                if(Qwiery.isDefined(entity.Description) && entity.Description.length > 0) {
                    that.items.push(React.createElement("div", null, entity.Description));
                }
                if(Qwiery.isDefined(entity.ImageSource) && entity.ImageSource.length > 0) {
                    that.items.push(React.createElement("img", {style: {width:400}, src: entity.ImageSource}));
                }
            }

            that.forceUpdate();
        })
    }
});

/***
 * Presents the workspaces aka notebooks.
 */
var WorkspacesComponent = React.createClass({displayName: "WorkspacesComponent",
    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        return {};
    },
    render: function() {
        return React.createElement("div", {id: this.componentId, style: {border:"none","minHeight":"300px"}});
    },

    adorn: function() {
        var that = this;
        $.when(Qwiery.getSpaces()).then(function(spaces) {
            that.spaces = spaces;
            for(var k = 0; k < spaces.length; k++) {
                var space = spaces[k];
                var $item;

                space.Source = "notebook.png";

                $item = $('<div class="notebook-wall-item"  onClick="UI.ask(\'get:space:' + space.Name + '\')"><span class="fa fa-book" style="font-size:15px; float: left;margin-right: 5px;"></span><span class="thought-title">' + space.Name + '</span></div>');
                that.$container.append($item);
                $item.hide();
                that.iso.isotope('appended', $item);
                that.iso.isotope('layout');
                $item.fadeIn(500);
            }
        });
    },
    componentDidUpdate: function() {
        // this.adorn();
        this.iso.isotope('layout');
    },
    componentDidMount: function() {
        this.$container = $("#" + this.componentId);
        this.iso = this.$container.isotope({
            itemSelector: '.thought-wall-item',
            masonry: {
                columnWidth: '.thought-wall-item'
            }
        });
        this.adorn();
    }
});
