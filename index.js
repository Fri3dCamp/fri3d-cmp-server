/* -- Logging -- */
var log4js = require('log4js');
var LOGGER = log4js.getLogger("server");

/* -- Configuration -- */
var configuration = require('./config');

// -- create the api instance
var API = require('./api');
var api = new API(configuration);

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
api.module('health');
api.module('activity');

// -- start listening for requests
return api.listen();