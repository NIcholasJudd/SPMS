/**
 * Created by nicholasjudd on 20/05/15.
 */
myApp.controller("TaskCreateCtrl", ['$scope', 'ProjectFactory', 'UserFactory', 'TaskFactory', '$window',
    function ($scope, ProjectFactory, UserFactory, TaskFactory, $window) {
        /*********  JSON Objects ********/
        $scope.Roles = ["Developer", "Tester", "Bug Fixer", "Analyst", "Graphic Designer", "Interface Designer", "Server Designer", "Database Engineer"];
        $scope.priorityLevel = ["Critical", "High", "Medium", "Low"];
        $scope.newTask = {};
        $scope.taskData = [];
        $scope.taskDependencies = [];
        $scope.assignedTeamMembers = [];
        $scope.searchTeamMembers = [];
        $scope.teamMembersList = [];
        $scope.dependencies = [];
        $scope.Names = [];
        $scope.selectedUser = {
            name: null,
            email: null,
            indexValue: null
        };


        /*******    Functions    *********/
        $scope.getCurrentProject = function () {
            $scope.newTask.projectName = $window.sessionStorage.projectName;
            return $window.sessionStorage.projectName;
        }
        $scope.clearDependencies = function () {
            $scope.dependencies = [];
        }
        $scope.setPriority = function (item) {
            $scope.newTask.priority = item;
        }

        /******* dependencies *********/
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
            $scope.taskDependencies = linkArray;
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
        }
        $scope.setTMS = function (index) {
            $scope.selectedUser.name = $scope.searchTeamMembers[index].name;
            $scope.selectedUser.email = $scope.searchTeamMembers[index].email;
            $scope.selectedUser.indexValue = Number(index);
        }
        $scope.setTMA = function (index) {
            $scope.selectedUser.name = $scope.assignedTeamMembers[index].name;
            $scope.selectedUser.email = $scope.assignedTeamMembers[index].email;
            $scope.selectedUser.indexValue = index;
        }

        $scope.addUserToTask = function () {
            if ($scope.selectedUser.email == null){
                return;
            }
            $scope.assignedTeamMembers.push(
                {
                    name: $scope.selectedUser.name,
                    email: $scope.selectedUser.email,
                    roleName: null
                })
            $scope.searchTeamMembers.splice($scope.selectedUser.indexValue, 1);
        }

        $scope.setRole = function (item, index) {
            console.log(item);
            $scope.assignedTeamMembers[index].roleName = item;
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

        /********   Factory Calls ********/
        ProjectFactory.getTasks($window.sessionStorage.projectName).then(function (results) {
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
                    comfortZone : tasks.comfort_zone,
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
                $scope.teamMembersList.push({
                    name: user.first_name + ' ' + user.last_name,
                    email: user.email,
                    skill: user.user_type,
                    role: user.previous_roles,
                    performanceIndex: user.performance_index
                })
               /* $scope.Names.push({
                    label: user.first_name + ' ' + user.last_name,
                    value: user.email
                });*/
            })
        })
        /*********  submit function **********/
        $scope.submit = function () {
            if ($scope.assignedTeamMembers.length === 0)
                $scope.newTask.status = 'unassigned';
            else
                $scope.newTask.status = 'on-the-go';
            console.log("TEST TASK DATA: " , $scope.newTask);
            console.log("TEAM MEMBERS: " , $scope.assignedTeamMembers);
            console.log($scope.taskDependencies);
            var ok = true;
            var errMessages = [];
            if(!$scope.newTask.taskName) {
                ok = false;
                errMessages.push("Task name is null");
            }
            if(!$scope.newTask.taskDescription) {
                ok = false;
                errMessages.push("Task description is null");
            }
            if(!($scope.newTask.taskOptimisticDuration < $scope.newTask.taskLikelyDuration &&
                $scope.newTask.taskLikelyDuration < $scope.newTask.taskPessimisticDuration)) {
                ok = false;
                errMessages.push("Optimistic duration needs to be less than likely duration, and likely duration " +
                "needs to be less than pessimistic duration");
            }
            if(ok) {
                TaskFactory.createTask($scope.newTask, $scope.assignedTeamMembers, $scope.taskDependencies)
                    .success(function (err, res) {
                        alert($scope.newTask.taskName + ' successfully saved in database');
                    }).error(function (err, res) {
                        console.log(err);
                        alert('insert failed');
                        var err_msg = "save project failed: ";
                        if(err.code == "23505")
                            err_msg += "that user already exists";
                        else
                            err_msg += err.detail;
                        alert(err_msg);
                    })
            } else {
                var message = "The following errors were found:\n";
                errMessages.forEach(function(err) {
                    message += (err + "\n");
                })
                alert(message);
            }


        }
    }]);
