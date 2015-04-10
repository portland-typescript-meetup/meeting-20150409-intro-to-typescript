
var ProjectsViewModel = function() {
    var self = this,
        projectsData;

    self.currentView = ko.observable('Projects');
    self.editTitle = ko.observable();
    self.projects = ko.observableArray();
    self.currentProject = ko.observable(new Project());

    self.hasProjects = ko.computed(function () {
        var projects = self.projects();

        return projects.length > 0;
    });

    // retrieve and setup the projects
    projectsData = api.getProjects();
    if (projectsData) {
        ko.utils.arrayForEach(projectsData, function (projectData) {
            self.projects.push(new Project(projectData));
        });
    }

    self.addProject = function () {
        self.currentProject(new Project());
        self.editTitle('Add Project');
        self.currentView('AddEditProject');
    };

    self.editProject = function (project) {
        var projectData = project.getData();

        // create a copy of the project
        // in order to support the ability for the user to cancel an edit
        self.currentProject(new Project(projectData));
        self.editTitle('Edit Project');
        self.currentView('AddEditProject');
    };

    self.deleteProject = function (project) {
        self.projects.remove(project);

        saveProjects();
    };

    self.saveProject = function () {
        var project = self.currentProject(),
            projectToUpdate;

        // if we have an existing project then replace the project in the list
        // otherwise set the project id and add the project to the list
        if (project.projectId) {
            // find the project to update
            projectToUpdate = findProjectById(project.projectId);

            // update the data
            projectToUpdate.setData(project.getData());
        } else {
            // set the project id to the next available id
            project.projectId = getNextProjectId();

            // add the project to the end of the list
            self.projects.push(project);
        }

        saveProjects();

        self.currentView('Projects');
    };

    self.cancel = function () {
        self.currentView('Projects');
    };

    // private functions

    function saveProjects() {
        var projectData = [];

        // get the project data
        ko.utils.arrayForEach(self.projects(), function (project) {
            projectData.push(project.getData());
        });

        // save the projects
        api.saveProjects(projectData);
    }

    function getNextProjectId() {
        var projects = self.projects(),
            maxProject;

        if (projects.length > 0) {
            // determine the max id value
            maxProject = _.max(projects, function (project) {
                return project.projectId;
            });

            return maxProject.projectId + 1;
        } else {
            return 1;
        }
    }

    function findProjectById(projectId) {
        var project = null;

        if (projectId) {
            project = ko.utils.arrayFirst(self.projects(), function (project) {
                return project.projectId === projectId;
            });
        }

        return project;
    }
};
