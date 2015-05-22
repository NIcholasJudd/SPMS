/**
 * Created by scottmackenzie on 22/05/2015.
 */

myApp.controller('PERTCtrl', ['$scope', '$window', '$q', 'ProjectFactory',
    function($scope, $window, $q, ProjectFactory) {

        var getTasks = function() {
            var deferred = $q.defer();
            ProjectFactory.getTasks($window.sessionStorage.projectName).then(function (result) {
                return deferred.resolve(result.data);
            })
            return deferred.promise;
        };

        var getLinks = function() {
            var deferred = $q.defer();
            ProjectFactory.getLinks($window.sessionStorage.projectName).then(function (result) {
                return deferred.resolve(result.data);
            })
            return deferred.promise;
        }

        var calculatePert = function() {
            $q.all([getTasks(), getLinks()]).then(function(result) {
                var tasks = result[0];
                var links = result[1];
                console.log(tasks);
                console.log(links);
            });
        };

        $scope.$watch(function() { return $window.sessionStorage.projectName},
        function() {
            calculatePert();
        });


    }
]);
