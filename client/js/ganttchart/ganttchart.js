/**
 * Created by scottmackenzie on 12/05/15.
 */

myApp.controller("GanttChartCtrl", ['$scope', 'ProjectFactory',
    function($scope, ProjectFactory) {
        $scope.name = "Test that controller is working";

        /*$scope.$watch(function() {
            return ProjectFactory.getCurrentProject();
        },
            function() {
                console.log('WATCH WORKING')
            }, true);*/

        $scope.projectName = ProjectFactory.getCurrentProject().projectName;
        var tasks = {
            data : [],
            links : []
        }
        console.log('!!:', $scope.projectName);
        ProjectFactory.getTasks($scope.projectName).then(function(res) {
            console.log('!!');
            res.data.forEach(function(task) {
                tasks.data.push({
                    id : task.task_id,
                    text : task.task_name,
                    start_date : new Date(task.start_date),
                    duration : task.likely_duration.days,
                    progress : task.progress
                })
            });
            //console.log('data: ', data);
            ProjectFactory.getLinks($scope.projectName).then(function(res) {
                console.log(1);
                res.data.forEach(function(link) {
                    tasks.links.push({
                        id : link.link_id,
                        source : link.source,
                        target : link.target,
                        type : mapToType(link.type)
                    })
                });
                console.log('tasks', tasks);
                gantt.init("gantt");
                gantt.parse(tasks);

            })
        });
        function mapToType(type) {
            switch(type) {
                case 'finish to start' : return 0;
                case 'start to start' : return 1;
                case 'finish to finish' : return 2;
                case 'start to finish' : return 3;
            }
        }
    }
]);