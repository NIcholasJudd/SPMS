/**
 * Created by scottmackenzie on 12/05/15.
 */

myApp.controller("GanttChartCtrlOld", ['$scope', '$window', 'ProjectFactory',
    function($scope, $window, ProjectFactory) {
        /*$scope.$watch(function() {
            return ProjectFactory.getCurrentProject();
        },*/
           // function() {
                console.log($window.sessionStorage);
                $scope.projectName = $window.sessionStorage.projectName;//ProjectFactory.getCurrentProject().projectName;
                var tasks = {
                    data : [],
                    links : []
                }
                gantt.init("gantt");
                gantt.clearAll();
                if(tasks.data.length == 0)
                    console.log('empty');
                else
                    console.log('not empty');
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
                        gantt.config.readonly = true;
                        console.log('tasks', tasks);
                        gantt.parse(tasks);
                    })
                });


           // }, true);

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