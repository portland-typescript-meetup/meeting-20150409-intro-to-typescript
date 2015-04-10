
# Migrating the Demo App to TypeScript

## Add tsconfig.json File

Compiler options listed at: [https://github.com/Microsoft/TypeScript/wiki/Compiler-Options](https://github.com/Microsoft/TypeScript/wiki/Compiler-Options)

Note: Prefer to disallow implicit "any" types.

```
{
    "compilerOptions": {
        "target": "es5",
        "module": "amd",
        "declaration": false,
        "noImplicitAny": false,
        "removeComments": true,
        "noLib": false,
        "sourceMap": true
    },
    "filesGlob": [
        "./**/*.ts"
    ],
    "files": [
    ]
}
```

## Rename Files

Rename the following .js files to .ts:

* models/project.js
* models/project-task.js
* main.js
* projects-view-model.js

## Add Ambient Declarations

Add global variables.

```
declare var ko: any;
declare var api: any;
declare var _: any;
```

## Fix Other Issues

1. Update the Project and ProjectTask functions data parameters to be optional

We should be compiling now :)

## So What Have We Gained???

1. Some tooling support
1. No type information... yet

## Fix External References

Now we need to add our missing references. Install the TypeScript Definition
manager for DefinitelyType by running the following command:

```
$ npm install tsd -g
```

Then query for available definition files:

```
$ tsd query knockout
```

Then to install a definition file:

```
$ tsd query knockout --action install
```

Repeat this for the following libraries:

1. knockout
1. knockout.mapping
1. lodash

```
$ tsd query knockout knockout.mapping lodash --action install
```

## Add custom lodash d.ts

The `sum()` function is missing from the lodash d.ts file, so we'll need
to add our own definition. Add a `lodash-sum.d.ts` file to the project with the
following code:

```
declare module _ {
    interface LoDashStatic {
        /**
         * @param collection The collection to iterate over.
         * @param callback The function called per iteration.
         * @param thisArg The this binding of callback.
         * @return Returns the sum of the values.
         **/
        sum<T>(
            collection: Array<T>,
            callback?: ListIterator<T, number>,
            thisArg?: any): number;

        /**
         * @see _.sum
         **/
        sum<T>(
            collection: List<T>,
            callback?: ListIterator<T, number>,
            thisArg?: any): number;

        /**
         * @see _.sum
         **/
        sum<T>(
            collection: Dictionary<T>,
            callback?: ListIterator<T, number>,
            thisArg?: any): number;

        /**
         * @see _.sum
         * @param pluckValue _.pluck style callback
         **/
        sum<T>(
            collection: Array<T>,
            pluckValue: string): number;

        /**
         * @see _.sum
         * @param pluckValue _.pluck style callback
         **/
        sum<T>(
            collection: List<T>,
            pluckValue: string): number;

        /**
         * @see _.sum
         * @param pluckValue _.pluck style callback
         **/
        sum<T>(
            collection: Dictionary<T>,
            pluckValue: string): number;

        /**
         * @see _.sum
         * @param whereValue _.where style callback
         **/
        sum<W, T>(
            collection: Array<T>,
            whereValue: W): number;

        /**
         * @see _.sum
         * @param whereValue _.where style callback
         **/
        sum<W, T>(
            collection: List<T>,
            whereValue: W): number;

        /**
         * @see _.sum
         * @param whereValue _.where style callback
         **/
        sum<W, T>(
            collection: Dictionary<T>,
            whereValue: W): number;
    }
}
```

## Add API d.ts file

Add the TypeScript definition file for the API function.

```
interface IAPIProject {
    projectId: number;
    name: string;
    description: string;
    tasks: IAPIProjectTask[];
}

interface IAPIProjectTask {
    name: string;
    completed: boolean;
    hours: number;
}

interface API {
    getProjects(): IAPIProject[];
    saveProjects(projects: IAPIProject[]): void;
}

declare var api: API;
```

## Fix Other Issues

1. Add IProject and IProjectTask interfaces and explicitly type
local variables where needed
1. Add data types to the Project total functions
1. Add data types to the ProjectsViewModel `getNextProjectId()` and `findProjectById()` functions

