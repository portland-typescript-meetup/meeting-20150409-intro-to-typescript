
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

    editProject(project: IProject) {
        var projectData = project.getData();

        // create a copy of the project
        // in order to support the ability for the user to cancel an edit
        this.currentProject(new Project(projectData));
        this.editTitle('Edit Project');
        this.currentView('AddEditProject');
    }

    deleteProject(project: IProject) {
        this.projects.remove(project);
        this.saveProjects();
    }

    saveProject() {
        var project = this.currentProject(),
            projectToUpdate: IProject;

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
            projectData: IAPIProject[] = [];

        // get the project data
        ko.utils.arrayForEach(projects, (project) => {
            projectData.push(project.getData());
        });

        // save the projects
        api.saveProjects(projectData);
    }

    private getNextProjectId(): number {
        var projects = this.projects(),
            maxProject: IProject;

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
            project: IProject;

        if (projectId) {
            project = ko.utils.arrayFirst(projects, (project) => {
                return project.projectId === projectId;
            });
        }

        return project;
    }
}
