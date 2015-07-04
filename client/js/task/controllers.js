/**
 * Created by scottmackenzie on 4/07/2015.
 */

myApp.controller("TaskModifyCtrl", ['$scope', '$stateParams', 'TaskFactory',
        function($scope, $stateParams, TaskFactory) {

            $scope.task = {};

            TaskFactory.getTask($stateParams.taskId)
                .then(function(task) {
                    $scope.task = task;
                })
        }]
);