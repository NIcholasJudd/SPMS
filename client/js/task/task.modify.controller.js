/**
 * Created by nicholasjudd on 20/05/15.
 */
myApp.controller("TaskModCtrl", ['$scope', 'ProjectFactory', 'UserFactory', 'TaskFactory', '$window',
    function ($scope, ProjectFactory, UserFactory, TaskFactory, $window) {

        $scope.modifyTask = {};
        $scope.dependencies = [];
        $scope.projectData = {};
        $scope.search = {};

        /****   Form Functions  ****/
        $scope.clearDependencies = function () {
            $scope.dependencies = [];
        }

        $scope.setDependencies = function (item) {
            var bool = false
            var count = 0;
            var linkArray = [];
            item.forEach(function (i) {
                linkArray.push({
                    source: i.taskId,
                    type: 'finish to start'
                });
            })
            $scope.newTask.dependencies = linkArray;
            for (var i = 0; i < $scope.dependencies.length; i++) {
                if ($scope.dependencies[i].taskId == item[0].taskId) {
                    bool = true;
                }
            }
            if (bool == false) {
                count = Number(item.taskNumber - 1);
                $scope.dependencies.push({
                    taskName: item[0].taskName,
                    taskId: item[0].taskId
                })
            }
            console.log(item);
        }

        TaskFactory.getCurrentTask($window.sessionStorage.projectName, $window.sessionStorage.taskNumber).then(function (results) {
            console.log($window.sessionStorage.projectName + " " + $window.sessionStorage.taskNumber);
            results.data.forEach(function (tasks) {
                console.log("its a mother fucking mother flipping god dam fucking test statement");
                console.log('tasks: ', tasks);
                $scope.modifyTask.push({
                    taskId: tasks.task_id,
                    taskNumber: tasks.task_number,
                    projectName: tasks.project_name,
                    taskName: tasks.task_name,
                    taskDescription: tasks.description,
                    startDate: tasks.start_date,
                    likelyDuration: tasks.likely_duration,
                    optimisticDuration: tasks.optimistic_duration,
                    pessimisticDuration: tasks.pessimistic_duration,
                    progress: tasks.progress_percentage,
                    status: tasks.status,
                    teamMembers: [],
                    priority: tasks.priority,
                    parentId: tasks.parent_id
                })
                console.log('tasks: ',$scope.modifyTask);
            })
        })

        $scope.setRole = function (item, index) {
            $scope.assignedTeamMembers[index].roleName = item;
        }

        $scope.getCurrentProject = function () {
            return $window.sessionStorage.projectName;
        }
    }
])
;