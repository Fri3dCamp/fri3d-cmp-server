var ActivityService = require('./service'),
    ActivityResource = require('./resource');

module.exports.services = function(config, storage, services, AWS)  {
    return {
        project: new ProjectService(storage, config, AWS)
    };
};

module.exports.resources = function(config, store, services, responseHandler) {
    return {
        project: new ProjectResource(services.project, responseHandler)
    };
};

module.exports.run = function(config, api, resources)  {
    var resource = resources.project;

    api.registerSecureGet('/v1/activities', api.onlyIfUser(), function(req, res) { return resource.lookup(req, res); });
    api.registerSecurePost('/v1/activities', api.onlyIfUser(), function(req, res) { return resource.create(req, res); });
    api.registerSecureGet('/v1/activities/:namespace', api.onlyIfUser(), function(req, res) { return resource.list(req, res); });
    api.registerSecureGet('/v1/activities/:namespace/:name', api.onlyIfUser(), function(req, res) { return resource.get(req, res); });
    api.registerSecurePut('/v1/activities/:namespace/:name', api.onlyIfUser(), function(req, res) { return resource.update(req, res); });
    api.registerSecureDelete('/v1/activities/:namespace/:name', api.onlyIfUser(), function(req, res) { return resource.remove(req, res); });
};