myApp.factory('TMDashboard', function ($http, $q, $rootScope, $window, baseUrl) {
    var service = {};
    var projectList = [];
    var currentProjectIndex;
    var currentProject = {};
    var projectTasks = [];
    var projectCocomo = [];
    var taskStatus;
    var user = $window.sessionStorage.user;
    var userRole = $window.sessionStorage.userRole;

    service.getTmTasks = function () {
        var deferred = $q.defer();
        $http.get(baseUrl + '/api/auth/task/userProjects/' + user)
            .success(function (data) {
                projectList = [];
                data.forEach(function (data) {
                    projectList.push(data);
                });
                currentProject = projectList[0];
                deferred.resolve(projectList);
            })
            .error(function () {
                console.log("Error receiving projectList from the database");
                deferred.reject("getProjectList error");
            });
        return deferred.promise;
    }

    service.getCurrentProject = function () {
        return currentProject;
    };
    return service;
});