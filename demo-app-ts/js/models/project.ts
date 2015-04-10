
interface IProject {
    projectId: number;
    name: KnockoutObservable<string>;
    description: KnockoutObservable<string>;
    tasks: KnockoutObservableArray<IProjectTask>;

    getData(): IAPIProject;
    setData(projectData: IAPIProject): void;
}

class Project implements IProject {
    projectId: number;
    name: KnockoutObservable<string>;
    description: KnockoutObservable<string>;
    tasks: KnockoutObservableArray<IProjectTask>;
    hasTasks: KnockoutComputed<boolean>;
    percentComplete: KnockoutComputed<string>;
    totalHours: KnockoutComputed<string>;
    totalCompletedHours: KnockoutComputed<string>;
    totalRemainingHours: KnockoutComputed<string>;

    constructor(projectData?: IAPIProject) {
        this.projectId = 0;
        this.name = ko.observable('');
        this.description = ko.observable('');
        this.tasks = ko.observableArray([]);

        if (projectData) {
            this.setProjectData(projectData);
        }

        this.hasTasks = ko.computed(() => {
            var tasks = this.tasks();
            return tasks.length > 0;
        });

        this.percentComplete = ko.computed(() => {
            var tasks = this.tasks();
            return this.getPercentComplete(tasks);
        });

        this.totalHours = ko.computed(() => {
            var tasks = this.tasks();
            return this.getTotalHours(tasks).toFixed(1);
        });

        this.totalCompletedHours = ko.computed(() => {
            var tasks = this.tasks();
            return this.getTotalCompletedHours(tasks).toFixed(1);
        });

        this.totalRemainingHours = ko.computed(() => {
            var tasks = this.tasks();
            return this.getTotalRemainingHours(tasks).toFixed(1);
        });
    }

    addTask () {
        var task = new ProjectTask();
        this.tasks.push(task);
    }

    deleteTask(task: IProjectTask) {
        this.tasks.remove(task);
    }

    getData() {
        return {
            projectId: this.projectId,
            name: this.name(),
            description: this.description(),
            tasks: ko.mapping.toJS(this.tasks)
        }
    }

    setData(projectData: IAPIProject) {
        this.setProjectData(projectData);
    }

    private getPercentComplete(tasks: IProjectTask[]) {
        var totalHours = this.getTotalHours(tasks),
            completedHours = this.getTotalCompletedHours(tasks);

        if (totalHours > 0) {
            return ((completedHours / totalHours) * 100).toFixed(0) + '%';
        } else {
            return 'N/A';
        }
    }

    private getTotalHours(tasks: IProjectTask[]) {
        return _.sum(tasks, (task) => {
            return task.hours();
        });
    }

    private getTotalCompletedHours(tasks: IProjectTask[]) {
        return _.sum(tasks, (task) => {
            return task.completed() ? task.hours() : 0;
        });
    }

    private getTotalRemainingHours(tasks: IProjectTask[]) {
        var totalHours = this.getTotalHours(tasks),
            completedHours = this.getTotalCompletedHours(tasks);

        return totalHours - completedHours;
    }

    private setProjectData(projectData: IAPIProject) {
        this.projectId = projectData.projectId;
        this.name(projectData.name);
        this.description(projectData.description);

        // make sure that the tasks array is empty
        this.tasks.removeAll();

        ko.utils.arrayForEach(projectData.tasks, (taskData) => {
            this.tasks.push(new ProjectTask(taskData));
        });
    }
}
