var CommentsService = require('./service'),
    CommentsResource = require('./resource');

module.exports.services = function(config, storage, services, AWS)  {
    return {
        comments: new CommentsService(storage, config, AWS)
    };
};

module.exports.resources = function(config, store, services, responseHandler) {
    return {
        comments: new CommentsResource(services.comments, responseHandler)
    };
};

module.exports.run = function(config, api, resources)  {
    var resource = resources.comments;

    api.registerGet('/v1/comments', function(req, res) { return resource.list(req, res) });
    api.registerPost('/v1/comments', function(req, res) { return resource.create(req, res); });
    api.registerPut('/v1/comments/:comment_id', function(req, res) { return resource.update(req, res); });
    api.registerDelete('/v1/comments/:comment_id', function(req, res) { return resource.remove(req, res); });
};