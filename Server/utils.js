var _ = require('lodash');
var request = require("request");

module.exports = {

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

    /***
     * This will perform a DFT to replace the Choice keys with
     * concrete choices.
     * @param obj
     * @returns {*}
     */
    makeChoices: function(obj) {
        var that = this;
        _.forOwn(obj, function(value, key) {
            if(key === "Choice") {
                var choicer = value;
                if(choicer) {
                    if(!_.isArray(choicer)) {
                        throw "The QTL is not valid. The Choice should be an Array."
                    }
                    // depth-first traversal
                    for(var k = 0; k < choicer.length; k++) {
                        var item = choicer[k];
                        if(_.isArray(item)) {
                            throw "The QTL is not valid. Unexpected array inside a Choice array.";
                        }
                        if(_.isObject(item)) {
                            choicer[k] = utils.makeChoices(item);
                        }
                    }
                    // this replace the obj with something concrete
                    obj = _.sample(choicer);

                } else {
                    throw "The QTL is not valid. The value of the Choice is not defined.";
                }
            }
            else if(_.isObject(value)) {
                obj[key] = utils.makeChoices(value);
            }
            else if(_.isArray(value)) {
                for(var k = 0; k < value.length; k++) {
                    var item = value[k];
                    value[k] = utils.makeChoices(item);
                }
            }
        });

        return obj;
    },

    stringFormat: function(format /* arg1, arg2... */) {
        if(arguments.length === 0) {
            return undefined;
        }
        if(arguments.length === 1) {
            return format;
        }
        var args = Array.prototype.slice.call(arguments, 1);
        return format.replace(/\{\{|\}\}|\{(\d+)\}/g, function(m, n) {
            if(m === "{{") {
                return "{";
            }
            if(m === "}}") {
                return "}";
            }
            return args[n];
        });
    },

    stripPassword: function(newUser) {
        return {
            apiKey: newUser.apiKey,
            local: newUser.local ? {email: newUser.local.email} : null, // don't send the password
            facebook: newUser.facebook,
            google: newUser.google,
            twitter: newUser.twitter,
            id: newUser.id,
            username: newUser.username,
            error: newUser.error,
            role: newUser.role
        }

    },
    /***
     * Returns the property in the json from specified path.
     * @param d
     * @param path
     */
    getJsonPath: function(d, path) {
        if(path === "." || path === "/") {
            return d;
        }
        var res;
        if(this.isDefined(d)) {
            if(this.isDefined(path)) {
                if(path.indexOf('.') > 0) {
                    var split = path.split('.');
                    while(split.length > 0) {
                        d = d[split.shift()];
                    }
                    res = d;
                } else {
                    res = d[path]
                }
            } else {
                res = d;
            }
        } else {
            res = "[?]";
        }
        return res;
    },

    /***
     * Replaces in object d the property path with obj.
     * @param rootObject
     * @param path
     * @param substitude
     */
    deepReplace: function(rootObject, substitude, path) {
        if(path === undefined) {
            path = "/";
        }
        if(path === "." || path === "/") {
            return substitude;
        }
        if(this.isDefined(rootObject)) {
            if(this.isDefined(path)) {
                var walker = rootObject;
                if(path.indexOf('.') > 0) {
                    var split = path.split('.');
                    while(split.length > 1) {
                        walker = walker[split.shift()];
                    }
                    var lastProperty = split.shift();
                    if(walker[lastProperty]) { // if path exists
                        walker[lastProperty] = substitude;
                    }

                } else {
                    rootObject[path] = substitude;
                }
            } else {
                rootObject = substitude;
            }
        } else {
            throw new Error("No object given to replace parts of.");
        }
        return rootObject;
    },

    isNullOrEmpty: function(s) {
        return s === undefined || s === null || s.trim().length === 0;
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
        return !this.isDefined(obj);
    },

    getCommand: function(question) {
        if(question.indexOf(":") <= 0) {
            return [];
        }
        // replace temporarily the '://' things from URLs
        question = question.replace("://", "###");
        var parts = _.map(question.split(/\:/), function(p) {
            return p.trim();
        });
        var parms = parts.splice(-1);
        parts = _.map(parts, function(p) {
            return p.toLowerCase();
        });
        parms = _.map(parms[0].split('/'), function(p) {
            // put back the URLS if needed
            return p.trim().replace("###", "://");
        });

        return {
            Commands: parts,
            Parameters: parms,
            FirstParameter: parms[0]
        }
    },

    /***
     * Simplistic check whether the given input is a URL.
     * @param input
     * @returns {boolean}
     */
    isUrl: function(input) {
        return _.isString(input) && (input.trim().indexOf("http://") === 0 || input.trim().indexOf("https://") === 0);
    },

    /***
     * Returns the stripped content if a URL is given, or the object is just returned.
     * @param obj
     */
    getContent: function(obj) {
        if(this.isUndefined(obj)) {
            return Promise.resolve(null);
        }

        else if(this.isUrl(obj)) {
            return new Promise(function(resolve, reject) {
                var opts = {
                    url: obj,
                    timeout: 10000
                };
                request(opts, function(err, res, body) {
                    if(err) {
                        reject(err);
                    }
                    else {
                        var extractor = require('unfluff');
                        data = extractor(body);

                        var props = ["title", "description", "softTitle"];
                        // picking whatever contains the most content
                        var best = "";
                        _.forEach(props, function(n) {
                            if(data[n] && (data[n].length > best.length)) {
                                best = data[n];
                            }
                        });
                        if(best.length === 0) {
                            resolve(null);

                        } else {
                            resolve(best);
                        }
                    }
                });
            });


        }

        else {
            return Promise.resolve(obj);
        }
    }
};