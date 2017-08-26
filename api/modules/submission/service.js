const uuid = require('node-uuid');
var Tracer = require('../../tracer');

function SubmissionService(storage) {
    this.submissions = storage.entity('submissions');
    this.comments = storage.entity('comments');

    this.tracer = new Tracer(storage, "daan.gerits@gmail.com");
}

SubmissionService.prototype.getSubmission = function(submissionId) {
    return this.submissions.id(submissionId);
};

SubmissionService.prototype.setSubmission = function(data) {
    var self = this;

    if (!data.id) {
        data.id = uuid.v4();

        return this.submissions.set(data.id, data).then(function(response) {
            return self.tracer.traceCreation(data).then(function() {
                return response;
            });
        });
    } else {
        return this.submissions.id(data.id).then(function(old) {
            return self.submissions.set(data.id, data).then(function(response) {
                return self.tracer.traceAlteration(old, data).then(function() {
                    return response;
                });
            });
        });
    }
};

SubmissionService.prototype.listComments = function(submissionId, offset) {
    var builder = this.comments.prepareSearch()
        .filter('term', 'submission_id.keyword', submissionId)
        .sort("timestamp", "desc")
        .size(25);

    if (offset)
        builder.from(offset);

    return this.comments.search(builder, null, { offset: offset || 0 });
};

module.exports = SubmissionService;