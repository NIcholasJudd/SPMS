/**
 * Created by nicholasjudd on 20/07/15.
 */
myApp.factory('signUp', function($http, $q, $rootScope, $window, baseUrl) {
    var service = {};
    var plansList = [];
    var plans = [];
    var plan = {};

    service.getPlanListFromServer = function() {
        var deferred = $q.defer();
        $http.get(baseUrl + '/plans')
            .success(function(data) {
                data.forEach(function(data) {
                    plansList.push(data);
                })
                deferred.resolve(plansList);
            })
            .error(function() {
                console.log("Error receiving projectList from the database");
                deferred.reject("getProjectList error");
            })
            .then(function() {
                plans = plansList;
                return plans;
            });
        return deferred.promise;
    };

    service.getFirstPlanFromServer = function() {
        var deferred = $q.defer();
        $http.get(baseUrl + '/plans/'+ 'testPlan1')
            .success(function(data) {
                console.log(plan);
                plan = data;
                deferred.resolve(plan);
            })
            .error(function() {
                console.log("Error receiving projectList from the database");
                deferred.reject("getProjectList error");
            })
            .then(function() {
                return plan;
            });
        return deferred.promise;
    };
    service.getFirstPlanFromServer()
        .then(function(result) {
            plan = result;
            return plan;
        });

    service.getPlanListFromServer()
        .then(function(result) {
            plansList = result;
            return plansList;
        });

    service.getPlanList = function() {
        return plansList;
    };

    service.getFirstPlan = function() {

        return plan;
    };



    return service;
});