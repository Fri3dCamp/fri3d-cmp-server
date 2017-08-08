module.exports.services = function()  {
    return {};
};

module.exports.resources = function() {
    return {};
};

module.exports.run = function(config, api, resources)  {
    api.registerGet('/health', function(req, res) { return res.status(200).end(); });
};