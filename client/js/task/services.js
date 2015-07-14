/**
 * Created by scottmackenzie on 4/07/2015.
 */

myApp.factory('TaskFactory', function($http, $q, baseUrl) {
    var service = {};

    service.getTask = function(taskId) {
        var deferred = $q.defer();
        $http.get(baseUrl + '/api/auth/task/' + taskId)
            .success(function(task) {
                deferred.resolve(task);
            })
            .error(function() {
                console.log("Error receiving task from the database");
                deferred.reject("getTask error");
            });
        return deferred.promise;
    }

    service.getProjectTasks = function(projectName) {
        var deferred = $q.defer();
        $http.get(baseUrl + '/api/auth/project/' + projectName + "/tasks", {params: {"fields[]" : ['"taskName"', '"taskId"']} })
            .success(function(tasks) {
                deferred.resolve(tasks);
            })
            .error(function() {
                console.log("Error receiving task from the database");
                deferred.reject("getTask error");
            });
        return deferred.promise;
    }

    service.getDependencies = function(taskId) {
        var deferred = $q.defer();
        $http.get(baseUrl + '/api/auth/link/' + taskId)
            .success(function(dependencies) {
                deferred.resolve(dependencies);
            })
            .error(function() {
                console.log("Error receiving dependencies from the database");
                deferred.reject("getDependencies error");
            });
        return deferred.promise;
    }

    service.getUserRoles = function(taskId) {
        var deferred = $q.defer();
        $http.get(baseUrl + '/api/auth/task/' + taskId + '/userRoles', {params: {"fields[]" : ['"firstName"', '"lastName", "roleName"']} })
            .success(function(dependencies) {
                deferred.resolve(dependencies);
            })
            .error(function() {
                console.log("Error receiving user roles from the database");
                deferred.reject("getUsers error");
            });
        return deferred.promise;
    }

    service.saveTask = function(task, projectName) {
        var deferred = $q.defer();
        $http.post(baseUrl + '/api/auth/project/' + projectName + '/task')
            .success(function(res) {
                console.log(res);
                deferred.resolve(res);
            })
            .error(function(err) {
                console.log("Error saving task: ", err);
                deferred.reject("getUsers error");
            });
        return deferred.promise;
    }

    return service;
})