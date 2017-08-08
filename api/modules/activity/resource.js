function ActivityResource(service, responseHandler) {
    this.service = service;
    this.responseHandler = responseHandler;
}

ActivityResource.prototype.lookup = function(req, res) {
    return this.responseHandler.handle(req, res, this.service.lookupActivities(req.user, req.query['q']));
};

ActivityResource.prototype.list = function(req, res) {
    return this.responseHandler.handle(req, res, this.service.listActivities(req.user, req.query['q'], req.query['from']));
};

ActivityResource.prototype.get = function(req, res) {
    return this.responseHandler.handle(req, res, this.service.getActivity(req.user, req.params['activityId']));
};

ActivityResource.prototype.create = function(req, res) {
    return this.responseHandler.handle(req, res, this.service.createActivity(req.user, req.body));
};

ActivityResource.prototype.update = function(req, res) {
    return this.responseHandler.handle(req, res, this.service.updateActivity(req.user,req.params['activityId'], req.body));
};

ActivityResource.prototype.remove = function(req, res) {
    return this.responseHandler.handle(req, res, this.service.removeActivity(req.user, req.params['activityId']));
};

module.exports = ActivityResource;
