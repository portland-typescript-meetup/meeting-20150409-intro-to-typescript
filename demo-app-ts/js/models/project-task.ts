
interface IProjectTask {
    name: KnockoutObservable<string>;
    completed: KnockoutObservable<boolean>;
    hours: KnockoutObservable<number>;
}

class ProjectTask implements IProjectTask {
    name: KnockoutObservable<string>;
    completed: KnockoutObservable<boolean>;
    hours: KnockoutObservable<number>;

    constructor(projectTaskData?: IAPIProjectTask) {
        this.name = ko.observable('');
        this.completed = ko.observable(false);
        this.hours = ko.observable(0).extend({ numeric: 1 });

        if (projectTaskData) {
            this.name(projectTaskData.name);
            this.completed(projectTaskData.completed);
            this.hours(projectTaskData.hours);
        }
    }
}
