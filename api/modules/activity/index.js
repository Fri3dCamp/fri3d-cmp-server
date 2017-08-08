var ActivityService = require('./service'),
    ActivityResource = require('./resource');

module.exports.services = function(config, storage, services, AWS)  {
    return {
        activity: new ActivityService(storage, config, AWS)
    };
};

module.exports.resources = function(config, store, services, responseHandler) {
    return {
        activity: new ActivityResource(services.activity, responseHandler)
    };
};

module.exports.run = function(config, api, resources)  {
    var resource = resources.activity;

    api.registerSecureGet('/v1/activities', ['read:activities'], resource.lookup);
    api.registerSecurePost('/v1/activities', ['create:activities'], resource.create);
    api.registerSecureGet('/v1/activities/', ['read:activities'], resource.list);
    api.registerSecureGet('/v1/activities/:activityId', ['read:activities'], resource.get);
    api.registerSecurePut('/v1/activities/:activityId', ['update:activities'], resource.update);
    api.registerSecureDelete('/v1/activities/:activityId', ['delete:activities'], resource.remove);
};