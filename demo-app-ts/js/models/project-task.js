var ProjectTask = (function () {
    function ProjectTask(projectTaskData) {
        this.name = ko.observable('');
        this.completed = ko.observable(false);
        this.hours = ko.observable(0).extend({ numeric: 1 });
        if (projectTaskData) {
            this.name(projectTaskData.name);
            this.completed(projectTaskData.completed);
            this.hours(projectTaskData.hours);
        }
    }
    return ProjectTask;
})();
//# sourceMappingURL=project-task.js.map