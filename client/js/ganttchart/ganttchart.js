/**
 * Created by scottmackenzie on 12/05/15.
 */

myApp.controller("GanttChartCtrl", ['$scope', 'ProjectFactory',
    function($scope, ProjectFactory) {
        $scope.name = "Test that controller is working";
        $scope.projectName = "My Project 1";
        var tasks = {
            data : [],
            links : []
        }
        //var data = [];
        //var links = [];
        ProjectFactory.getTasks($scope.projectName).then(function(res) {
           // console.log("Error: ", err);
            //console.log(res.data);
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
                console.log(tasks);
                gantt.init("gantt");
                gantt.parse(tasks);

            })
        });

        /*var tasks =  {
            data:[
                {id:1, text:"Project #2", start_date:"01-04-2013", duration:18,order:10,
                    progress:0.4, open: true},
                {id:2, text:"Task #1",    start_date:"02-04-2013", duration:8, order:10,
                    progress:0.6, parent:1},
                {id:3, text:"Task #2",    start_date:"11-04-2013", duration:8, order:20,
                    progress:0.6, parent:1}
            ],
            links:[
                { id:1, source:1, target:2, type:"1"},
                { id:2, source:2, target:3, type:"0"},
                { id:3, source:3, target:2, type:"2"},
                { id:4, source:2, target:5, type:"2"},
            ]
        };*/

        //gantt.config.readonly = true;
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