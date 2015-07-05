/**
 * Created by scottmackenzie on 2/07/2015.
 */

/* PMDashboard Factory
 * On initial load, the list of relevant project names are retrieved from the server.
 * Then, the project details and tasks for the first project are retrieved.
 * With each change of tab, the project details and tasks are retrieved from the database
 */

myApp.factory('PMDashboard', function($http, $q, $rootScope, baseUrl) {
    var service = {};
    var projectList = [];
    var currentProjectIndex = 0;
    var currentProject = {};
    var projectTasks = [];

    service.getProjectListFromServer = function() {
        console.log('call to retrieve project list');
        var deferred = $q.defer();
        $http.get(baseUrl + '/api/auth/projects', {params : { "fields" : ['"projectName"']}})
            .success(function(data) {
                projectList = [];
                data.forEach(function(data) {
                    projectList.push(data.projectName);
                })
                deferred.resolve(projectList);
            })
            .error(function() {
                console.log("Error receiving projectList from the database");
                deferred.reject("getProjectList error");
            });
        return deferred.promise;
    };

    service.getProjectFromServer = function(projectName) {
        console.log('call to retrieve project');
        var deferred = $q.defer();
        $http.get(baseUrl + '/api/auth/project/' + projectName)
            .success(function(data) {
                currentProject = data;
                deferred.resolve(currentProject);
            })
            .error(function() {
                console.log("Error receiving projects from the database");
                deferred.reject("getProjects error");
            });
        return deferred.promise;
    };

    service.getProjectTasksFromServer = function(projectName) {
        console.log('call to retrieve tasks');
        var deferred = $q.defer();
        $http.get(baseUrl + '/api/auth/project/' + projectName + '/tasks/')
            .success(function(tasks) {
                projectTasks = tasks;
                deferred.resolve(tasks);
            })
            .error(function() {
                console.log("Error receiving tasks from the database");
                deferred.reject("getCurrentTasks error");
            });
        return deferred.promise;
    };

    service.setCurrentProject = function(index) {
        currentProjectIndex = index;
        service.getProjectFromServer(projectList[index]);
        service.getProjectTasksFromServer(projectList[index])
            .then(function(){ $rootScope.$broadcast('switch project'); } );

    };

    service.getCurrentProject = function() {
        return currentProject;
    };


    service.getProjectList = function() {
        return projectList;
    };

    service.getProjectTasks = function() {
        return projectTasks;
    };

    //get projects and tasks on initial load
    service.getProjectListFromServer()
        .then(function() {
            if(projectList.length > 0) {
                service.getProjectFromServer(projectList[currentProjectIndex]);
                service.getProjectTasksFromServer(projectList[currentProjectIndex])
                    .then(function(){ $rootScope.$broadcast('switch project'); } );
            }
        });

    return service;
});


//watch version of PMDashboard Factory
/*myApp.factory('PMDashboard', function($http, $q, $rootScope, baseUrl) {
    var service = {};
    var projectList = [];
    var currentProjectIndex = 0;
    var currentProject = {};
    var projectTasks = [];

    service.getProjectListFromServer = function() {
        console.log('call to retrieve project list');
        var deferred = $q.defer();
        $http.get(baseUrl + '/api/auth/projects', {params : { "fields" : ['"projectName"']}})
            .success(function(data) {
                projectList = [];
                data.forEach(function(data) {
                    projectList.push(data.projectName);
                })
                deferred.resolve(projectList);
            })
            .error(function() {
                console.log("Error receiving projectList from the database");
                deferred.reject("getProjectList error");
            });
        return deferred.promise;
    };

    service.getProjectFromServer = function(projectName) {
        console.log('call to retrieve project');
        var deferred = $q.defer();
        $http.get(baseUrl + '/api/auth/project/' + projectName)
            .success(function(data) {
                currentProject = data;
                deferred.resolve(currentProject);
            })
            .error(function() {
                console.log("Error receiving projects from the database");
                deferred.reject("getProjects error");
            });
        return deferred.promise;
    };

    service.getProjectTasksFromServer = function(projectName) {
        console.log('call to retrieve tasks');
        var deferred = $q.defer();
        $http.get(baseUrl + '/api/auth/project/' + projectName + '/tasks/')
            .success(function(tasks) {
                projectTasks = tasks;
                deferred.resolve(tasks);
            })
            .error(function() {
                console.log("Error receiving tasks from the database");
                deferred.reject("getCurrentTasks error");
            });
        return deferred.promise;
    };

    service.setCurrentProject = function(index) {
        currentProjectIndex = index;
        service.getProjectFromServer(projectList[index]);
        service.getProjectTasksFromServer(projectList[index]);
    };

    service.getCurrentProject = function() {
        return currentProject;
    };


    service.getProjectList = function() {
        return projectList;
    };

    service.getProjectTasks = function() {
        return projectTasks;
    };

    //get projects and tasks on initial load
    service.getProjectListFromServer()
        .then(function() {
            if(projectList.length > 0) {
                service.getProjectFromServer(projectList[currentProjectIndex]);
                service.getProjectTasksFromServer(projectList[currentProjectIndex]);
            }
        });

    return service;
});*/