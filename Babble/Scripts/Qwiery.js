/*
 * Qwiery JS SDK, v2016.9.19, Monday September 19th, 2016.
 * http://www.qwiery.com
 * Copyright 2016, Qwiery by Orbifold Consulting (http://www.orbifold.net)
 * */
var Qwiery = {
    /*
     Set the API key to access your workspaces and data.
     */
    apiKey: "Anonymous",
    /**
     * The URL of the Qwiery web API.
     */
    serviceURL: "http://localhost:4785",

    /***
     * The global timeout for ajax requests.
     */
    timeout: 20000,

    //<editor-fold desc="Graph">
    /**
     * Updates the given entity.
     * @param {JSON} data An entity in JSON format.
     * @returns {}
     */
    upsertEntity: function(obj) {
        var data;
        if(obj.entity) {
            data = obj;
        } else {
            data = {"entity": obj};
        }
        return $.ajax({
            url: Qwiery.serviceURL + '/graph/entity/upsert/',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "POST",
            data: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'},
            timeout: Qwiery.timeout
        });
    },

    /**
     * Upserts the given entities.
     * @param {JSON} data A entity arrayin JSON format.
     * @returns {}
     */
    upsertEntities: function(obj) {
        var data;
        if(obj.entities) {
            data = obj;
        } else {
            data = {"entities": obj};
        }
        return $.ajax({
            url: Qwiery.serviceURL + '/graph/entity/upsertMany/',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "POST",
            data: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'},
            timeout: Qwiery.timeout
        });
    },

    /**
     * Returns the entity with the given id.
     * @param {Guid} id An identifier.
     * @returns {}
     */
    getEntity: function(id) {
        return $.ajax({
            url: Qwiery.serviceURL + '/graph/entity/get/' + id,
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET",
            timeout: Qwiery.timeout
        });
    },

    /**
     * Returns the entities with the given ids.
     * @param {Array} ids An array of identifiers.
     * @returns {}
     */
    getEntities: function(obj) {
        var data;
        if(obj.ids) {
            data = obj;
        } else {
            data = {"ids": obj};
        }
        return $.ajax({
            url: Qwiery.serviceURL + '/graph/entity/getMany/',
            data: JSON.stringify(data),
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "POST",
            timeout: Qwiery.timeout
        });
    },

    /**
     * Deletes the entity with the given id.
     * @param {Guid} id An identifier.
     * @returns {bool} True if the entity was deleted.
     */
    deleteEntity: function(id) {
        return $.ajax({
            url: Qwiery.serviceURL + '/graph/entity/delete/',
            data: {id: id},
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET",
            timeout: Qwiery.timeout
        });
    },

    /**
     * Connects the entities with the given identifiers.
     * @param {Guid} fromId Source id.
     * @param {Guid} toId Target id.
     * @param {String} title A semantic label for the link.
     * @returns {Guid} The id of the created link.
     */
    linkEntities: function(fromId, toId, title) {
        return $.ajax({
            url: Qwiery.serviceURL + '/graph/link/',
            data: {fromId: fromId, toId: toId, title: title || ''},
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET",
            timeout: Qwiery.timeout
        });
    },

    /***
     * An alias for linkEntities.
     * @param {Guid} fromId Source id.
     * @param {Guid} toId Target id.
     * @param {String} title A semantic label for the link.
     * @returns {Guid} The id of the created link.
     */
    connect: function(fromId, toId, title) {
        return Qwiery.linkEntities(fromId, toId, title);
    },

    /**
     * Disconnects the entities with the given identifiers.
     * @param {Guid} fromId Source id.
     * @param {Guid} toId Target id.
     */
    unlinkEntities: function(fromId, toId, title) {
        return $.ajax({
            url: Qwiery.serviceURL + '/graph/unlink/',
            data: {fromId: fromId, toId: toId, title: title},
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET",
            timeout: Qwiery.timeout
        });
    },

    /***
     * An alias for unlinkEntities.
     * @param fromId
     * @param toId
     * @returns {*}
     */
    disconnect: function(fromId, toId) {
        return Qwiery.unlinkEntities(fromId, toId);
    },

    /**
     * Returns the related nodes to the given one.
     * @param {Guid} id An identifier.
     * @returns {}
     */
    getRelated: function(id) {
        return $.ajax({
            url: Qwiery.serviceURL + '/graph/entity/related/',
            data: {id: id},
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET",
            timeout: Qwiery.timeout
        });
    },

    /**
     * Returns some recently created entities.
     * @returns {}
     */
    getRecentEntities: function() {
        return $.ajax({
            url: Qwiery.serviceURL + '/graph/entities/recent',
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET",
            timeout: Qwiery.timeout
        });
    },

    /**
     * Returns the tags of an entity.
     * @returns {}
     */
    getEntityTags: function(id) {
        return $.ajax({
            url: Qwiery.serviceURL + '/graph/entity/tags/' + id,
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET",
            timeout: Qwiery.timeout
        });
    },
    //</editor-fold>

    //<editor-fold desc="Search">
    /**
     * Searches the web for the given term.
     * @param {String} term A search term.
     * @returns {}
     */
    searchWeb: function(term, source, count) {
        return $.ajax({
            url: Qwiery.serviceURL + '/search/web/',
            data: {term: term, source: source, count: count || 10},
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET",
            timeout: Qwiery.timeout
        });
    },

    /**
     * Searches the user's graph for the given term.
     * @param {String} term A search term.
     * @param {String} type The entity types to constraint the search to.
     * @returns {}
     */
    searchGraph: function(term, type) {
        return $.ajax({
            url: Qwiery.serviceURL + '/search/graph/',
            data: {term: term, type: type},
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET",
            timeout: Qwiery.timeout
        });
    },

    /**
     * Searches Wolfram Alpha for the given term.
     * @param {String} term A search term.
     * @returns {}
     */
    searchAlpha: function(term) {
        return $.ajax({
            url: Qwiery.serviceURL + '/search/alpha/',
            data: {term: term},
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET",
            timeout: Qwiery.timeout
        });
    },

    /**
     * Searches the news for the given term.
     * @param {String} term A search term.
     * @returns {}
     */
    searchNews: function(term) {
        return $.ajax({
            url: Qwiery.serviceURL + '/search/news/',
            data: {term: term},
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET",
            timeout: Qwiery.timeout
        });
    },

    /**
     * Searches Wikipedia for the given term.
     * @param {String} term A search term.
     * @returns {}
     */
    searchWikipedia: function(term) {
        return $.ajax({
            url: Qwiery.serviceURL + '/search/wikipedia/',
            data: {term: term},
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET",
            timeout: Qwiery.timeout
        });
    },

    /**
     * Fetches the Wikipedia page with the given name.
     * @param {String} pageName A page name.
     * @returns {}
     */
    getWikipediaPage: function(pageName) {
        return $.ajax({
            url: Qwiery.serviceURL + '/wikipedia/get/' + pageName,
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET",
            timeout: Qwiery.timeout
        });
    },
    //</editor-fold>

    //<editor-fold desc="Tags">
    /**
     * Return the agenda of the user.
     * @param {String} from The start date of the interval.
     * @param {String} end The end date of the interval.
     * @returns {}
     */
    getAgenda: function(from, to) {
        return $.ajax({
            url: Qwiery.serviceURL + '/tags/agenda/',
            data: {from: from, to: to},
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET",
            timeout: Qwiery.timeout
        });
    },

    /**
     * Return the tasks of the user.
     * @param {String} from The start date of the interval.
     * @param {String} end The end date of the interval.
     * @returns {}
     */
    getTasks: function(from, to) {
        return $.ajax({
            url: Qwiery.serviceURL + '/tags/tasks/',
            data: {from: from, to: to},
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET",
            timeout: Qwiery.timeout
        });
    },

    /**
     * Return the addresses of the user.
     * @returns {}
     */
    getAddresses: function() {
        return $.ajax({
            url: Qwiery.serviceURL + '/tags/addresses/',
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET",
            timeout: Qwiery.timeout
        });
    },

    /**
     * Return the people of the user.
     * @returns {}
     */
    getPeople: function() {
        return $.ajax({
            url: Qwiery.serviceURL + '/tags/people/',
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET",
            timeout: Qwiery.timeout
        });
    },

    /**
     * Return the thoughts of the user.
     * @returns {}
     */
    getThoughts: function() {
        return $.ajax({
            url: Qwiery.serviceURL + '/tags/thoughts/',
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET",
            timeout: Qwiery.timeout
        });
    },

    /**
     * Return the entities of the given tag.
     * @returns {}
     */
    getTagEntities: function(tag) {
        return $.ajax({
            url: Qwiery.serviceURL + '/tag/entities/' + tag,
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET",
            timeout: Qwiery.timeout
        });
    },

    /**
     * Return the tags of the user.
     * @returns {}
     */
    getTags: function() {
        return $.ajax({
            url: Qwiery.serviceURL + '/tags/all',
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET",
            timeout: Qwiery.timeout
        });
    },

    /**
     * Makes the given id a favorite.
     * @returns {}
     */
    makeFavorite: function(id) {
        return $.ajax({
            url: Qwiery.serviceURL + '/tags/favorites/add/' + id,
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET",
            timeout: Qwiery.timeout
        });
    },

    /**
     * Removes the given id from the favorites.
     * @returns {}
     */
    unFavorite: function(id) {
        return $.ajax({
            url: Qwiery.serviceURL + '/tags/favorites/remove/' + id,
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET",
            timeout: Qwiery.timeout
        });
    },

    /**
     * Returns the favorites.
     * @returns {}
     */
    getFavorites: function() {
        return $.ajax({
            url: Qwiery.serviceURL + '/tags/favorites/all',
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET",
            timeout: Qwiery.timeout
        });
    },

    /**
     * Returns whether the given id is a favorite.
     * @returns {}
     */
    isFavorite: function(id) {
        return $.ajax({
            url: Qwiery.serviceURL + '/tags/favorites/contains/' + id,
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET",
            timeout: Qwiery.timeout
        });
    },

    /**
     * Tag an entity with the given tag.
     * @returns {}
     */
    tagEntity: function(id, tagName) {
        return $.ajax({
            url: Qwiery.serviceURL + '/tag/entity/' + id + "/" + tagName,
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET",
            timeout: Qwiery.timeout
        });
    },

    /**
     * Untag an entity with the given tag.
     * @returns {}
     */
    untagEntity: function(entityId, tagName) {
        return $.ajax({
            url: Qwiery.serviceURL + '/untag/entity/' + entityId + "/" + tagName,
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET",
            timeout: Qwiery.timeout
        });
    },


    //</editor-fold>

    //<editor-fold desc="Profile">
    /**
     * Return the topics of the user.
     * @returns {}
     */
    getTopics: function() {
        return $.ajax({
            url: Qwiery.serviceURL + '/profile/topics/',
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET",
            timeout: Qwiery.timeout
        });
    },

    /**
     * Return the personalization of the user.
     * @returns {}
     */
    getPersonalization: function() {
        return $.ajax({
            url: Qwiery.serviceURL + '/profile/personalization/get',
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET",
            timeout: Qwiery.timeout
        });
    },

    /**
     * Clears all the personalization data of the user.
     * @returns {}
     */
    clearAllPersonalization: function() {
        return $.ajax({
            url: Qwiery.serviceURL + '/profile/personalization/clearAll',
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET",
            timeout: Qwiery.timeout
        });
    },

    /**
     * Clears a specific key of the personalization of the user.
     * @returns {}
     */
    clearPersonalization: function(key) {
        return $.ajax({
            url: Qwiery.serviceURL + '/profile/personalization/clear/' + key,
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET",
            timeout: Qwiery.timeout
        });
    },

    /**
     * Return the psychological profile of the user.
     * @returns {}
     */
    getPsy: function() {
        return $.ajax({
            url: Qwiery.serviceURL + '/profile/psy/',
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET",
            timeout: Qwiery.timeout
        });
    },

    /***
     * Returns the default personality names.
     * @returns {*}
     */
    getPersonalities: function() {
        return $.ajax({
            url: Qwiery.serviceURL + '/profile/personalities/',
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET",
            timeout: Qwiery.timeout
        });
    },

    /**
     * Return the personality profile of the user.
     * @returns {}
     */
    getPersonality: function() {
        return $.ajax({
            url: Qwiery.serviceURL + '/profile/personality/',
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET",
            timeout: Qwiery.timeout
        });
    },

    /**
     * Return the trail of the user.
     * @returns {}
     */
    getTrail: function() {
        return $.ajax({
            url: Qwiery.serviceURL + '/profile/trail/',
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET",
            timeout: Qwiery.timeout
        });
    },

    /**
     * Return the name and picture of the user.
     * @returns {}
     */
    getUser: function() {
        return $.ajax({
            url: Qwiery.serviceURL + '/profile/user/',
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET",
            timeout: Qwiery.timeout
        });
    },

    /**
     * Return the stats of the user.
     * @returns {}
     */
    getStats: function() {
        return $.ajax({
            url: Qwiery.serviceURL + '/profile/stats/',
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET",
            timeout: Qwiery.timeout
        });
    },

    /**
     * Return the workspaces of the user.
     * @returns {}
     */
    getSpaces: function() {
        return $.ajax({
            url: Qwiery.serviceURL + '/profile/spaces/',
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET",
            timeout: Qwiery.timeout
        });
    },

    /**
     * Return the history of the user.
     * @returns {}
     */
    getHistory: function(count) {
        if(Qwiery.isUndefined(count)) {
            count = 500;
        }
        return $.ajax({
            url: Qwiery.serviceURL + '/profile/history/' + count,
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET",
            timeout: Qwiery.timeout
        });
    },

    /**
     * Return a history item of the user.
     * @returns {}
     */
    getHistoryItem: function(id) {
        return $.ajax({
            url: Qwiery.serviceURL + '/profile/history/get/' + id,
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET",
            timeout: Qwiery.timeout
        });
    },

    /**
     * Return how many times a language service was used.
     * @returns {}
     */
    getLanguageUsageCount: function(id) {
        return $.ajax({
            url: Qwiery.serviceURL + '/profile/languageusage/',
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET",
            timeout: Qwiery.timeout
        });
    },
    /**
     * Return how many times the user posted a question.
     * @returns {}
     */
    getQuestionUsageCount: function(id) {
        return $.ajax({
            url: Qwiery.serviceURL + '/profile/questionusage/',
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET",
            timeout: Qwiery.timeout
        });
    },
    //</editor-fold>

    //<editor-fold desc="Lexic">

    /**
     * Asks Qwiery a question.
     * @returns {}
     */
    ask: function(question) {
        if(!Qwiery.isObjectLiteral(question)) {
            question = {question: question};
        }

        return $.ajax({
            url: Qwiery.serviceURL + '/lexic/question/',
            data: JSON.stringify(question),
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
                // use @Qwiery or @Timy etc.
                // xhr.setRequestHeader("BotId", botId);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "POST",
            timeout: Qwiery.timeout
        });
    },

    /**
     * Upserts the lexic records.
     * @param newRecord The record to upsert.
     * @returns {JQueryXHR}
     */
    lexicUpsert: function(newRecord) {
        return $.ajax({
            url: Qwiery.serviceURL + '/lexic/upsert/',
            data: JSON.stringify(newRecord),
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "POST",
            timeout: Qwiery.timeout,
            global: false
        })
    },

    /**
     * Deletes a lexic record.
     * @param id An identifier.
     * @returns {JQueryXHR}
     */
    lexicDelete: function(id) {
        return $.ajax({
            url: Qwiery.serviceURL + '/lexic/delete/' + id,
            type: 'GET',
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            timeout: Qwiery.timeout
        })
    },

    /**
     * Returns a random lexic record.
     * @returns {JQueryXHR}
     */
    lexicRandomRecord: function() {
        return $.ajax({
            url: Qwiery.serviceURL + '/lexic/randomRecord/',
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET",
            timeout: Qwiery.timeout
        })
    },

    /**
     * Returns a random lexic question.
     * @returns {JQueryXHR}
     */
    lexicRandomQuestion: function() {
        return $.ajax({
            url: Qwiery.serviceURL + '/lexic/randomQuestion/',
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET",
            timeout: Qwiery.timeout
        })
    },

    /***
     * Returns whether the given question exists in the lexic store.
     * @param question
     * @returns {*}
     */
    lexicExists: function(question) {
        return $.ajax({
            url: Qwiery.serviceURL + '/lexic/exists/',
            data: {question: question},
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET",
            timeout: Qwiery.timeout
        })
    },

    lexicDefault: function() {
        return $.ajax({
            url: Qwiery.serviceURL + '/lexic/defaults/',
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET",
            timeout: Qwiery.timeout
        })
    },

    lexicGet: function(id) {
        return $.ajax({
            url: Qwiery.serviceURL + '/lexic/get/' + id,
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET",
            timeout: Qwiery.timeout
        })
    },

    /***
     * Returns whether the given template is valid.
     * @param template
     * @returns {*}
     */
    lexicValidate: function(qtl) {
        return $.ajax({
            url: Qwiery.serviceURL + '/lexic/validate/',
            data: JSON.stringify(qtl),
            dataType: 'json',
            contentType: 'application/json;charset=utf-8',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "POST",
            timeout: Qwiery.timeout,
            global: false
        })
    },
    //</editor-fold>

    //<editor-fold desc="Identity">
    connectLocal: function(email, password) {
        if(Qwiery.hasNotContent(email)) {
            throw "No Email specified.";
        }
        if(Qwiery.hasNotContent(password)) {
            throw "No Password specified.";
        }
        return $.ajax({
            url: Qwiery.serviceURL + "/authentication/connectLocal/",
            type: "GET",
            data: {
                email: email,
                password: password
            },
            dataType: 'json',
            contentType: 'application/json;charset=utf-8',
            timeout: Qwiery.timeout
        });
    },
    registerLocal: function(email, password, currentUser) {
        return $.ajax({
            url: Qwiery.serviceURL + "/authentication/registerLocal/",
            type: "POST",
            data: JSON.stringify({
                email: email,
                password: password,
                user: currentUser // if not null then the local account is merged with the social account(s)
            }),
            dataType: 'json',
            contentType: 'application/json;charset=utf-8',
            timeout: Qwiery.timeout
        });
    },
    connectFacebook: function(facebookObject, currentUser) {
        return $.ajax({
            url: Qwiery.serviceURL + "/authentication/connectFacebook",
            type: "POST",
            data: JSON.stringify({
                facebookObject: facebookObject,
                currentUser: currentUser
            }),
            dataType: 'json',
            contentType: 'application/json;charset=utf-8',
            timeout: Qwiery.timeout
        });
    },
    connectGoogle: function(googleObject, currentUser) {
        return $.ajax({
            url: Qwiery.serviceURL + "/authentication/connectGoogle",
            type: "POST",
            data: JSON.stringify({
                googleObject: googleObject,
                currentUser: currentUser
            }),
            dataType: 'json',
            contentType: 'application/json;charset=utf-8',
            timeout: Qwiery.timeout
        });
    },
    connectTwitter: function(twitterObject, currentUser) {
        return $.ajax({
            url: Qwiery.serviceURL + "/authentication/connectTwitter",
            type: "POST",
            data: JSON.stringify({
                twitterObject: twitterObject,
                currentUser: currentUser
            }),
            dataType: 'json',
            contentType: 'application/json;charset=utf-8',
            timeout: Qwiery.timeout
        });
    },
    changeUsername: function(newName) {
        return $.ajax({
            url: Qwiery.serviceURL + "/authentication/changeUsername/" + newName,
            type: "GET",
            dataType: 'json',
            contentType: 'application/json;charset=utf-8',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            timeout: Qwiery.timeout
        });
    },
    getTicket: function(newName) {
        return $.ajax({
            url: Qwiery.serviceURL + "/profile/identity/",
            type: "GET",
            dataType: 'json',
            contentType: 'application/json;charset=utf-8',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            timeout: Qwiery.timeout
        });
    },
    //</editor-fold>

    //<editor-fold desc="Files">
    /**
     * Return the files of the user.
     * @returns {}
     */
    getFiles: function() {
        return $.ajax({
            url: Qwiery.serviceURL + '/files/all/',
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET",
            timeout: Qwiery.timeout
        });
    },

    /**
     * Return all the images of the user.
     * @returns {}
     */
    getImages: function() {
        return $.ajax({
            url: Qwiery.serviceURL + '/files/images/',
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET",
            timeout: Qwiery.timeout
        });
    },

    /**
     * Return all the documents of the user.
     * @returns {}
     */
    getDocuments: function() {
        return $.ajax({
            url: Qwiery.serviceURL + '/files/documents/',
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET",
            timeout: Qwiery.timeout
        });
    },

    /**
     * Returns a random image attached to the given entity, if any.
     * @returns {}
     */
    getEntityRandomImage: function(id) {
        return $.ajax({
            url: Qwiery.serviceURL + '/files/images/entity/random/' + id,
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET",
            timeout: Qwiery.timeout
        });
    },

    /**
     * Return a random image attached to the given entity.
     * @param id An entity identifier.
     * @returns {}
     */
    getEntityAllImages: function(id) {
        return $.ajax({
            url: Qwiery.serviceURL + '/files/images/entity/all/' + id,
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET",
            timeout: Qwiery.timeout
        });
    },
    //</editor-fold>

    //<editor-fold desc="Utilities">
    /**
     * Returns a random identifier which can be used as an ID of objects, eventually augmented with a prefix.
     * @returns {string}
     */
    randomId: function(length) {
        if(length === undefined) {
            length = 10;
        }
        // old version return Math.floor((1 + Math.random()) * 0x1000000).toString(16).substring(1);
        var result = "";
        var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for(var i = length; i > 0; --i) {
            result += chars.charAt(Math.round(Math.random() * (chars.length - 1)));
        }
        return result;
    },

    /**
     Returns a random guid.
     */
    guid: function() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + "-" + s4() + "-" + s4() + "-" +
            s4() + "-" + s4() + s4() + s4();
    },

    /**
     * Returns true if the given object is not undefined and not null.
     * @param obj Any object.
     * @returns {boolean}
     */
    isDefined: function(obj) {
        return obj !== undefined && obj !== null;
    },

    /**
     * Returns true if the given object is undefined or null.
     * @param obj Any object.
     * @returns {boolean}
     */
    isUndefined: function(obj) {
        return !Qwiery.isDefined(obj);
    },

    /***
     * Returns true if the given object is undefined, null or an empty string.
     * @param obj
     * @returns {*|boolean}
     */
    hasNotContent: function(obj) {
        return Qwiery.isUndefined(obj) || obj.toString().trim().length === 0;
    },

    /**
     * Returns true if the given object is a string.
     * @param obj Any object.
     * @returns {boolean}
     */
    isString: function(obj) {
        return (typeof obj == 'string' || obj instanceof String);
    },

    /**
     * Return true if the given object is a literal object.
     * @param obj Any object.
     * @returns {boolean}
     */
    isObjectLiteral: function(obj) {
        var _test = obj;
        return (typeof obj !== 'object' || obj === null ?
            false :
            ((function() {
                while(!false) {
                    if(Object.getPrototypeOf(_test = Object.getPrototypeOf(_test)) === null) {
                        break;
                    }
                }
                return Object.getPrototypeOf(obj) === _test;
            })()));
    },

    /**
     * Returns the text contained in the given HTML element.
     * @param content
     * @returns {string|JQuery|jQuery}
     */
    htmlDecode: function(content) {
        return $('<div/>').html(content).text();
    },

    formatErrorMessage: function(jqXHR, exception) {

        if(jqXHR.type === "ajaxError") {
            return "Ajax Error";
            debug;
        }
        if(exception === 'timeout') {
            return ('Qwiery has not replied within the timeout margin. Probably a lot of buzz going on, sorry.');
        } else if(exception === 'abort') {
            return ('Ajax request aborted.');
        } else if(jqXHR.status === 0) {
            return ('Not connected.\nPlease verify your network connection.');
        } else if(jqXHR.status == 404) {
            return ("Ouch! Qwiery is not responding, probably offline right now. There is no response for some reason.");
        } else if(jqXHR.status == 401) {
            return (JSON.parse(jqXHR.responseText));
        } else if(jqXHR.status == 500) {
            return ('That\'s pretty bad; ' + exception);
        } else if(exception === 'parsererror') {
            return ('Requested JSON parse failed.');
        } else {
            return (JSON.parse(jqXHR.responseText));
        }
    },

