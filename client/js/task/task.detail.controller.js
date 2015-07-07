/**
 * Created by scottmackenzie on 26/05/15.
 */
/**
 * Created by nicholasjudd on 20/05/15.
 */
myApp.controller("TaskDetailCtrl", ['$scope', 'ProjectFactory', 'UserFactory', 'TaskFactory', '$window',
    function ($scope, ProjectFactory, UserFactory, TaskFactory, $window) {
        $scope.Roles = ["Developer", "Tester", "Bug Fixer", "Analyst", "Graphic Designer", "Interface Designer", "Server Designer", "Database Engineer"];
        $scope.priorityLevel = ["critical", "high", "medium", "low"];
        $scope.curTaskDependencies=[];
        $scope.modifyTask = {};
        $scope.dependencies = [];
        $scope.projectData = {};
        $scope.search = {};
        $scope.depList=[];
        $scope.taskDependenciesAdd={};
        $scope.linksList = [];
        $scope.taskData = [];
        $scope.progress;
        $scope.searchTeamMembers = [];
        $scope.teamMembersList = [];
        $scope.selectedUser={};
        $scope.assignedTeamMembers = [];
        console.log($window.sessionStorage.taskId);
        /****   Form Functions  ****/
        $scope.clearDependencies = function () {
            $scope.dependencies = [];
        }

        /* TEST OF GET TASK ROLES, HARD CODED TO GET TASKS FOR task_id 9 */
        /*TaskFactory.getUserRoles(9).then(function(result) {
         console.log('task roles for task_id 9: ', result.data);
         })*/

        $scope.setPriority = function (item) {
            $scope.modifyTask.priority = item;
        }
        $scope.setDependencies = function (item) {
            var bool = false;
            for (var x = 0; x < $scope.depList.length; x++){
                if ($scope.depList[x].target == item[0].taskId || item[0].taskNumber == $window.sessionStorage.taskNumber){
                    bool = true;
                }
            }
            if (bool == false) {
                $scope.depList.push({
                    type: 'finish to start',
                    source: item[0].taskId,
                    target: $window.sessionStorage.taskId,
                    name: item[0].taskName,
                    projectName : $window.sessionStorage.projectName
                })
            }
        }

        function mapToType(type) {
            switch (type) {
                case 'finish to start' :
                    return 'finish to start';
                case 'start to start' :
                    return 1;
                case 'finish to finish' :
                    return 2;
                case 'start to finish' :
                    return 3;
            }
        }

        UserFactory.getUsers().then(function (results) {
            results.data.forEach(function (user) {
                $scope.searchTeamMembers.push({
                    name: user.first_name + ' ' + user.last_name,
                    email: user.email
                })
                $scope.teamMembersList.push({
                    name: user.first_name + ' ' + user.last_name,
                    email: user.email,
                    skill: user.user_type,
                    role: user.previous_roles,
                    performanceIndex: user.performance_index
                })
            })
        })

        //TaskFactory.getCurrentTask($window.sessionStorage.projectName, $window.sessionStorage.taskNumber).then(function (results) {
        TaskFactory.getTask($window.sessionStorage.taskId).then(function (task) {
            //results.data.forEach(function (task.data) {
            console.log("TASK.data: ", task.data);
            $scope.modifyTask.taskId = task.data.task_id;
            $scope.modifyTask.taskNumber = task.data.task_number;
            $scope.modifyTask.projectName = task.data.project_name;
            $scope.modifyTask.taskName = task.data.task_name;
            $scope.modifyTask.taskDescription = task.data.description;
            $scope.modifyTask.taskStartDate = task.data.start_date;
            $scope.modifyTask.taskLikelyDuration = task.data.likely_duration.days;
            $scope.modifyTask.taskOptimisticDuration = task.data.optimistic_duration.days;
            $scope.modifyTask.taskPessimisticDuration = task.data.pessimistic_duration.days;
            $scope.modifyTask.taskComfortZone = task.data.comfort_zone.days;
            $scope.modifyTask.progress = task.data.progress_percentage * 100;
            $scope.modifyTask.status = task.data.status;
            $scope.modifyTask.dependencies = [];
            $scope.modifyTask.priority = task.data.priority;
            $scope.modifyTask.parentId = task.data.parent_id;
            // })
        })

        TaskFactory.getUserRoles($window.sessionStorage.taskId).then(function (results) {
            console.log("TEST",$window.sessionStorage.taskId);
            console.log(results);
            results.data.forEach(function (user) {
                $scope.assignedTeamMembers.push({
                    name: user.first_name + ' ' + user.last_name,
                    email: user.email,
                    roleName: user.role_name
                })
                for (var i = 0; i < $scope.searchTeamMembers.length; i++){
                    if($scope.searchTeamMembers[i].email == user.email){
                        $scope.searchTeamMembers.splice(i, 1);
                    }
                }
            })
        })
        ProjectFactory.getTasks($window.sessionStorage.projectName).then(function (results) {
            results.data.forEach(function (tasks) {
                $scope.taskData.push({
                    taskId: tasks.task_id,
                    taskNumber: tasks.task_number,
                    projectName: tasks.project_name,
                    taskName: tasks.task_name,
                    taskDescription: tasks.description,
                    startDate: tasks.start_date,
                    likelyDuration: tasks.likely_duration,
                    optimisticDuration: tasks.optimistic_duration,
                    pessimisticDuration: tasks.pessimistic_duration,
                    comfortZone : tasks.comfort_zone,
                    progress: tasks.progress_percentage,
                    status: tasks.status,
                    teamMembers: [],
                    priority: tasks.priority,
                    parentId: tasks.parent_id
                })
            })
        })

        ProjectFactory.getLinks($window.sessionStorage.projectName).then(function (res) {
            console.log('links result', res.data);
            res.data.forEach(function (link) {
                if (link.target == $window.sessionStorage.taskId) {
                    $scope.linksList.push({
                        source: link.source,
                        type: mapToType(link.type)
                    });
                    console.log("linksList: ", $scope.linksList);
                    console.log("links: ", link);
                    $scope.dependencies.push({
                        source: link.source,
                        target: link.target,
                        type: mapToType(link.type)
                    });
                    buildList(link.source);
                    console.log("Dependencies: ", $scope.dependencies);
                }

            });
        })

        function buildList(source){
            ProjectFactory.getTasks($window.sessionStorage.projectName).then(function (results) {
                results.data.forEach(function (tasks) {
                    if (tasks.task_id == source){
                        $scope.depList.push({
                            type:'finish to start',
                            source: source,
                            target: tasks.task_id,
                            name: tasks.task_name,
                            projectName : $window.sessionStorage.projectName
                        })
                    }
                })
            })
        }
        $scope.setRole = function (item, index) {
            $scope.assignedTeamMembers[index].roleName = item;
        }
        $scope.getCurrentProject = function () {
            return $window.sessionStorage.projectName;
        }

        $scope.updateProgress = function(taskId, progressPercentage) {
            if(!progressPercentage) {
                alert("Progress percentage must be in range 0-100");

            }
            else {
                TaskFactory.updateProgress(taskId, progressPercentage / 100).then(function(res) {
                    if(res)
                        alert("Task " + taskId + " updated successfully");
                    else
                        alert("Task update failed");
                })
            }
        }
    }
])
;