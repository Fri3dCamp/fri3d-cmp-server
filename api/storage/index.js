var Entity = require('./entity'),
    ElasticSearch = require('elasticsearch'),
    log4js = require('log4js');

var LOGGER = log4js.getLogger("storage");

function Storage(configuration) {
    this.esClient = new ElasticSearch.Client({
        "host": configuration.elasticsearch.host,
        "log": configuration.elasticsearch.log
    });
    this.index = configuration.elasticsearch.index;

    LOGGER.debug("ElasticSearch client created");
}

Storage.prototype.entity = function(entity) {
    return new Entity(this.esClient, this.index, entity);
};

module.exports = Storage;