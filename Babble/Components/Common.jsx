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
        if(window.location.href.indexOf("localhost")) {
            Qwiery.serviceURL = UI.constants.LocalServer;
        } else {
            Qwiery.serviceURL = UI.constants.RemoteServer;
        }

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
        } else if(Qwiery.isDefined(UI.ticket.twitter) && Qwiery.isDefined(UI.ticket.twitter.thumbnail)) {
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
        return Qwiery.isDefined(UI.ticket) && UI.ticket.apiKey !== "Anonymous";
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
                url:  "/files/upload",
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
                url:  "/files/upload",
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
                    components.push(<SimpleContentComponent content={UI.parseMap(pod.Content)}/>);
                    break;
                case UI.constants.SingleEntity:
                    if(Qwiery.isUndefined(pod.Entity)) {
                        UI.showError("This entity does not exist or has been deleted.");
                        continue;
                    }
                    components.push(<SingleEntityComponent key={Qwiery.randomId()} entity={pod.Entity}/>);
                    break;
                case  UI.constants.MultiEntitycase :
                    components.push(<MultiEntityComponent {...pod} />);
                    break;
                case   UI.constants.Error:
                    UI.showError(pod.Error);
                    continue;
                    break;
                case   UI.constants.CurrentAgenda:
                    components.push(<AgendaComponent {...pod}/>);
                    break;
                case   UI.constants.Files:
                    components.push(<FilesComponent {...pod}/>);
                    break;
                case   UI.constants.Images:
                    components.push(<ImagesComponent {...pod}/>);
                    break;
                case   UI.constants.Script:
                    components.push(<ScriptComponent {...pod}/>);
                    break;
                case   UI.constants.GraphContainer:
                    components.push(<GraphContainerComponent {...pod} />);
                    break;
                case   UI.constants.Tasks:
                    components.push(<TasksComponent {...pod}/>);
                    break;
                case   UI.constants.Weather:
                    components.push(<WeatherComponent {...pod}/>);
                    break;
                case   UI.constants.Favorites:
                    components.push(<FavoritesComponent {...pod}/>);
                    break;
                case   UI.constants.Thoughts:
                    components.push(<ThoughtsComponent {...pod}/>);
                    break;
                case   UI.constants.TagEntities:
                    components.push(<TagEntitiesComponent tag={pod.Tag} {...pod}/>);
                    break;
                case   UI.constants.Entities:
                    components.push(<EntitiesComponent {...pod}/>);
                    break;
                case   UI.constants.Item:
                    components.push(<ItemComponent {...pod}/>);
                    break;
                case   UI.constants.WikipediaItem:
                    components.push(<WikipediaItemComponent {...pod}/>);
                    break;
                case   UI.constants.GraphItem:
                    components.push(<GraphItemComponent {...pod}/>);
                    break;
                case   UI.constants.Addresses:
                    components.push(<AddressesComponent  {...pod}/>);
                    break;
                case   UI.constants.BingItem:
                    components.push(<BingItemComponent  {...pod}/>);
                    break;
                case   UI.constants.Tags:
                    components.push(<TagsComponent  {...pod}/>);
                    break;
                case   UI.constants.People:
                    components.push(<PeopleComponent {...pod}/>);
                    break;
                case   UI.constants.History:
                    components.push(<HistoryComponent {...pod}/>);
                    break;
                case   UI.constants.PersonalityOverview:
                    components.push(<PersonalityOverviewComponent {...pod}/>);
                    break;
                case   UI.constants.Wikipedia:
                    components.push(<WikipediaComponent {...pod}/>);
                    break;
                case   UI.constants.EditEntity:
                    components.push(<SingleEntityComponent key={Qwiery.randomId()} mode=" edit" entity={pod}/>);
                    break;
                case   UI.constants.WolframAlpha:
                    components.push(<WolframAlphaComponent {...pod}/>);
                    break;
                case   UI.constants.Bing:
                    components.push(<BingComponent {...pod}/>);
                    break;
                case   UI.constants.Workspaces:
                    components.push(<WorkspacesComponent {...pod}/>);
                    break;
                case   UI.constants.GraphSearch:
                    components.push(<GraphSearchComponent {...pod}/>);
                    break;
                case   UI.constants.Profile:
                    components.push(<ProfileComponent {...pod}/>);
                    break;
                case   UI.constants.Login:
                    components.push(<LoginComponent email={pod.email}/>);
                    break;
                case   UI.constants.Html:
                    components.push(<HtmlComponent {...pod}/>);
                    break;
                case   UI.constants.Iframe:
                    components.push(<IframeComponent {...pod}/>);
                    break;
                case   UI.constants.Service:
                    components.push(<ServiceComponent {...pod}/>);
                    break;
                case   UI.constants.DataViz:
                    components.push(<DataVizComponent {...pod}/>);
                    break;
                case   UI.constants.Video:
                    components.push(<VideoComponent {...pod}/>);
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
    },

    logout:function(){
        Cookies.remove(UI.constants.CookieName);
        hello.logout();
        Qwiery.apiKey = "Anonymous";
        UI.ticket = null;
        UI.removeAvatar();
        UI.refreshPods();
        UI.showSuccess("You have been logged off.");
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
