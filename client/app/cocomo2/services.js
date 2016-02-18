
myApp.factory('cocomoFactory', function($http) {
    //$window.sessionStorage.project = {};//var currentProject = {};
    return {
        getCocomoScores : function(projectName) {
            return $http.get('http://localhost:3000/api/auth/project/' + projectName + '/cocomoScore');
        },

        saveCocomoScores : function(projectName, cocomoScores, personMonths, calculated) {
            return $http.put('http://localhost:3000/api/auth/project/' + projectName + '/cocomoScore', {
                cocomoScores : cocomoScores,
                personMonths : personMonths,
                calculated : calculated
            })
        }

    }
});
/**
 * Created by nicholasjudd on 18/02/2016.
 */
