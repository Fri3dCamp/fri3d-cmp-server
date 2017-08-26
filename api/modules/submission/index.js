var SubmissionService = require('./service'),
    SubmissionResource = require('./resource');

module.exports.services = function(config, storage, services, AWS)  {
    return {
        submission: new SubmissionService(storage, config, AWS)
    };
};

module.exports.resources = function(config, store, services, responseHandler) {
    return {
        submission: new SubmissionResource(services.submission, responseHandler)
    };
};

module.exports.run = function(config, api, resources)  {
    var resource = resources.submission;

    api.registerGet('/v1/submissions/:submission_id', function(req, res) { return resource.get(req, res) });
    api.registerPost('/v1/submissions', function(req, res) { return resource.set(req, res); });

    api.registerGet('/v1/submissions/:submission_id/comments', function(req, res) { return resource.listComments(req, res) });
};
