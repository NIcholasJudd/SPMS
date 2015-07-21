/**
 * Created by nicholasjudd on 20/07/15.
 */
myApp.factory('signUp', function($http, $q, $rootScope, $window, baseUrl) {
    var service = {};
    var plans = [];
    service.getPlansListFromServer = function () {
        var deferred = $q.defer();
        $http.get(baseUrl + '/plan')
            .success(function(data) {
                plans = data;
                deferred.resolve(plans);
            })
            .error(function() {
                console.log("Error receiving projectList from the database");
                deferred.reject("getProjectList error");
            });
        return deferred.promise;
    };
    return service;
});