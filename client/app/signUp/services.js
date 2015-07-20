/**
 * Created by nicholasjudd on 20/07/15.
 */
myApp.factory('signUp', function($http, $q, $rootScope, $window, baseUrl) {
    var service = {};
    var plans = [];
    service.getPlansListFromServer = function () {
        plans = [
            {
                name: "Plan 1",
                userLimit: 10,
                price: 10,
                id: 01
            },
            {
                name: "Plan 2",
                userLimit: 15,
                price: 50,
                id: 02
            },
            {
                name: "Plan 3",
                userLimit: 20,
                price: 100,
                id: 03
            },
            {
                name: "Plan 4",
                userLimit: 25,
                price: 15,
                id: 04
            }
        ];
        console.log(plans);
        return plans;
    }
    return service;
});