//</editor-fold>

    //</editor//<editor-fold desc="Admin">
    /**
     * Returns all Qwiery users. You need admin priviledges to use this.
     * @returns {}
     */
    getAllUsers: function() {
        return $.ajax({
            url: Qwiery.serviceURL + '/admin/users/all/',
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET"
        });
    },

    /**
     * Returns usage stats.
     * @returns {}
     */
    globalUsage: function() {
        return $.ajax({
            url: Qwiery.serviceURL + '/admin/globalUsage/',
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET"
        });
    },

    /**
     * Deletes a user. You need admin privileges to use this.
     * @returns {}
     */
    deleteUser: function(id) {
        return $.ajax({
            url: Qwiery.serviceURL + '/admin/users/delete/' + id,
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET"
        });
    },

    /**
     * Fetches the currently used topics.
     * @returns {}
     */
    getStandardTopics: function() {
        return $.ajax({
            url: Qwiery.serviceURL + '/admin/topics/standard/all',
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET"
        });
    },

    /**
     * Gets the categories the QTLs are divided into.
     * @returns {}
     */
    getCategories: function() {
        return $.ajax({
            url: Qwiery.serviceURL + '/admin/categories',
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET"
        });
    },
    //</editor-fold>

    /***
     * Send feedback to Qwiery.
     * @param feedbackBlob
     * @returns {*}
     */
    feedback: function(feedbackBlob) {
        return $.ajax({
            url: Qwiery.serviceURL + '/feedback/',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "POST",
            data: JSON.stringify(feedbackBlob),
            headers: {'Content-Type': 'application/json'},
            timeout: Qwiery.timeout
        });
    },

    // <editor-fold desc="Language">
    getSentiment: function(text) {
        return $.ajax({
            url: Qwiery.serviceURL + '/language/sentiment/',
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "POST",
            data: JSON.stringify({text: text}),
            timeout: Qwiery.timeout
        });
    },
    getKeywords: function(text) {
        return $.ajax({
            url: Qwiery.serviceURL + '/language/keywords/',
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "POST",
            data: JSON.stringify({text: text}),
            timeout: Qwiery.timeout
        });
    },
    detectLanguage: function(text) {
        return $.ajax({
            url: Qwiery.serviceURL + '/language/detect/',
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "POST",
            data: JSON.stringify({text: text}),
            timeout: Qwiery.timeout
        });
    },
    getPOS: function(text) {
        return $.ajax({
            url: Qwiery.serviceURL + '/language/pos/',
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "POST",
            data: JSON.stringify({text: text}),
            timeout: Qwiery.timeout
        });
    },
    // </editor-fold>

    // <editor-fold desc="Data">
    getKafka: function() {
        return $.ajax({
            url: Qwiery.serviceURL + '/data/kafka',
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET",
            timeout: Qwiery.timeout
        });
    },
    // </editor-fold>

    // <editor-fold desc="Apps">
    isValidAppName: function(appname) {
        if(Qwiery.isUndefined(appname)) {
            throw new Error("No parameter supplied.");
        }
        if(!/^[a-zA-Z\d]{5,100}$/gi.test(appname)) {
            throw new Error("The service name should contain only numbers and letter. No spaces, punctuation or underscore. The name should also be at least five characters.")
        }
        return $.ajax({
            url: Qwiery.serviceURL + '/apps/isValidAppName/' + appname,
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET",
            timeout: Qwiery.timeout
        });
    },
    /***
     * Adds a new service to Qwiery.
     * @param appConfig The service configuration.
     * @returns {*}
     */
    addApp: function(obj) {
        /*
         * {
         *   appConfig:{
         *       config: {}
         *       oracle: {}
         *   }
         * }
         * */
        var appConfig;
        if(obj.appConfig) {
            appConfig = obj;
        } else {
            appConfig = {appConfig: obj}
        }
        return $.ajax({
            url: Qwiery.serviceURL + '/apps/addApp/',
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "POST",
            data: JSON.stringify(appConfig),
            timeout: Qwiery.timeout
        });
    },

    /***
     * Ask a question to a Qwiery service.
     * @param appId The service id.
     * @returns {*}
     */
    askApp: function(appId, question) {
        return $.ajax({
            url: Qwiery.serviceURL + '/apps/ask/' + appId + "/" + question,
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET",
            timeout: Qwiery.timeout
        });
    },

    // </editor-fold>

    test: function() {
        return $.ajax({
            url: Qwiery.serviceURL + '/api/test/',
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", Qwiery.apiKey);
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET",
            timeout: Qwiery.timeout
        });
    }
};
