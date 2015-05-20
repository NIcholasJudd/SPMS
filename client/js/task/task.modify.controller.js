/**
 * Created by nicholasjudd on 20/05/15.
 */
myApp.controller("TaskModCtrl", ['$scope', 'ProjectFactory', 'UserFactory', 'TaskFactory', '$window',
    function ($scope, ProjectFactory, UserFactory, TaskFactory, $window) {

        $scope.modifyTask = {};
        $scope.dependencies = [];
        $scope.projectData = {};
        $scope.search = {};
        $scope.linksList = [];
        $scope.taskData = [];
        $scope.dependencies = [];
        $scope.searchTeamMembers = [];
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
                    return 0;
                case 'start to start' :
                    return 1;
                case 'finish to finish' :
                    return 2;
                case 'start to finish' :
                    return 3;
            }
        }
        UserFactory.getUsers().then(function (results) {
            console.log('HERE:', results.data);
            results.data.forEach(function (user) {
                $scope.searchTeamMembers.push({
                    name: user.first_name + ' ' + user.last_name,
                    email: user.email
                })
            })
        })

        TaskFactory.getCurrentTask($window.sessionStorage.projectName, $window.sessionStorage.taskNumber).then(function (results) {
            results.data.forEach(function (tasks) {
                $scope.modifyTask.taskId = tasks.task_id;
                $scope.modifyTask.taskNumber = tasks.task_number;
                $scope.modifyTask.projectName = tasks.project_name;
                $scope.modifyTask.taskName = tasks.task_name;
                $scope.modifyTask.taskDescription = tasks.description;
                $scope.modifyTask.startDate = tasks.start_date;
                $scope.modifyTask.likelyDuration = tasks.likely_duration;
                $scope.modifyTask.optimisticDuration = tasks.optimistic_duration;
                $scope.modifyTask.pessimisticDuration = tasks.pessimistic_duration;
                $scope.modifyTask.progress = tasks.progress_percentage;
                $scope.modifyTask.status = tasks.status;
                $scope.modifyTask.priority = tasks.priority;
                $scope.modifyTask.parentId = tasks.parent_id;
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
            console.log($scope.taskData);
        })

        ProjectFactory.getLinks($window.sessionStorage.projectName).then(function (res) {
            res.data.forEach(function (link) {
                console.log(link.target + " " + $scope.modifyTask.taskId)
                if (link.target == 3) {
                    $scope.linksList.push({
                        id: link.link_id,
                        source: link.source,
                        target: link.target,
                        type: mapToType(link.type)
                    })
                }
            });
            console.log($scope.linksList.length);
            assignDependencies()
        })

        function assignDependencies() {
            for (var i = 0; i < $scope.linksList.length; i++) {
                for (var x = 0; x < $scope.taskData.length; x++) {
                    if ($scope.linksList[i].source == $scope.taskData[x].taskId) {
                        console.log("GAY PANTS");
                        $scope.dependencies.push(
                            {
                                taskName: $scope.taskData[x].taskName,
                                taskId: $scope.taskData[x].taskId,
                                taskNumber: $scope.taskData[x].taskNumber
                            });
                    }
                }
            }
        };
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
    }
])
;