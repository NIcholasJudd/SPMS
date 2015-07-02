/**
 * Created by scottmackenzie on 2/07/2015.
 */

myApp.factory('PMDashboard', function($http, $q) {
    var service = {};
    var currentProject = '';
    var projects = [];

    service.getProjects = function() {
        var deferred = $q.defer();
        $http.get('http://localhost:3000/api/auth/projects')
            .success(function(data) {
                projects = data;
                deferred.resolve(projects);
            })
            .error(function() {
                console.log("Error receiving projects from the database");
                deferred.reject("There was an error.");
            });
        return deferred.promise;
    }

    service.setCurrentProject = function(project) {
        currentProject = project;
    }

    service.getCurrentProject = function() {
        return currentProject;
    }

    return service;
});
