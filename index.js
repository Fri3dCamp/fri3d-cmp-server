/* -- Logging -- */
var log4js = require('log4js');
var LOGGER = log4js.getLogger("server");

/* -- Configuration -- */
var configuration = require('./config');

/* -- Authorization key management -- */
var jwksClient = require('jwks-rsa');
const client = jwksClient({
    strictSsl: true, // Default value
    jwksUri: 'https://' + configuration.auth0.domain + '/.well-known/jwks.json'
});

client.getSigningKey(configuration.auth0.kid, function (err, key) {
    if (err) {
        LOGGER.error(err);
        process.exit(1);
    }

    // -- create the api instance
    var API = require('./api');
    var api = new API(configuration, key.publicKey || key.rsaPublicKey);

    /* -- Middlewares -- */
    // var ProfileMiddleware = require('./middlewares/profile-middleware');
    // api.middleware(ProfileMiddleware.profile(
    //     configuration, storage.store(configuration.elasticsearch.index).entity('people')
    // ));

    /* -- Storage -- */
    var Storage = require('./storage');
    var storage = new Storage(configuration);
    api.storage(storage);

    /* -- Modules -- */
    api.module('settings');

    // -- response enricher
    api.enrich('./enrichers/owner-enricher');

    // -- start listening for requests
    return api.listen();
});