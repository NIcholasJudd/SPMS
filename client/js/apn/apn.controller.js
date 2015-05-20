/**
 * Created by scottmackenzie on 20/05/15.
 */

myApp.controller("APNCtrl", ['$scope', 'ProjectFactory',
    function($scope, ProjectFactory) {
        var tasks = [], dependencies = [];
        $scope.$watch(function() {
                return ProjectFactory.getCurrentProject();
            },
            function() {
                $scope.projectName = ProjectFactory.getCurrentProject().projectName;
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
            }, true);

        $scope.tasks = tasks;
        $scope.dependencies = dependencies;
    }
]);