var Project = (function () {
    function Project(projectData) {
        var _this = this;
        this.projectId = 0;
        this.name = ko.observable('');
        this.description = ko.observable('');
        this.tasks = ko.observableArray([]);
        if (projectData) {
            this.setProjectData(projectData);
        }
        this.hasTasks = ko.computed(function () {
            var tasks = _this.tasks();
            return tasks.length > 0;
        });
        this.percentComplete = ko.computed(function () {
            var tasks = _this.tasks();
            return _this.getPercentComplete(tasks);
        });
        this.totalHours = ko.computed(function () {
            var tasks = _this.tasks();
            return _this.getTotalHours(tasks).toFixed(1);
        });
        this.totalCompletedHours = ko.computed(function () {
            var tasks = _this.tasks();
            return _this.getTotalCompletedHours(tasks).toFixed(1);
        });
        this.totalRemainingHours = ko.computed(function () {
            var tasks = _this.tasks();
            return _this.getTotalRemainingHours(tasks).toFixed(1);
        });
    }
    Project.prototype.addTask = function () {
        var task = new ProjectTask();
        this.tasks.push(task);
    };
    Project.prototype.deleteTask = function (task) {
        this.tasks.remove(task);
    };
    Project.prototype.getData = function () {
        return {
            projectId: this.projectId,
            name: this.name(),
            description: this.description(),
            tasks: ko.mapping.toJS(this.tasks)
        };
    };
    Project.prototype.setData = function (projectData) {
        this.setProjectData(projectData);
    };
    Project.prototype.getPercentComplete = function (tasks) {
        var totalHours = this.getTotalHours(tasks), completedHours = this.getTotalCompletedHours(tasks);
        if (totalHours > 0) {
            return ((completedHours / totalHours) * 100).toFixed(0) + '%';
        }
        else {
            return 'N/A';
        }
    };
    Project.prototype.getTotalHours = function (tasks) {
        return _.sum(tasks, function (task) {
            return task.hours();
        });
    };
    Project.prototype.getTotalCompletedHours = function (tasks) {
        return _.sum(tasks, function (task) {
            return task.completed() ? task.hours() : 0;
        });
    };
    Project.prototype.getTotalRemainingHours = function (tasks) {
        var totalHours = this.getTotalHours(tasks), completedHours = this.getTotalCompletedHours(tasks);
        return totalHours - completedHours;
    };
    Project.prototype.setProjectData = function (projectData) {
        var _this = this;
        this.projectId = projectData.projectId;
        this.name(projectData.name);
        this.description(projectData.description);
        this.tasks.removeAll();
        ko.utils.arrayForEach(projectData.tasks, function (taskData) {
            _this.tasks.push(new ProjectTask(taskData));
        });
    };
    return Project;
})();
//# sourceMappingURL=project.js.map