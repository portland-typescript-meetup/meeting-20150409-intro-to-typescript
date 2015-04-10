
var ProjectTask = function (projectTaskData) {
    var self = this;

    self.name = ko.observable();
    self.completed = ko.observable(false);
    self.hours = ko.observable(0).extend({ numeric: 1 });

    if (projectTaskData) {
        self.name(projectTaskData.name);
        self.completed(projectTaskData.completed);
        self.hours(projectTaskData.hours);
    }
};
