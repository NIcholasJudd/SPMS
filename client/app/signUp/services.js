/**
 * Created by nicholasjudd on 20/07/15.
 */
myApp.factory('signUp', function ($http, $q, $rootScope, $window, baseUrl) {
    var service = {};
    var plansList = [];
    var plans = [];
    var plan = {};
    var userExists = {};
    service.getPlanListFromServer = function () {
        var deferred = $q.defer();
        $http.get(baseUrl + '/plans')
            .success(function (data) {
                data.forEach(function (data) {
                    plansList.push(data);
                })
                deferred.resolve(plansList);
            })
            .error(function () {
                console.log("Error receiving projectList from the database");
                deferred.reject("getProjectList error");
            })
            .then(function () {
                plans = plansList;
                return plans;
            });
        return deferred.promise;
    };

    service.checkIfUserExists = function (email) {
        var deferred = $q.defer();
        $http.get(baseUrl + '/users/' + email)
            .success(function () {
                userExists = true;
                deferred.resolve(userExists);
            })
            .error(function () {
                userExists = false;
                deferred.reject(userExists);
            });
        return deferred.promise;
    };

service.getPlanListFromServer()
    .then(function (result) {
        plansList = result;
        return plansList;
    });


service.getPlanList = function () {
    return plansList;
};

service.getFirstPlan = function () {
    return plan;
};


return service;
})
;