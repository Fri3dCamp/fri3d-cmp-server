const uuid = require('node-uuid');

function CommentsService(storage) {
    this.comments = storage.entity('comments');
}

CommentsService.prototype.listComments = function(submissionId) {
    return this.submissions.id(submissionId);
};

CommentsService.prototype.createComment = function(data) {
    if (!data.id) data.id = uuid.v4();

    return this.submissions.set(data.id, data).then(function(response) {
        
    });
};

CommentsService.prototype.updateComment = function(data) {
    if (!data.id) data.id = uuid.v4();

    return this.submissions.set(data.id, data).then(function(response) {

    });
};

CommentsService.prototype.removeComment = function(commentId) {
    return this.submissions.remove(commentId);
};

module.exports = CommentsService;