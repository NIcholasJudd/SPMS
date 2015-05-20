/**
 * Created by scottmackenzie on 20/05/15.
 */

myApp.controller("APNCtrl", ['$scope', '$window', 'ProjectFactory',
    function($scope, $window, ProjectFactory) {
        var tasks = [], dependencies = [];

        $scope.projectName = $window.sessionStorage.projectName;
        ProjectFactory.getTasks($scope.projectName).then(function(res) {
            res.data.forEach(function(task) {
                tasks.push({
                    number : task.task_number,
                    id : task.task_id,
                    name : task.task_name,
                    duration : task.likely_duration.days
                })
            });
            ProjectFactory.getLinks($scope.projectName).then(function(res) {
                res.data.forEach(function(link) {
                    dependencies.push({
                        id : link.link_id,
                        source : link.source,
                        target : link.target
                    })
                });
            })
        });

        $scope.tasks = tasks;
        $scope.dependencies = dependencies;
    }
]);