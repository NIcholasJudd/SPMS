/**
 * Created by nicholasjudd on 22/02/2016.
 */
myApp.factory('effortEstimation', function($http) {
    //$window.sessionStorage.project = {};//var currentProject = {};
    return {
        getFunctionPointData: function (projectName) {
            return $http.get('http://localhost:3000/api/auth/project/' + projectName + '/functionPoint');
        },

        saveFunctionPointData: function (projectName, adjustedFP, valueArray, functionCounts, calculated) {
            return $http.put('http://localhost:3000/api/auth/project/' + projectName + '/functionPoint', {
                adjustedFP: adjustedFP,
                valueArray: valueArray,
                calculated: calculated,
                functionCounts: functionCounts
            })
        }
    }
});