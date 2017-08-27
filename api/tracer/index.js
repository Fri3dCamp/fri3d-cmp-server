const nodemailer = require('nodemailer');
const uuid = require('node-uuid');
const diff = require('deep-diff').diff;
const Q = require('q');

var EmailTemplate = require('email-templates').EmailTemplate;
var path = require('path');

var mails = {
    submission: {
        created: new EmailTemplate(path.join(process.cwd(), 'templates', 'submission-created')),
        updated: new EmailTemplate(path.join(process.cwd(), 'templates', 'submission-updated'))
    }
};

function Tracer(storage, orgaEmail) {
    this.orgaEmail = orgaEmail;
    this.comments = storage.entity('comments');
    this.transporter = nodemailer.createTransport({
        host: 'mail.gandi.net',
        port: 587,
        secure: false, // secure:true for port 465, secure:false for port 587
        auth: {
            user: 'systemsout@codewerken.be',
            pass: 'THIS.IS.NOT.A.REAL.PASSWORD.|x885'
        }
    });
}

Tracer.prototype.traceCreation = function(newValue) {
    var self = this;

    // -- add the email addresses
    var to = [ this.orgaEmail ];
    if (newValue.speaker_email) to.push(newValue.speaker_email);
    if (newValue.collaborators && Array.isArray(newValue.collaborators)) {
        newValue.collaborators.forEach(function(collaborator) {
            if (collaborator.email) to.push(collaborator.email);
        });
    }

    var defer = Q.defer();

    mails.submission.created.render({"submission": newValue}, function(err, result) {
        if (err) return defer.reject();

        var mailOptions = {
            from: '"Fri3dcamp Content Platform" <content@fri3d.be>',
            to: to.join(','),
            subject: result.subject,
            text: result.text,
            html: result.html
        };

        defer.resolve(Q.allSettled([
            sendMail(self.transporter, mailOptions),
            sendComment(self.comments, newValue.id, "system", "Submission created")
        ]));
    });

    return defer.promise;
};

Tracer.prototype.traceAlteration = function(oldValue, newValue) {
    var self = this;
    var differences = diff(oldValue, newValue);

    // -- add the email addresses
    var to = [ this.orgaEmail ];
    if (newValue.speaker_email) to.push(newValue.speaker_email);
    if (newValue.collaborators && Array.isArray(newValue.collaborators)) {
        newValue.collaborators.forEach(function(collaborator) {
            if (collaborator.email) to.push(collaborator.email);
        });
    }

    var defer = Q.defer();

    mails.submission.updated.render({"submission": newValue, diff: differences}, function(err, result) {
        if (err) return defer.reject();

        var mailOptions = {
            from: '"Fri3dcamp Content Platform" <content@fri3d.be>',
            to: to.join(','),
            subject: result.subject,
            text: result.text,
            html: result.html
        };

        defer.resolve(Q.allSettled([
            sendMail(self.transporter, mailOptions),
            sendComment(self.comments, newValue.id, "system", "Submission updated", differences)
        ]));
    });

    return defer.promise;
};

module.exports = Tracer;

function sendComment(entity, submission_id, user, message, diff) {
    return entity.set(uuid.v4(), {
        timestamp: new Date(),
        submission_id: submission_id,
        user: user,
        message: message,
        diff: diff
    });
}

function sendMail(transporter, mail) {
    var defer = Q.defer();

    transporter.sendMail(mail, function (error, info) {
        if (error) {
            return defer.reject(error);
        }

        defer.resolve(info);
    });

    return defer.promise;
}