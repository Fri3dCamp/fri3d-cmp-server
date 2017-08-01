function ActivityService(storage) {
    this.activities = storage.entity('projects');
}

ActivityService.prototype.lookupActivity = function(requester, q) {
    var builder = this.entity.prepareSearch()
        .query('wildcard', 'display_name', '*' + q + '*')
        .size(10);

    return this.activities.search(builder, ['id']);
};

ActivityService.prototype.listActivities = function(requester, namePrefix, offset) {
    var builder = this.activities.prepareSearch()
        .size(25);

    if (namePrefix)
        builder.query('prefix', 'title', namePrefix);

    if (offset)
        builder.from(offset);

    return this.activities.search(builder, ['id', 'title', 'description'], { offset: offset || 0 });
};

ActivityService.prototype.getActivity = function(requester, id) {
    return this.activities.id(id);
};

ActivityService.prototype.createActivity = function(requester, data) {
    return this.activities.create(data);
};

ActivityService.prototype.updateActivity = function(requester, id, data) {
    return this.activities.update(id, data);
};

ActivityService.prototype.removeActivity = function(requester, id) {
    return this.activities.remove(id);
};

module.exports = ActivityService;