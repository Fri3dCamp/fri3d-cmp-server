var log = require('winston');
var JWT = require('jsonwebtoken');

/**
 * A middleware to store new profiles into ES as they come in.
 *
 * @param config
 * @param profileStorage
 * @returns {Function}
 */
module.exports.profile = function(config, profileStorage) {
    var secret = new Buffer(config.auth0.clientSecret, 'base64');

    return function(req, res, next) {
        var headerToken = req.header('Authorization');
        if (!headerToken) return next();

        var split = headerToken.split(' ');
        if (split[0] !== 'Bearer') return next();

        // -- extract the JWT from the header token
        try {
            var user = JWT.verify(split[1], secret);
            if (!user) return next();

            // -- check if the user is already in the store
            profileStorage
                .exists(user.sub)
                .then(function (exists) {
                    if (exists) return null;

                    log.log('info', 'Storing user "' + user.sub + '" in the data store');

                    return profileStorage.add({
                        id: user.sub,
                        short_id: user.short_id,
                        name: user.name,
                        email: user.email
                    }, user.sub);

                })
                .then(function () {
                    req.user = user;
                    return next();
                })
                .fail(function () {
                    return next();
                });
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return next();
            }

            throw err;
        }
    };
};