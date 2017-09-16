const nodemailer = require('nodemailer');
const uuid = require('node-uuid');
const diff = require('deep-diff').diff;
const Q = require('q');
var configuration = require('../config');
var xlat = require('./translations_email');
var Slack = require('slack-node');

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
    this.slack = new Slack();
    this.slack.setWebhook(configuration.slack.url);
}

function submission_language(submission) {

    if ('form_language' in submission && submission.form_language != 'nl') {
        return submission.form_language;
    }
    return 'nl';

}

function build_url(submission, error=false) {

    var url = configuration.mail.base_url;
    var args = [];

    url += (error) ? '/cfp_wrong_email' : '/cfp';
    url += '/' + submission.id;

    if ('form_language' in submission && submission.form_language != 'nl') {
        args.push('lang=' + submission.form_language);
    }

    if (args.length > 0) {
        url += '?' + args.join('&');
    }

    return url;

}


Tracer.prototype.traceCreation = function(newValue) {
    var self = this;
    var lang = submission_language(newValue);

    // -- add the email addresses
    var to = [ this.orgaEmail ];
    if (newValue.speaker_email)
        if (!newValue.speaker_email.endsWith(configuration.mail.ignored_suffix))
            to.push(newValue.speaker_email);
    if (newValue.collaborators && Array.isArray(newValue.collaborators)) {
        newValue.collaborators.forEach(function(collaborator) {
            if (collaborator.email)
                if (!collaborator.email.endsWith(configuration.mail.ignored_suffix))
                     to.push(collaborator.email);
        });
    }

    var defer = Q.defer();

    mails[lang].submission.created.render({
        "submission": newValue,
        diff : textdiff({ id : newValue.id }, newValue, lang),
        url_update : build_url(newValue),
        url_unsub : build_url(newValue, true),
    }, function(err, result) {
        if (err) return defer.reject();

        var mailOptions = {
            from: configuration.mail.from,
            to: to.join(','),
            subject: result.subject,
            text: result.text,
            html: result.html
        };

        var slackText = "New submission from " + newValue.speaker_email + " titled \"" + newValue.title + "\", see " + build_url(newValue);

        defer.resolve(Q.allSettled([
            sendMail(self.transporter, mailOptions),
            sendComment(self.comments, newValue.id, { prev: {}, cur : newValue, diff : textdiff({}, newValue, lang) }),
            sendSlackNotif(self.slack, slackText)
        ]));
    });

    return defer.promise;
};

function textdiff(o, n, lang) {
    const sep_list = ', ';
    const sep_obj = '/';

    function tr(x) { return (x in xlat[lang]) ? xlat[lang][x] : x; };
    function pprint(x) {
        if (x instanceof Array) {
            return x.map(pprint).join(sep_list);
        } else if (x instanceof Object) {
            return function(obj) {
                var o = [];
                for (var k in obj) {
                    o.push(pprint(obj[k]));
                }
                return o;
            }(x).join(sep_obj);
        }
        return tr(x);
    }

    var removed = {};
    var added = {}
    var changed = [];

    var out = "";

    for (var k in o)
        if (!(k in n))
            removed[k] = o[k];

    for (var k in n)
        if (!(k in o))
            added[k] = n[k];
        else if (JSON.stringify(o[k]) != JSON.stringify(n[k]))
            changed.push(k);

    if (Object.keys(added).length > 0) {
        out += '<ul><h4>' + tr('added') + '</h4>\n';
        for (var k in added) {
            if (added[k].length)
                // inhibit sending empty fields
                out += '  <li><b>' + tr(k) + '</b>: <i>' + pprint(added[k]) + '</i></li>\n';
        }
        out += '</ul><!-- '+tr('added') + '-->\n';
    }
    if (Object.keys(removed).length > 0) {
        out += '<ul><h4>' + tr('removed') + '</h4>\n';
        for (var k in removed) {
            out += '  <li><b>' + t(rk) + '</b></li>\n'; //: ' + pprint(removed[k]) + '</li>\n';
        }
        out += '</ul><!-- '+tr('removed') + '-->\n';
    }
    if (changed.length > 0) {
        out += '<ul><h4>' + tr('changed') + '</h4>\n';
        changed.forEach(function(k) {
            out += '  <li><b>' + tr(k) + '</b> ' + tr('changed_from') + ' "<i>' + pprint(o[k]) + '</i>" ' + tr('changed_to') + ' "<i>' + pprint(n[k]) + '</i>".</li>\n';
        });
        out += '</ul><!-- '+tr('changed') + '-->\n';
    }

    return out;

}

Tracer.prototype.traceAlteration = function(oldValue, newValue) {
    var self = this;
    var lang = submission_language(newValue);
    var differences = textdiff(oldValue, newValue, lang);

    // -- add the email addresses
    var to = [ this.orgaEmail ];
    if (newValue.speaker_email)
        if (!newValue.speaker_email.endsWith(configuration.mail.ignored_suffix))
            to.push(newValue.speaker_email);
    if (newValue.collaborators && Array.isArray(newValue.collaborators)) {
        newValue.collaborators.forEach(function(collaborator) {
            if (collaborator.email)
                if (!collaborator.email.endsWith(configuration.mail.ignored_suffix))
                    to.push(collaborator.email);
        });
    }

    var defer = Q.defer();

    mails[lang].submission.updated.render({
        "submission": newValue,
        diff: differences,
        url_update : build_url(newValue),
        url_unsub : build_url(newValue, true),
    }, function(err, result) {
        if (err) return defer.reject();

        var mailOptions = {
            from: configuration.mail.from,
            to: to.join(','),
            subject: result.subject,
            text: result.text,
            html: result.html
        };
        var slackText = "Updated submission from " + newValue.speaker_email + " titled \"" + newValue.title + "\", see " + build_url(newValue);

        defer.resolve(Q.allSettled([
            sendMail(self.transporter, mailOptions),
            sendComment(self.comments, newValue.id, { prev: oldValue, cur : newValue, diff : differences }),
            sendSlackNotif(self.slack, slackText)
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

function sendSlackNotif(slack, text) {

    var d = Q.defer();

    slack.webhook({
        channel : configuration.slack.channel,
        username : configuration.slack.username,
        text : text,
        icon_emoji : ":tent:",
    }, function(e, resp) {
        if (resp.response != "ok") {
            console.log("error submitting notification to slack:");
            console.dir(resp);
        }
        d.resolve("ok");
    });

    return d.promise;

}
