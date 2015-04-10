var ProjectsViewModel = (function () {
    function ProjectsViewModel() {
        var _this = this;
        var projectsData;
        this.currentView = ko.observable('Projects');
        this.editTitle = ko.observable('');
        this.projects = ko.observableArray([]);
        this.currentProject = ko.observable(new Project());
        this.hasProjects = ko.computed(function () {
            var projects = _this.projects();
            return projects.length > 0;
        });
        projectsData = api.getProjects();
        if (projectsData) {
            ko.utils.arrayForEach(projectsData, function (projectData) {
                _this.projects.push(new Project(projectData));
            });
        }
    }
    ProjectsViewModel.prototype.addProject = function () {
        this.currentProject(new Project());
        this.editTitle('Add Project');
        this.currentView('AddEditProject');
    };
    ProjectsViewModel.prototype.editProject = function (project) {
        var projectData = project.getData();
        this.currentProject(new Project(projectData));
        this.editTitle('Edit Project');
        this.currentView('AddEditProject');
    };
    ProjectsViewModel.prototype.deleteProject = function (project) {
        this.projects.remove(project);
        this.saveProjects();
    };
    ProjectsViewModel.prototype.saveProject = function () {
        var project = this.currentProject(), projectToUpdate;
        if (project.projectId) {
            projectToUpdate = this.findProjectById(project.projectId);
            projectToUpdate.setData(project.getData());
        }
        else {
            project.projectId = this.getNextProjectId();
            this.projects.push(project);
        }
        this.saveProjects();
        this.currentView('Projects');
    };
    ProjectsViewModel.prototype.cancel = function () {
        this.currentView('Projects');
    };
    ProjectsViewModel.prototype.saveProjects = function () {
        var projects = this.projects(), projectData = [];
        ko.utils.arrayForEach(projects, function (project) {
            projectData.push(project.getData());
        });
        api.saveProjects(projectData);
    };
    ProjectsViewModel.prototype.getNextProjectId = function () {
        var projects = this.projects(), maxProject;
        if (projects.length > 0) {
            maxProject = _.max(projects, function (project) {
                return project.projectId;
            });
            return maxProject.projectId + 1;
        }
        else {
            return 1;
        }
    };
    ProjectsViewModel.prototype.findProjectById = function (projectId) {
        var projects = this.projects(), project;
        if (projectId) {
            project = ko.utils.arrayFirst(projects, function (project) {
                return project.projectId === projectId;
            });
        }
        return project;
    };
    return ProjectsViewModel;
})();
//# sourceMappingURL=projects-view-model.js.map