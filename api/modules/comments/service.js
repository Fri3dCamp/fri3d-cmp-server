const uuid = require('node-uuid');
var log4js = require('log4js');
var LOGGER = log4js.getLogger("server");

function CommentsService(storage) {
    this.comments = storage.entity('comments');
    this.submissions = storage.entity('submissions');
}

CommentsService.prototype.listComments = function(submissionId) {
    return this.submissions.id(submissionId);
};

CommentsService.prototype.createComment = function(data, submissionId, origin) {
    LOGGER.info("createComment()");
    console.dir(data);
    if (!data.id) data.id = uuid.v4();
    data.submission_id = submissionId;
    data.origin = origin;
    data.timestamp = new Date();

    return this.comments.set(data.id, data).then(function(response) {

    });
};

CommentsService.prototype.updateComment = function(data) {
    if (!data.id) data.id = uuid.v4();

    return this.comments.set(data.id, data).then(function(response) {

    });
};

CommentsService.prototype.removeComment = function(commentId) {
    return this.comments.remove(commentId);
};

module.exports = CommentsService;
