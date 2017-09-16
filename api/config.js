module.exports = {
    mail: {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
        secure : process.env.SMTP_SECURE === "true",
        logger : process.env.SMTP_LOGGER === "true",
        debug : process.env.SMTP_DEBUG === "true",
        from : process.env.SMTP_FROM,
        base_url : process.env.MAIL_BASE_URL,
        ignored_suffix : '.MARKED_AS_WRONG',
    },
    port: process.env.PORT || 3100,
    elasticsearch: {
        host: [{
            host: process.env.ES_HOST || "localhost",
            auth: (process.env.ES_USER && process.env.ES_PASSWORD) ? process.env.ES_USER + ":" + process.env.ES_PASSWORD: "elastic:changeme"
        }],
        index: process.env.ES_INDEX || "my-app",
        log: process.env.ES_LOG || "info"
    },
    slack: {
        url : process.env.SLACK_URL || "nope",
        channel : process.env.SLACK_CHANNEL || "nope",
        username : process.env.SLACK_USERNAME || "nope",
    }
};
// vim: set expandtab:
