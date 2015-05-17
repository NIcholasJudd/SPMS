/**
 * Created by scottmackenzie on 12/05/2015.
 */


myApp.controller("TaskCtrl", ['$scope', 'ProjectFactory', 'UserFactory', 'TaskFactory', '$window',
    function ($scope, ProjectFactory, UserFactory, TaskFactory, $window) {

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
                })
            })
            $scope.newTask.projectName = item;
        }

        $scope.setPriority = function (item) {
            $scope.newTask.priority = item;
        }

        $scope.setDependencies = function (item) {
            var linkArray = [];
            item.forEach(function(i) {
                linkArray.push({
                    source : i,
                    type : 'finish to start'
                });
            })
            $scope.newTask.dependencies = linkArray;
            console.log($scope.newTask.dependencies);
        }

        $scope.setRole = function (item, index) {
           $scope.assignedTeamMembers[index].roleName = item;
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
            $scope.selectedUser={};
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
            $scope.selectedUser={};
        }
        $scope.setUser = function (index) {
            console.log(searchEmail(index));
            if (searchEmail(index) != -1) {
                $scope.taskData.teamMembers.push({
                    name: $scope.selectedUser[index].name,
                    email: $scope.selectedUser[index].email
                })
                $scope.selectedUser.splice(index, 1);
            }
            console.log($scope.taskData.teamMembers);
        }

        function searchEmail(index) {
            if ($scope.taskData.teamMembers.length == 0) {
                return -1;
            }
            for (var i = 0; i < $scope.taskData.teamMembers.length; i++) {
                if ($scope.selectedUser[index].email == $scope.taskData.teamMembers[i].email) {
                    return 1;
                }
            }
            return -1;
        }

        $scope.submit = function () {
            if($scope.assignedTeamMembers.length === 0)
                $scope.newTask.status = 'unassigned';
            else
                $scope.newTask.status = 'on-the-go';
            console.log($scope.newTask);
            console.log($scope.assignedTeamMembers);
            TaskFactory.createTask($scope.newTask, $scope.assignedTeamMembers)
                .success(function(err, res) {
                    alert($scope.newTask.taskName + ' successfully saved in database');
                }).error(function(err, res) {
                    alert('insert failed');
                    /*var err_msg = "save project failed: ";
                    if(err.code == "23505")
                        err_msg += "that user already exists";
                    else
                        err_msg += err.detail;
                    alert(err_msg);*/
                })
        }
    }]);

