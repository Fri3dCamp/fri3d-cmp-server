module.exports = {
    mail: {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
        base_url : process.env.MAIL_BASE_URL,
    },
    port: process.env.PORT || 3100,
    elasticsearch: {
        host: [{
            host: process.env.ES_HOST || "localhost",
            auth: (process.env.ES_USER && process.env.ES_PASSWORD) ? process.env.ES_USER + ":" + process.env.ES_PASSWORD: "elastic:changeme"
        }],
        index: process.env.ES_INDEX || "my-app",
        log: process.env.ES_LOG || "info"
    }
};
// vim: set expandtab:
