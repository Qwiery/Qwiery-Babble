var qwiery = require("qwiery");
module.exports = {

    getUserContext: function(req) {
        var apiKey = req.headers.apikey; // note: headers a lowercased even if you set them differently
        return new Promise(function(resolve, reject) {

            if(utils.isDefined(apiKey) && apiKey !== "null") {
                qwiery.getContextFromApiKey(apiKey).then(function(foundKey) {
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
        this.getUserContext(req).then(function(ctx) {
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