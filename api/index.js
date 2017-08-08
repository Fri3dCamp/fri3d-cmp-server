/* -- Logging -- */
var log4js = require('log4js');
log4js.configure({
  appenders: { 'out': { type: 'stdout' } },
  categories: { default: { appenders: ['out'], level: 'debug' } }
});


var LOGGER = log4js.getLogger("server");

process.on('SIGINT', function() {
	console.log("shutdown...");
	LOGGER.info("shutting down due to sigint...");
	process.exit(0);
});

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
