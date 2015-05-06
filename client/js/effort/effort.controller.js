/**
 * Created by scottmackenzie on 6/05/15.
 */
myApp.controller("EffortCtrl", ['$scope', '$location',
    function($scope, $location) {
        $scope.ctrlName = "EffortCtrl";
        /* $scope.go allows you to go to the results page from input page */
        $scope.go = function(path) {
            $location.path(path);
        }
    }
]);