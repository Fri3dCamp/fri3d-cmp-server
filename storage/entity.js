var Q = require('q'),
    Patcher = require('../storage/patcher'),
    bodybuilder = require('bodybuilder'),
    log4js = require('log4js'),
    uuid = require('node-uuid');

var LOGGER  = log4js.getLogger();

function Entity(es, index, type) {
    this.esClient = es;
    this.index = index;
    this.type = type;
}

Entity.prototype.prepareSearch = function() {
    return bodybuilder();
};

Entity.prototype.id = function(id, fields) {
    var metadata = {
        index: this.index,
        type: this.type,
        _source: fields || '*',
        id: id
    };

    // LOGGER.trace("ID: " + JSON.stringify(metadata));
    return Q(this.esClient.get(metadata)).then(function(res) {
        return res._source;
    });
};

// Entity.prototype.find = function(field, value, fields) {
//     var filter =  {term: {}};
//     filter.term[field] = value;
//
//     var req = {
//         index: this.index,
//         type: this.type,
//         body: {
//             "query": {
//                 "filtered": {
//                     "query": { "match_all": {} },
//                     "filter": filter
//                 }
//             }
//         }
//     };
//
//     if (fields) {
//         req.fields = fields;
//         req.body._source = fields;
//     }
//
//     return Q(this.esClient.search(req));
// };

Entity.prototype.search = function(query, fields, paging) {
    var req = {
        index: this.index,
        type: this.type,
        _source: fields || '*',
        body: query.build ? query.build() : query
    };

    if (paging) {
        req.size = paging.size || 25;
        req.from = paging.offset || 0;
    }

    // LOGGER.trace("SEARCH: " + JSON.stringify(req));

    return Q(this.esClient.search(req));
};

Entity.prototype.create = function(data) {
    return Q(this.esClient.create({
        index: this.index,
        type: this.type,
        id: data.id || uuid.v4(),
        body: data
    }));
};

Entity.prototype.update = function(id, partialData) {
    return Q(this.esClient.update({
        index: this.index,
        type: this.type,
        id: id,
        body: { doc: partialData }
    }));
};

Entity.prototype.patch = function(id, patches) {
    var self = this;

    var metadata = {
        index: this.index,
        type: this.type,
        id: id
    };

    return Q(this.esClient.get(metadata).then(function(doc) {
        var resultDoc = Patcher.patch(doc._source, patches);

        return self.esClient.index({ index: self.index, type: self.type, id: id, retryOnConflict: 5, body: resultDoc});
    }));
};

Entity.prototype.remove = function(id) {
    return Q(this.esClient.delete({
        index: this.index,
        type: this.type,
        id: id
    }));
};

module.exports = Entity;