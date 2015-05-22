/**
 * Created by nicholasjudd on 20/05/15.
 */
myApp.controller("TaskModCtrl", ['$scope', 'ProjectFactory', 'UserFactory', 'TaskFactory', '$window',
    function ($scope, ProjectFactory, UserFactory, TaskFactory, $window) {
        $scope.Roles = ["Developer", "Tester", "Bug Fixer", "Analyst", "Graphic Designer", "Interface Designer", "Server Designer", "Database Engineer"];
        $scope.priorityLevel = ["critical", "high", "medium", "low"];

        $scope.modifyTask = {};
        $scope.dependencies = [];
        $scope.projectData = {};
        $scope.search = {};
        $scope.linksList = [];
        $scope.taskData = [];
        $scope.dependencies = [];
        $scope.searchTeamMembers = [];
        $scope.teamMembersList = [];
        $scope.assignedTeamMembers = [];
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
            var bool = false
            var count = 0;
            var linkArray = [];
            linkArray = $scope.modifyTask.dependencies;
            item.forEach(function (i) {
                linkArray.push({
                    source: i.taskId,
                    type: 'finish to start'
                });
            })
            $scope.modifyTask.dependencies = linkArray;
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

        TaskFactory.getCurrentTask($window.sessionStorage.projectName, $window.sessionStorage.taskNumber).then(function (results) {
            results.data.forEach(function (tasks) {
                console.log("TASKS: ", tasks);
                $scope.modifyTask.taskId = tasks.task_id;
                $scope.modifyTask.taskNumber = tasks.task_number;
                $scope.modifyTask.projectName = tasks.project_name;
                $scope.modifyTask.taskName = tasks.task_name;
                $scope.modifyTask.taskDescription = tasks.description;
                $scope.modifyTask.taskStartDate = tasks.start_date;
                $scope.modifyTask.taskLikelyDuration = tasks.likely_duration.days;
                $scope.modifyTask.taskOptimisticDuration = tasks.optimistic_duration.days;
                $scope.modifyTask.taskPessimisticDuration = tasks.pessimistic_duration.days;
                $scope.modifyTask.progress = tasks.progress_percentage;
                $scope.modifyTask.status = tasks.status;
                $scope.modifyTask.dependencies = [];
                $scope.modifyTask.priority = tasks.priority;
                $scope.modifyTask.parentId = tasks.parent_id;
            })
            TaskFactory.getUserRoles($scope.modifyTask.taskId).then(function (results) {
                results.data.forEach(function (user) {
                    console.log(user);
                    $scope.assignedTeamMembers.push({
                        name: user.first_name + ' ' + user.last_name,
                        email: user.email,
                        roleName: user.role_name
                    })
                })
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
                    progress: tasks.progress_percentage,
                    status: tasks.status,
                    teamMembers: [],
                    priority: tasks.priority,
                    parentId: tasks.parent_id
                })
            })
        })

        ProjectFactory.getLinks($window.sessionStorage.projectName).then(function (res) {
            res.data.forEach(function (link) {
                console.log(link.target + " " + $scope.modifyTask.taskId)
                if (link.target == 3) {
                    $scope.linksList.push({
                        source: link.source,
                        type: mapToType(link.type)
                    })
                    $scope.dependencies.push({
                        source: link.source,
                        type: mapToType(link.type)
                    })
                }
            });
        })


        $scope.setRole = function (item, index) {
            $scope.assignedTeamMembers[index].roleName = item;
        }
        $scope.getCurrentProject = function () {
            return $window.sessionStorage.projectName;
        }

        $scope.search = function () {
            var nameBool = false;
            var skillBool = false;
            var roleBool = false;
            var preformanceBool = false;
            if (typeof $scope.search.Name == "undefined" || $scope.search.Name == "") {
                nameBool = true;
            }
            if (typeof $scope.search.skill == "undefined" || $scope.search.skill == "") {
                skillBool = true;
            }
            if (typeof $scope.search.role == "undefined" || $scope.search.role == "") {
                roleBool = true;
            }
            if (typeof $scope.search.performanceIndex == "undefined" || $scope.search.performanceIndex == 0) {
                preformanceBool = true;
            }

            for (var i = 0; i < $scope.teamMembersList.length; i++) {
                console.log($scope.search.Name + " " + $scope.teamMembersList[i].name);
                if ($scope.search.Name == $scope.teamMembersList[i].name || nameBool == true) {
                    if ($scope.search.skill == $scope.teamMembersList[i].skill || skillBool == true) {
                        if ($scope.search.role == $scope.teamMembersList[i].role || roleBool == true) {
                            console.log($scope.search.performanceIndex);
                            console.log($scope.teamMembersList[i].performanceIndex);
                            if ($scope.search.performanceIndex <= $scope.teamMembersList[i].performanceIndex || preformanceBool == true) {
                                console.log("preformance Check");
                                $scope.searchTeamMembers.push({
                                    name: $scope.teamMembersList[i].name,
                                    email: $scope.teamMembersList[i].email
                                })
                            }
                        }
                    }
                }
            }
            $scope.searchUser = {};
        }
        $scope.submit = function () {
            //calculate project duration
            var date = new Date($scope.modifyTask.taskStartDate);
            $scope.modifyTask.taskStartDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear();
            console.log("DATE YA CUNT " ,$scope.modifyTask.taskStartDate);
            console.log("Task Data: " ,$scope.modifyTask);
            console.log("Team: " , $scope.assignedTeamMembers);
            console.log("dep: " , $scope.taskDependencies);
            TaskFactory.updateTask($scope.modifyTask, $scope.assignedTeamMembers, $scope.taskDependencies)
                .success(function (err, res) {
                    alert($scope.projectData.projectName + ' successfully updated in database');
                }).error(function (err, res) {
                    var err_msg = "updated project failed: ";
                    if (err.code == "23505")
                        err_msg += "that project dosent exists";
                    else
                        err_msg += err.detail;
                    alert(err_msg);
                })
        };
    }
])
;