## Don't Stop Now... We're On a Roll

Let's continue to add more type information...

## Convert Model Functions Into Classes

Convert the Project and ProjectTask functions into classes.

1. Rename all "self" references to "this"
1. Use arrow functions for inline functions in order to get the correct "this" reference
1. Remove ";" at the end of function definitions

Important: Show the difference between inline function and fat arrow function
declarations.

Important: To compensate for moving functions to be defined on the prototype
the Knockout bindings need to be updated like this:

```
data-bind="click: currentProject().addTask.bind(currentProject())"
```

```
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
```

```
interface IProject {
    projectId: number;
    name: KnockoutObservable<string>;
    description: KnockoutObservable<string>;
    tasks: KnockoutObservableArray<IProjectTask>;

    getData(): IAPIProject;
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

    deleteTask(task) {
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

    setData(projectData) {
        this.setProjectData(projectData);
    }

    private getPercentComplete(tasks) {
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

    private getTotalRemainingHours(tasks) {
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
```
## Almost There...

Just a little bit further...

## Convert the View Model Function to a Class

Convert the ProjectsViewModel function to a class.

```
class ProjectsViewModel {
    currentView: KnockoutObservable<string>;
    editTitle: KnockoutObservable<string>;
    projects: KnockoutObservableArray<IProject>;
    currentProject: KnockoutObservable<IProject>;
    hasProjects: KnockoutComputed<boolean>;

    constructor() {
        var projectsData: IAPIProject[];

        this.currentView = ko.observable('Projects');
        this.editTitle = ko.observable('');
        this.projects = ko.observableArray([]);
        this.currentProject = ko.observable(new Project());

        this.hasProjects = ko.computed(() => {
            var projects = this.projects();
            return projects.length > 0;
        });

        // retrieve and setup the projects
        projectsData = api.getProjects();
        if (projectsData) {
            ko.utils.arrayForEach(projectsData, (projectData) => {
                this.projects.push(new Project(projectData));
            });
        }
    }

    addProject() {
        this.currentProject(new Project());
        this.editTitle('Add Project');
        this.currentView('AddEditProject');
    }

    editProject(project) {
        var projectData = project.getData();

        // create a copy of the project
        // in order to support the ability for the user to cancel an edit
        this.currentProject(new Project(projectData));
        this.editTitle('Edit Project');
        this.currentView('AddEditProject');
    }

    deleteProject(project) {
        this.projects.remove(project);
        this.saveProjects();
    }

    saveProject() {
        var project = this.currentProject(),
            projectToUpdate;

        // if we have an existing project then replace the project in the list
        // otherwise set the project id and add the project to the list
        if (project.projectId) {
            // find the project to update
            projectToUpdate = this.findProjectById(project.projectId);

            // update the data
            projectToUpdate.setData(project.getData());
        } else {
            // set the project id to the next available id
            project.projectId = this.getNextProjectId();

            // add the project to the end of the list
            this.projects.push(project);
        }

        this.saveProjects();

        this.currentView('Projects');
    }

    cancel() {
        this.currentView('Projects');
    }

    private saveProjects() {
        var projects = this.projects(),
            projectData = [];

        // get the project data
        ko.utils.arrayForEach(projects, (project) => {
            projectData.push(project.getData());
        });

        // save the projects
        api.saveProjects(projectData);
    }

    private getNextProjectId(): number {
        var projects = this.projects(),
            maxProject;

        if (projects.length > 0) {
            // determine the max id value
            maxProject = _.max(projects, (project) => {
                return project.projectId;
            });

            return maxProject.projectId + 1;
        } else {
            return 1;
        }
    }

    private findProjectById(projectId: number) {
        var projects = this.projects(),
            project;

        if (projectId) {
            project = ko.utils.arrayFirst(projects, (project) => {
                return project.projectId === projectId;
            });
        }

        return project;
    }
}
```

## Update tsconfig to Disallow Implicit "any" Types

Let's button down the hatches!
