myApp.factory('TMDashboard', function ($http, $q, $rootScope, $window, baseUrl) {
    var service = {};
    var projectList = [];
    var currentProjectIndex;
    var currentProject = {};
    var currentTask = {};
    var currentTaskId;
    var taskList = [];
    var unnassignedList = [];
    var projectCocomo = [];
    var taskStatus;
    var user = $window.sessionStorage.user;
    var userRole = $window.sessionStorage.userRole;

    service.getTmProjects = function () {
        var deferred = $q.defer();
        $http.get(baseUrl + '/api/auth/task/userProjects/' + user)
            .success(function (data) {
                projectList = [];
                data.forEach(function (data) {
                    projectList.push(data);
                });
                currentProject = projectList[0];
                currentProjectIndex = 0;
                deferred.resolve(projectList);
            })
            .error(function () {
                console.log("Error receiving projectList from the database");
                deferred.reject("getProjectList error");
            });
        return deferred.promise;
    };

    service.getTmTasks = function () {
        var deferred = $q.defer();
        $http.get(baseUrl + '/api/auth/project/' + currentProject.projectName + '/' + user + '/tasks' )
            .success(function (data) {
                taskList = [];
                data.forEach(function (data) {
                    taskList.push(data);
                });
                deferred.resolve(taskList);
            })
            .error(function () {
                console.log("Error receiving projectList from the database");
                deferred.reject("getProjectList error");
            });
        return deferred.promise;
    };

    service.getUnassignedTasks = function () {
        var deferred = $q.defer();
        $http.get(baseUrl + '/api/auth/project/' + currentProject.projectName + '/tasks' )
            .success(function (data) {
                unnassignedList = [];
                data.forEach(function (data) {
                    unnassignedList.push(data);
                });
                deferred.resolve(unnassignedList);
            })
            .error(function () {
                console.log("Error receiving projectList from the database");
                deferred.reject("getProjectList error");
            });
        return deferred.promise;
    };

    service.setCurrentTask = function (id){
        currentTaskId = id;
        var deferred = $q.defer();
        $http.get(baseUrl + '/api/auth/task/' + id )
            .success(function (data) {
                currentTask = data;
                deferred.resolve(currentTask);
            })
            .error(function () {
                console.log("Error receiving projectList from the database");
                deferred.reject("getProjectList error");
            });
        return deferred.promise;
    };

    service.getCurrentProject = function () {
        return currentProject;
    };

    service.getCurrentProjectIndex = function () {
        return currentProjectIndex;
    };

    service.getCurrentProjectTasks = function () {
        return taskList;
    };

    service.getCurrentTask = function() {
        return currentTask;
    };

    service.getCurrentTaskId = function () {
        return currentTaskId;
    };

    return service;
});