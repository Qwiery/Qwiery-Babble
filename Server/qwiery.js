/***
 * Contains the gateway to all processing.
 * This is the plac where the session is initialized and global things
 * can be done before the pipeline takes over.
 */
var config = require("./config");
var pipeline = require("./Pipeline/Pipeline"),
    _ = require("lodash"),
    constants = require("./constants"),
    utils = require("./utils");
var analytics = require("./analytics");
var storage = require("./Services/Storage/Storage");

var pe = require('post-entity')
module.exports = {

    // <editor-fold desc="Private">


    /***
     * Initializes this service.
     */
    init: function() {

    },

    reset: function() {
        config.oracle.reset();
        config.graph.reset();
        config.topics.reset();
        config.history.reset();
        config.identity.reset();
        config.workflow.reset();
        config.personality.reset();
        config.personalization.reset();
    },

    // </editor-fold>

    // <editor-fold desc="Processing">

    /***
     * Removes unwanted and harmful things.
     * @param input
     * @returns {*}
     */
    removeUnwantedChars: function(input) {
        // make sure the input is not going to harm us
        var rex = /[^a-z A-Z0-9.,?!:;\/@\$\*-_=\+'#\(\)]/gi;
        return input.replace(rex, "").trim();
    },

    createNewSession: function(question, ctx) {
        if(ctx.botId === undefined) {
            ctx.botId = "default";
        }
        var startTime = new Date();

        var session = {
            ExchangeId: 0,
            BotId: ctx.botId,
            Handled: false,
            Historize: true,
            Input: {
                Raw: question,
                Timestamp: startTime
            },
            Key: {
                CorrelationId: utils.randomId(),
                UserId: ctx.userId
            },
            Output: {},
            Trace: [],
            Context: ctx
        };
        var botIdError = this.validateBotId(ctx.botId);
        if(botIdError !== null) {
            session.Output.Timestamp = new Date();
            session.Output.Answer = [{
                DataType: constants.dataTypes.SimpleContent,
                Content: botIdError
            }];
            return session;
        }
        var configuration = config.apps.getBotConfiguration(ctx.botId);
        if(utils.isUndefined(configuration)) {
            session.Output.Timestamp = new Date();
            session.Output.Answer = [{
                DataType: constants.dataTypes.SimpleContent,
                Content: "The application you tried to contact does not exist."
            }];
            return session;
        }
        session.BotConfiguration = configuration;
        return session;
    },

    validateBotId: function(name) {
        if(utils.isUndefined(name)) {
            return "You specified an empty bot. Use the format 'botId > question'.";
        } else if(!this.alphanumeric(name)) {
            return "A bot name should contain only letter and numbers. Use the format 'botId > question'.";
        }
        return null;
    },

    alphanumeric: function(name) {
        var letters = /^[0-9a-zA-Z]+$/;
        return !!letters.test(name);
    },

    parseForEntities: function(input) {
        var entities = {
            mentions: [],
            hashtags: [],
            cashtags: [],
            links: []
        };
        var parsed = pe.entities(input);
        if(utils.isDefined(parsed) && parsed.length > 0) {
            for(var i = 0; i < parsed.length; i++) {
                var item = parsed[i];
                switch(item.type) {
                    case "link":
                        entities.links.push(item.raw);
                        break;
                    case "hashtag":
                        entities.hashtags.push(item.raw.replace("\#", ""));
                        break;
                    case "cashtag":
                        entities.cashtags.push(item.raw.replace("\\$", ""));
                        break;
                    case "mention":
                        entities.mentions.push(item.raw.replace("@", ""));
                        break;
                }
            }
        }
        return entities;
    },

    /***
     * Where it all starts.
     * Things done here are global across and before the pipeline.
     * @param question
     * @param ctx
     * @param req The original http request if available
     * @returns {*|Promise.<TResult>}
     */
    ask: function(question, ctx, req) {
        var cleanInput = this.removeUnwantedChars(question);
        var entities = this.parseForEntities(cleanInput);
        if(utils.isUndefined(ctx.botId)) {

            if(entities.mentions.length > 0) {
                // check if a botname is mentioned
                var foundBotNames = _.filter(entities.mentions, function(name) {
                    return config.apps.isAppName(name);
                });
                if(foundBotNames.length===0){
                    ctx.botId = "default";
                }
                else{
                    // if there are multiple addressed the first one is taken, one has to make a choice somehow
                    // using it to address the bot
                    ctx.botId = config.apps.getBotIdFromName(foundBotNames[0]);
                    // the problem here is that a question starting like "@Qwiery What is the weather"
                    // needs to be rephrased without the @Qwiery or the oracle will not find the question
                    if(cleanInput.indexOf("@") === 0) {
                        cleanInput = cleanInput.substring(cleanInput.indexOf(" ") + 1);
                    }
                }

            } else {
                ctx.botId = "default";
            }
        }
        // post analytics if available
        if(req) {
            var info = analytics.getBasicInfo(req);
            info.botId = ctx.botId;
            storage.log.addAskUsage(info);
        }

        var session = this.createNewSession(cleanInput, ctx);
        if(utils.isUndefined(session.BotConfiguration)) {
            return Promise.resolve(session);
        }
        // let's give access to everyone to this info
        session.Entities = entities;
        return pipeline.processMessage(session);
    }
    // </editor-fold>
};

