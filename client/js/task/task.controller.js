/**
 * Created by scottmackenzie on 12/05/2015.
 */


myApp.controller("TaskCtrl", ['$scope', 'ProjectFactory', 'UserFactory', '$window',
    function ($scope, ProjectFactory, UserFactory, $window) {

        $scope.countOnTheGo = {
            title: "On The Go",
            value: 0
        };
        $scope.countToBeDone = {
            title: "To Be Done",
            value: 0
        };
        $scope.countAwaitingApproval = {
            title: "Awaiting Approval",
            value: 0
        };
        $scope.priorityLevel = ["Critical", "High", "Medium", "Low"];
        $scope.Roles = ["Developer", "Tester", "Bug Fixer", "Analyst", "Graphic Designer", "Interface Designer", "Server Designer", "Database Engineer"];
        $scope.selectedUser = {
            name: null,
            email: null,
            indexValue: null
        };
        $scope.search = {
            name: null,
            skill: null,
            role: null,
            performanceIndex: null
        }
        $scope.assignedTeamMembers = [];
        $scope.searchTeamMembers = [];
        $scope.taskData = [];
        $scope.projectData = [];
        $scope.newTask = {};
        $scope.dependencies = [];
        $scope.dependenciesList = [];
        ProjectFactory.getProjects().then(function (projects) {
            projects.data.forEach(function (projects) {
                $scope.projectData.push({
                    projectName: projects.project_name
                });
            });
        });
        UserFactory.getUserTasks($window.sessionStorage.user).then(function (results) {
            console.log('tasks: ', results);
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
        UserFactory.getUsers().then(function (results) {
            console.log('HERE:', results.data);
            results.data.forEach(function (user) {
                $scope.searchTeamMembers.push({
                    name: user.first_name + ' ' + user.last_name,
                    email: user.email
                })
            });
        })
        $scope.setProjectName = function (item) {
            $scope.taskData = [];
            $scope.dependencies = [];
            $scope.dependenciesList = [];
            ProjectFactory.getTasks(item).then(function (results) {
                console.log('tasks: ', results);
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
                    $scope.dependenciesList.push({
                        taskId: tasks.task_id,
                        taskNumber: tasks.task_number,
                        taskName: tasks.task_name,
                        projectName: tasks.project_name
                    })
                })
            })
            $scope.newTask.projectName = item;
        }

        $scope.setPriority = function (item) {
            $scope.newTask.priority = item;
        }

        $scope.setDependencies = function (item) {
            var bool = true;
            var count = 0;
            for (var i = 0; i < $scope.dependencies.length; i++) {
                if ($scope.dependencies[i].taskId == $scope.dependenciesList[item - 1].taskId) {
                    bool = false;
                }
            }
            if (bool == true) {
                $scope.dependencies.push(
                    {
                        projectName: $scope.dependenciesList[item-1].projectName,
                        taskId: $scope.dependenciesList[item - 1].taskId,
                        taskName: $scope.dependenciesList[item - 1].taskName
                    })
                console.log($scope.dependenciesList)
            }
        }

        $scope.clearDependencies = function() {
            $scope.dependencies =[];
        }

        $scope.setRole = function (item, index) {
            $scope.assignedTeamMembers[index].role = item;
        }

        $scope.taskPriority = function ($index) {
            if ($scope.taskData[$index].priority == 'critical') {
                return 'panel panel-danger';
            } else if ($scope.taskData[$index].priority == 'medium') {
                return 'panel panel-warning';
            } else {
                return 'panel panel-info';
            }
        }
        function countTasks() {
            for (var i = 0; i < $scope.taskData.length; i++) {
                if ($scope.taskData[i].status == "on-the-go") {
                    $scope.countOnTheGo.value += Number(1);
                } else if ($scope.taskData[i].status == "finalised") {
                    $scope.countAwaitingApproval += Number(1);
                }
            }
        }

        $scope.setTMS = function (index) {
            $scope.selectedUser.name = $scope.searchTeamMembers[index].name;
            $scope.selectedUser.email = $scope.searchTeamMembers[index].email;
            $scope.selectedUser.indexValue = Number(index);
        }
        $scope.setTMA = function (index) {
            console.log($scope.assignedTeamMembers);
            console.log($scope.selectedUser);
            console.log(index);
            $scope.selectedUser.name = $scope.assignedTeamMembers[index].name;
            $scope.selectedUser.email = $scope.assignedTeamMembers[index].email;
            $scope.selectedUser.indexValue = index;
        }

        $scope.addUserToTask = function () {
            $scope.assignedTeamMembers.push(
                {
                    name: $scope.selectedUser.name,
                    email: $scope.selectedUser.email
                })
            $scope.searchTeamMembers.splice($scope.selectedUser.indexValue, 1);
            $scope.selectedUser = {};
        }

        $scope.removeUserFromTask = function (index) {
            $scope.selectedUser.name = $scope.assignedTeamMembers[index].name;
            $scope.selectedUser.email = $scope.assignedTeamMembers[index].email;
            $scope.selectedUser.indexValue = index;
            $scope.searchTeamMembers.push(
                {
                    name: $scope.selectedUser.name,
                    email: $scope.selectedUser.email
                })
            $scope.assignedTeamMembers.splice($scope.selectedUser.indexValue, 1);
            $scope.selectedUser = {};
        }

        $scope.submit = function () {
            console.log($scope.newTask);
            console.log($scope.assignedTeamMembers);
        }
    }]);

