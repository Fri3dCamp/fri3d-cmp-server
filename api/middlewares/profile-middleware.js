var log4js = require('log4js');

var logger = log4js.getLogger('account_resolver');

module.exports = function(services) {
    return function(req, res, next) {
        if (req.auth) {
            services.account.me(req.auth.sub).then(function(resolvedUser) {
                req.account = resolvedUser;
                next();
            }, function(err) {
                if (err.status === 404) {
                    logger.trace("New user authenticated. Adding him/her to the datastore.");

                    // -- this is a new user, so we will call the new user callback
                    services.account.create(req.auth.sub).then(function(result) {
                        req.account = result;
                        services.gateway.createGateway(req.auth.sub).then(function() {
                            next();
                        });
                    }, function(err) {
                        logger.warn(err);
                        next();
                    });
                } else {
                    logger.warn(err);
                    next();
                }
            });
        } else next();
    };
};