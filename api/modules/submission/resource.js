function SubmissionResource(service, responseHandler) {
    this.service = service;
    this.responseHandler = responseHandler;
}

SubmissionResource.prototype.get = function(req, res) {
    return this.responseHandler.handle(req, res, this.service.getSubmission(req.params['submission_id']));
};

SubmissionResource.prototype.set = function(req, res) {
    return this.responseHandler.handle(req, res, this.service.setSubmission(req.body));
};

SubmissionResource.prototype.listComments = function(req, res) {
    return this.responseHandler.handle(req, res, this.service.listComments(req.params['submission_id'], req.query['offset'], req.query['from_ts']));
};

module.exports = SubmissionResource;
