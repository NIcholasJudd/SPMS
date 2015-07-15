/**
 * Created by scottmackenzie on 8/07/15.
 */

myApp.controller("GanttChartCtrl", ['$scope', '$stateParams',
    function($scope, $stateParams) {
        $scope.project = $stateParams.projectName;
    }
]);