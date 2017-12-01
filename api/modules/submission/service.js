const uuid = require('node-uuid');
var Tracer = require('../../tracer');
var log4js = require('log4js');
var LOGGER = log4js.getLogger("server");
var Errors = require('../../errors');
var Q = require('q');

function SubmissionService(storage) {
    this.submissions = storage.entity('submissions');
    this.comments = storage.entity('comments');

    this.tracer = new Tracer(storage, "content@fri3d.be");
}

SubmissionService.prototype.listSubmissions = function(query, offset, size) {
    return this.submissions.search(query, null, {
        offset: offset || 0,
        size: size || 25
    });
};

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

SubmissionService.prototype.removeSubmission = function(user, submissionId) {
    return this.submissions.remove(submissionId);
};

SubmissionService.prototype.listComments = function(submissionId, offset, from_ts) {
    var builder = this.comments.prepareSearch()
        .filter('term', 'submission_id.keyword', submissionId)
        .sort("timestamp", "desc")
        .size(25);

    if (offset)
        builder.from(offset);

    return this.comments.search(builder, null, { offset: offset || 0 });
};

SubmissionService.prototype.createComment = function(user, submissionId, data) {
    var self = this;

    if (data && data.origin !== 'author') {
        if (!user || !user['http://fri3d.be/claims/roles'] || user['http://fri3d.be/claims/roles'].indexOf('admin') === -1)
            return Q.reject(new Errors.AuthorizationError("Only admins are allowed to post as fri3d"));
    }

    if (!data.id) data.id = uuid.v4();
    data.submission_id = submissionId;
    data.timestamp = new Date();

    LOGGER.info("storing: ", data);

    return this.getSubmission(submissionId).then(function(submission) {
        return self.comments.set(data.id, data).then(function(response) {
            return self.tracer.traceComment(submission, data.contents.message, data.origin === "fri3d").then(function() {
                return response;
            });
        });
    });
};

SubmissionService.prototype.updateComment = function(user, data) {
    if (!data.id) data.id = uuid.v4();

    return this.comments.set(data.id, data);
};

SubmissionService.prototype.removeComment = function(user, commentId) {
    return this.comments.remove(commentId);
};

module.exports = SubmissionService;
// vim: set expandtab:
