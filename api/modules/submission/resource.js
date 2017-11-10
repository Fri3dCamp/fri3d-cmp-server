function SubmissionResource(service, responseHandler) {
    this.service = service;
    this.responseHandler = responseHandler;
}

SubmissionResource.prototype.list = function(req, res) {
    return this.responseHandler.handle(req, res, this.service.listSubmissions(req.query['q'], req.query['o'], req.query['s']));
};

SubmissionResource.prototype.get = function(req, res) {
    return this.responseHandler.handle(req, res, this.service.getSubmission(req.params['submission_id']));
};

SubmissionResource.prototype.set = function(req, res) {
    return this.responseHandler.handle(req, res, this.service.setSubmission(req.body));
};

SubmissionResource.prototype.remove = function(req, res) {
    return this.responseHandler.handle(req, res, this.service.removeSubmission(req.user, req.params['submission_id']));
};

SubmissionResource.prototype.listComments = function(req, res) {
    return this.responseHandler.handle(req, res, this.service.listComments(req.params['submission_id'], req.query['offset'], req.query['from_ts']));
};

SubmissionResource.prototype.createComment = function(req, res) {
    return this.responseHandler.handle(req, res, this.service.createComment(req.user, req.params['submission_id'], req.body));
};

SubmissionResource.prototype.updateComment = function(req, res) {
    return this.responseHandler.handle(req, res, this.service.updateComment(req.user, req.params['comment_id'], req.body));
};

SubmissionResource.prototype.removeComment = function(req, res) {
    return this.responseHandler.handle(req, res, this.service.removeComment(req.user, req.params['comment_id']));
};

module.exports = SubmissionResource;
