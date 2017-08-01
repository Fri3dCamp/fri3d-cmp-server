

module.exports = {
    port: process.env.PORT || 3100,
    elasticsearch: {
        host: [{
            host: process.env.ES_HOST || "localhost",
            auth: (process.env.ES_USER && process.env.ES_PASSWORD) ? process.env.ES_USER + ":" + process.env.ES_PASSWORD: "elastic:changeme"
        }],
        index: process.env.ES_INDEX || "my-app",
        log: process.env.ES_LOG || "info"
    },
    auth0: {
        domain: process.env.AUTH0_DOMAIN,
        clientId: process.env.AUTH0_CLIENT_ID,
        kid: process.env.AUTH0_KEY_ID
    }
};