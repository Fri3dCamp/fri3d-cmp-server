function CommentsResource(service, responseHandler) {
    this.service = service;
    this.responseHandler = responseHandler;
}

CommentsResource.prototype.list = function(req, res) {
    return this.responseHandler.handle(req, res, this.service.listComments(req.query['submission_id']));
};

CommentsResource.prototype.create = function(req, res) {
    return this.responseHandler.handle(req, res, this.service.createComment(req.body, req.query['submission_id']));
};

CommentsResource.prototype.update = function(req, res) {
    return this.responseHandler.handle(req, res, this.service.updateComment(req.params['comment_id'], req.body));
};

CommentsResource.prototype.remove = function(req, res) {
    return this.responseHandler.handle(req, res, this.service.removeComment(req.params['comment_id']));
};

module.exports = CommentsResource;
