
var Project = function (projectData) {
    var self = this;

    self.projectId = 0;
    self.name = ko.observable('');
    self.description = ko.observable('');
    self.tasks = ko.observableArray();

    if (projectData) {
        setData(projectData);
    }

    self.hasTasks = ko.computed(function () {
        var tasks = self.tasks();

        return tasks.length > 0;
    });

    self.percentComplete = ko.computed(function () {
        var tasks = self.tasks();

        return getPercentComplete(tasks);
    });

    self.totalHours = ko.computed(function () {
        var tasks = self.tasks();

        return getTotalHours(tasks).toFixed(1);
    });

    self.totalCompletedHours = ko.computed(function () {
        var tasks = self.tasks();

        return getTotalCompletedHours(tasks).toFixed(1);
    });

    self.totalRemainingHours = ko.computed(function () {
        var tasks = self.tasks();

        return getTotalRemainingHours(tasks).toFixed(1);
    });

    self.addTask = function () {
        var task = new ProjectTask();

        self.tasks.push(task);
    };

    self.deleteTask = function (task) {
        self.tasks.remove(task);
    };

    self.getData = function () {
        return {
            projectId: self.projectId,
            name: self.name(),
            description: self.description(),
            tasks: ko.mapping.toJS(self.tasks)
        }
    };

    self.setData = function (projectData) {
        setData(projectData);
    };

    // private functions

    function getPercentComplete(tasks) {
        var totalHours = getTotalHours(tasks),
            completedHours = getTotalCompletedHours(tasks);

        if (totalHours > 0) {
            return ((completedHours / totalHours) * 100).toFixed(0) + '%';
        } else {
            return 'N/A';
        }
    }

    function getTotalHours(tasks) {
        return _.sum(tasks, function (task) {
            return task.hours();
        });
    }

    function getTotalCompletedHours(tasks) {
        return _.sum(tasks, function (task) {
            return task.completed() ? task.hours() : 0;
        });
    }

    function getTotalRemainingHours(tasks) {
        var totalHours = getTotalHours(tasks),
            completedHours = getTotalCompletedHours(tasks);

        return totalHours - completedHours;
    }

    function setData(projectData) {
        self.projectId = projectData.projectId;
        self.name(projectData.name);
        self.description(projectData.description);

        // make sure that the tasks array is empty
        self.tasks.removeAll();

        ko.utils.arrayForEach(projectData.tasks, function (taskData) {
            self.tasks.push(new ProjectTask(taskData));
        });
    }
};
