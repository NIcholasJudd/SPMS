/**
 * Created by scottmackenzie on 2/07/2015.
 */

myApp.factory('PMDashboard', function($http, $q, baseUrl) {
    var service = {};
    var currentProject = {};
    var projects = [];

    service.getProjects = function() {
        var deferred = $q.defer();
        $http.get(baseUrl + '/api/auth/projects')
            .success(function(data) {
                projects = data;
                if(projects.length > 0)
                    currentProject = projects[0];
                deferred.resolve(projects);
            })
            .error(function() {
                console.log("Error receiving projects from the database");
                deferred.reject("getProjects error");
            });
        return deferred.promise;
    }

    service.setCurrentProject = function(project) {
        currentProject = project;
    }

    service.getCurrentProject = function() {
        return currentProject;
    }

    service.getCurrentTasks = function() {
        var deferred = $q.defer();
        $http.get(baseUrl + '/api/auth/project/' + currentProject.projectName + '/tasks/')
            .success(function(tasks) {
                deferred.resolve(tasks);
            })
            .error(function() {
                console.log("Error receiving tasks from the database");
                deferred.reject("getCurrentTasks error");
            })
        return deferred.promise;
    }

    return service;
});
