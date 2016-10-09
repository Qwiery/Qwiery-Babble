var qwiery = require("qwiery"),
    request = require("request"),
    utils = require("./utils");
module.exports = {
    getContextFromApiKey: function(apiKey) {
        return new  Promise(function(resolve, reject){
            var serviceURL;
            if(process.env.Platform !== "Azure") {
                serviceURL = "http://localhost:4785";
            } else {
                serviceURL = "http://api.qwiery.com";
            }
            var opt = {
                url: serviceURL + '/authentication/getContextFromApiKey/' + apiKey,
                headers: {
                    "apiKey": this.apiKey
                },
                json: true,
                method: "GET",
                timeout: 10000
            };
            request(opt, function(error, response, body) {
                if(error){
                    reject(error);
                }else{
                    resolve(body);
                }
            });
        });
    },

    getUserContext: function(req) {
        var apiKey = req.headers.apikey; // note: headers a lowercased even if you set them differently
        var that = this;
        return new Promise(function(resolve, reject) {

            if(utils.isDefined(apiKey) && apiKey !== "null") {

                that.getContextFromApiKey(apiKey).then(function(foundKey) {
                    if(utils.isDefined(foundKey)) {
                        resolve(foundKey);
                    }
                    else {
                        reject({"Message": "A user with the specified API key could not be found."});
                    }
                });
            }
            else {
                reject({"Message": "The ApiKey is empty. Login and use the supplied API key to make requests."});
            }
        });
    },

    /***
     * Captures the userId from the apiKey and puts
     * the context (ctx) in the request object.
     * @param req
     * @param res
     * @param next
     */
    ensureApiKey: function(req, res, next) {
        var security = require("./security");
        security.getUserContext(req).then(function(ctx) {
            req.ctx = ctx;
            next();
        }).catch(function(e) {
            res.status(401).send(e);
        });
    },

    ensureAdmin: function(req, res, next) {
        this.getUserContext(req, "Admin").then(function(ctx) {
            req.ctx = ctx;
            next();
        }).catch(function(e) {
            res.status(401).send(e);
        });
    }
}