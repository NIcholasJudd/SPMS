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

    return service;
})