function ActivityService(storage) {
    this.activities = storage.entity('activities');
}

ActivityService.prototype.lookupActivities = function(requester, q) {
    var builder = this.activities.prepareSearch()
        .query('wildcard', 'display_name', '*' + q + '*')
        .size(10);

    return this.activities.search(builder, ['id']);
};

ActivityService.prototype.listActivities = function(requester, q, offset) {
    var builder = this.activities.prepareSearch();

    if (q)
        builder.query('wildcard', '_all', '*' + q + '*');

    return this.activities.search(builder, ['id', 'title', 'description'], { offset: offset || 0 });
};

ActivityService.prototype.getActivity = function(requester, activityId) {
    return this.activities.id(activityId);
};

ActivityService.prototype.createActivity = function(requester, data) {
    return this.activities.create(data);
};

ActivityService.prototype.updateActivity = function(requester, activityId, data) {
    return this.activities.update(activityId, data);
};

ActivityService.prototype.removeActivity = function(requester, activityId) {
    return this.activities.remove(activityId);
};

module.exports = ActivityService;