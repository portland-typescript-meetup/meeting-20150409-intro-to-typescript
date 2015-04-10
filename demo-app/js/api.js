
var api = (function () {
    return {
        getProjects: getProjects,
        saveProjects: saveProjects
    };

    function getProjects() {
        var projectsString = localStorage.getItem('projects');

        if (projectsString) {
            return JSON.parse(projectsString);
        } else {
            return [];
        }
    };

    function saveProjects(projects) {
        var projectsString = JSON.stringify(projects);

        localStorage.setItem('projects', projectsString);
    };
})();
