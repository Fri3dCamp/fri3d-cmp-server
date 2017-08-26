const nodemailer = require('nodemailer');
const uuid = require('node-uuid');

function Tracer(storage, orgaEmail) {
    this.orgaEmail = orgaEmail;
    this.comments = storage.entity('comments');
    this.transporter = nodemailer.createTransport({
        host: 'smtp.example.com',
        port: 465,
        secure: true, // secure:true for port 465, secure:false for port 587
        auth: {
            user: 'username@example.com',
            pass: 'userpass'
        }
    });
}

Tracer.prototype.trace = function(submission) {
    var to = [ this.orgaEmail ];
    if (submission.speaker_email) to.push(submission.speaker_email);

    var mailOptions = {
        from: '"Fri3dcamp Content Platform" <content@fri3d.be>',
        to: to.join(','),
        subject: 'Your submission has been altered.',
        text: 'Hello world ?', // plain text body
        html: '<b>Hello world ?</b>' // html body
    };

// send mail with defined transport object
    sendMail(this.transporter, mailOptions);
    sendComment(this.comments, submission.id, "system", "Submission updated");
};

module.exports = Tracer;

function sendComment(entity, submission_id, user, message) {
    entity.set(uuid.v4(), {
        timestamp: new Date(),
        submission_id: submission_id,
        user: user,
        message: message
    });
}

function sendMail(transporter, mail) {
    transporter.sendMail(mail, function (error, info) {
        if (error) {
            return console.log(error);
        }

        console.log('Message %s sent: %s', info.messageId, info.response);
    });
}