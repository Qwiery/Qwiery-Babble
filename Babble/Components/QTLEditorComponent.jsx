/***
 * A component editing QTL.
 */
var QTLEditorComponent = React.createClass({
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

        return <div className="templateEditorRoot" id={this.editorId} key={this.editorId} style={display}>
            <div style={{"height":"25px"}}>
                <div id="approvedLight"></div>
                <span id="editCloseIcon" style={{"margin": "-10px 0 0 0"}} className="glyphicon glyphicon-remove editorCloseIcon pull-right" aria-hidden="true"
                      onClick={this.hideEditorTemplate}></span>
            </div>
            <div className="alert alert-success EditorNotification" id="editor-success-alert">
                <button id="editor-successClose" type="button" className="close">x</button>
                <strong>Success! </strong>
                <span id="editor-successMessage"></span>
            </div>
            <div className="alert alert-danger EditorNotification" id="editor-danger-alert">
                <button id="editor-dangerClose" type="button" className="close">x</button>
                <strong>Error! </strong>
                <span id="editor-errorMessage"></span>
            </div>
            <div className="form-group">
                <label className="col-sm-1 control-label">Id:</label>
                <div className="col-sm-11" style={{"height":"35px"}}>
                    <p id="templateId" className="form-control-static"></p>
                </div>
            </div>
            <div className="form-group">
                <label for="templateSentence" className="col-sm-1 control-label">Question: </label>
                <div className="col-sm-11" style={{"minHeight": "35px"}}>
                    <textarea className="form-control  input-sm" id="templateSentence" rows="4" placeholder="The question to catch"/>
                </div>
            </div>
            <div className="form-group">
                <label for="topicsInput" className="col-sm-1 control-label">Topics: </label>
                <div className="col-sm-11" style={{marginTop:10}}>
                    <input type="text" className="form-control  input-sm" id="topicsInput" style={{"width":"350px"}}/>
                </div>
            </div>
            <div className="form-group">
                <div className="col-sm-offset-1 col-sm-11">
                    <div className="btn-group btn-group-sm" style={{"marginTop":"10px"}} role="group" aria-label="Toolbar">
                        <button type="button" className="btn btn-primary" id="updateTemplateButton">Update</button>
                        <button type="button" className="btn btn-success" id="newTemplateButton">New</button>
                        <button type="button" className="btn btn-danger" id="deleteButton">Delete</button>
                        <button type="button" className="btn btn-default" id="validateButton">Validate</button>
                        <button type="button" className="btn btn-default" id="htmlSwitchButton">Switch editor</button>
                        <button type="button" className="btn btn-default" id="randomButton">Random</button>
                    </div>
                    <div className="btn-group btn-group-sm" style={{"marginTop":"10px"}}>
                        <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Personality <span className="caret"></span>
                        </button>
                        <ul id="PersonalitiesList" className="dropdown-menu">

                        </ul>
                    </div>
                    <div className="btn-group btn-group-sm" style={{"marginTop":"10px"}}>
                        <button id="CategoryListButton" type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Category <span className="caret"></span>
                        </button>
                        <ul id="CategoryList" className="dropdown-menu">
                        </ul>
                    </div>
                    <div id="jsonEditorDiv">
                        <div id="jsonEditor"></div>
                    </div>
                    <div id="mdEditorDiv" style={{display: "none"}}>
                        <textarea id="markdownEditorArea" rows="10" cols="60"></textarea>
                    </div>
                </div>
            </div>
        </div>;


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