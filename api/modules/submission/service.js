const uuid = require('node-uuid');

function SubmissionService(storage) {
    this.submissions = storage.entity('submissions');
    this.comments = storage.entity('comments');
}

SubmissionService.prototype.getSubmission = function(submissionId) {
    return this.submissions.id(submissionId);
};

SubmissionService.prototype.setSubmission = function(data) {
    var self = this;

    if (!data.id) data.id = uuid.v4();

    return this.submissions.set(data.id, data).then(function(response) {
        if (response.created) {
            self.comments.set(uuid.v4(), {
                submission_id: data.id,
                timestamp: new Date(),
                user: "speaker",
                message: "The submission has been created"
            });
        } else {
            self.comments.set(uuid.v4(), {
                submission_id: data.id,
                timestamp: new Date(),
                user: "speaker",
                message: "The submission has been updated"
            });
        }

        return response;
    });
};

SubmissionService.prototype.listComments = function(submissionId, offset) {
    var builder = this.comments.prepareSearch()
        .filter('term', 'submission_id.keyword', submissionId)
        .size(25);

    if (offset)
        builder.from(offset);

    return this.comments.search(builder, null, { offset: offset || 0 });
};

module.exports = SubmissionService;