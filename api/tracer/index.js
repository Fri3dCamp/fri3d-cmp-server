const nodemailer = require('nodemailer');
const uuid = require('node-uuid');
const diff = require('deep-diff').diff;
const Q = require('q');
var configuration = require('../config');

var EmailTemplate = require('email-templates').EmailTemplate;
var path = require('path');

var mails = {
    en: {
        submission: {
            created: new EmailTemplate(path.join(process.cwd(), 'templates', 'submission-created_en')),
            updated: new EmailTemplate(path.join(process.cwd(), 'templates', 'submission-updated_en'))
        },
    },
    nl: {
        submission: {
            created: new EmailTemplate(path.join(process.cwd(), 'templates', 'submission-created_nl')),
            updated: new EmailTemplate(path.join(process.cwd(), 'templates', 'submission-updated_nl'))
        },
    },
};

function Tracer(storage, orgaEmail) {
    this.orgaEmail = orgaEmail;
    this.comments = storage.entity('comments');
    this.transporter = nodemailer.createTransport({
        host: configuration.mail.host,
        port: configuration.mail.port,
        secure: configuration.mail.secure, // secure:true for port 465, secure:false for port 587
        auth: {
            user: configuration.mail.user,
            pass: configuration.mail.pass,
        },
        logger : configuration.mail.logger,
        debug : configuration.mail.debug,
    });
}

function submission_language(submission) {

    if ('form_language' in submission && submission.form_language != 'nl') {
        return submission.form_language;
    }
    return 'nl';

}

function build_url(submission, error=false) {

    var url = configuration.mail.base_url + '/cfp';
    var args = [];

    url += '/' + submission.id;

    if ('form_language' in submission && submission.form_language != 'nl') {
        args.push('lang=' + submission.form_language);
    }
    if (error) {
        args.push('wrong_email');
    }

    if (args.length > 0) {
        url += '?' + args.join('&');
    }

    console.log('url built: '+url);
    return url;

}


Tracer.prototype.traceCreation = function(newValue) {
    var self = this;
    var lang = submission_language(newValue);

    // -- add the email addresses
    var to = [ this.orgaEmail ];
    if (newValue.speaker_email) to.push(newValue.speaker_email);
    if (newValue.collaborators && Array.isArray(newValue.collaborators)) {
        newValue.collaborators.forEach(function(collaborator) {
            if (collaborator.email) to.push(collaborator.email);
        });
    }

    var defer = Q.defer();

    mails[lang].submission.created.render({
        "submission": newValue,
        url_update : build_url(newValue),
        url_unsub : build_url(newValue, true),
    }, function(err, result) {
        if (err) return defer.reject();

        var mailOptions = {
            from: '"Fri3d Camp 2018" <content@fri3d.be>',
            to: to.join(','),
            subject: result.subject,
            text: result.text,
            html: result.html
        };

        defer.resolve(Q.allSettled([
            sendMail(self.transporter, mailOptions),
            sendComment(self.comments, newValue.id, "Submission created")
        ]));
    });

    return defer.promise;
};

function diff2txt(d) {

    var o = [];

    for (var i in d) {
        var e = d[i];
        var name = e.path.join('.');
        if (e.kind == 'N') {
            o.push('"'+name+'" is nieuw ("'+e.rhs+'")');
        } else if (e.kind == 'D') {
            o.push('"'+name+'" is weg');
        } else if (e.kind == 'E') {
            o.push('"'+name+'" is aangepast (van "'+e.lhs+'" naar "'+e.rhs+'")');
        } else {
            o.push('"'+name+'" is aangepast');
        }
    }
    return o.join(", ");

}

Tracer.prototype.traceAlteration = function(oldValue, newValue) {
    var self = this;
    var differences = diff(oldValue, newValue);
    var lang = submission_language(newValue);

    // -- add the email addresses
    var to = [ this.orgaEmail ];
    if (newValue.speaker_email) to.push(newValue.speaker_email);
    if (newValue.collaborators && Array.isArray(newValue.collaborators)) {
        newValue.collaborators.forEach(function(collaborator) {
            if (collaborator.email) to.push(collaborator.email);
        });
    }

    var defer = Q.defer();

    mails[lang].submission.updated.render({
        "submission": newValue,
        diff: diff2txt(differences),
        url_update : build_url(newValue),
        url_unsub : build_url(newValue, true),
    }, function(err, result) {
        if (err) return defer.reject();

        var mailOptions = {
            from: '"Fri3d Camp 2018" <content@fri3d.be>',
            to: to.join(','),
            subject: result.subject,
            text: result.text,
            html: result.html
        };

        defer.resolve(Q.allSettled([
            sendMail(self.transporter, mailOptions),
            sendComment(self.comments, newValue.id, "Submission updated: "+diff2txt(differences))
        ]));
    });

    return defer.promise;
};

module.exports = Tracer;

function sendComment(entity, submission_id, message) {
    return entity.set(uuid.v4(), {
        timestamp: new Date(),
        submission_id: submission_id,
        origin: 'system',
        contents: message,
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

    // XXX FIXME DIRTYHAXX TODO THING
    defer.resolve('howareyougentlemen');

    return defer.promise;
}
