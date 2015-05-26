/**
 * Created by scottmackenzie on 12/05/2015.
 */


myApp.controller("TaskCtrl", ['$scope', 'ProjectFactory', 'UserFactory', 'TaskFactory', '$window', '$modal', '$log',
    function ($scope, ProjectFactory, UserFactory, TaskFactory, $window, $modal, $log) {


        $scope.test = undefined;
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
        $scope.Skills = ["c++", "java", "html", "javascript", "Databases", "angular", "bootstrap"];
        $scope.Names = [];
        $scope.selectedUser = {
            name: null,
            email: null,
            indexValue: null
        };
        $scope.status = {
            unassigned: 0,
            otg: 0,
            finalised: 0
        };
        $scope.search = {
            name: "",
            skill: "",
            role: "",
            performanceIndex: 0
        }
        $scope.assignedTeamMembers = [];
        $scope.searchTeamMembers = [];
        $scope.teamMembersList = [];
        $scope.taskData = [];
        $scope.tasks = [];
        $scope.projectNames =[];
        $scope.projectData = [];
        $scope.newTask = {};
        $scope.dependencies = [];

        ProjectFactory.getProjects().then(function (projects) {
            projects.data.forEach(function (projects) {
                $scope.projectData.push({
                    projectName: projects.project_name
                });
            });
        });

        //$scope.$on('')

        UserFactory.getUserTasks($window.sessionStorage.user).then(function (results) {
            console.log('tasks: ', results);
            if ($window.sessionStorage.userRole == "administrator") {
                ProjectFactory.getProjects().then(function (projects) {
                    projects.data.forEach(function (projects) {
                        $scope.projectNames.push(projects.project_name);
                    });
                });
            }else {
            var projectNames = [];
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
                projectNames.push(tasks.project_name);
            })

            $scope.projectNames = projectNames.filter(function (item, pos) {
                return projectNames.indexOf(item) == pos;
            });
            /*$scope.taskData.forEach(function(task) {

             })*/
        }
        }).finally(function() {
            if($scope.projectNames > 0)
                $scope.importTasks($scope.projectNames[0]);
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
                $scope.Names.push({
                    label: user.first_name + ' ' + user.last_name,
                    value: user.email
                });
            })
        })

        $scope.setProjectName = function (item) {
            console.log($scope.Names);
            $scope.taskData = [];
            $scope.dependencies = [];
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
                        comfortZone : tasks.comfort_zone,
                        progress: tasks.progress_percentage,
                        status: tasks.status,
                        teamMembers: [],
                        priority: tasks.priority,
                        parentId: tasks.parent_id
                    })
                    countTasks($scope.taskData);
                })
            })
            $scope.newTask.projectName = item;
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

            $scope.searchTeamMembers = [];
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
        }
        $scope.clearDependencies = function () {
            $scope.dependencies = [];
        }
        $scope.setPriority = function (item) {
            $scope.newTask.priority = item;
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
        function countTasks(task) {
            $scope.status = {
                unassigned: 0,
                otg: 0,
                finalised: 0
            };
            if (task.status == "on-the-go")
                $scope.status.otg += Number(1);
            else if (task.status = "unassigned")
                $scope.status.unassigned += Number(1);
            else if (task.status = "finalised")
                $scope.status.complete += Number(1);
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
            if ($scope.assignedTeamMembers.length === 0)
                $scope.newTask.status = 'unassigned';
            else
                $scope.newTask.status = 'on-the-go';
            console.log($scope.newTask);
            console.log($scope.assignedTeamMembers);
            TaskFactory.createTask($scope.newTask, $scope.assignedTeamMembers)
                .success(function (err, res) {
                    alert($scope.newTask.taskName + ' successfully saved in database');
                }).error(function (err, res) {
                    alert('insert failed');
                    /*var err_msg = "save project failed: ";
                     if(err.code == "23505")
                     err_msg += "that user already exists";
                     else
                     err_msg += err.detail;
                     alert(err_msg);*/
                })
        }
        $scope.assigned = false;
        $scope.onTheGo = false;
        $scope.complete = false;
        $scope.showTaskPanel = function (type) {
            if (type == 1) {
                $scope.assigned = true;
                $scope.onTheGo = false;
                $scope.complete = false;
            }
            else if (type == 2) {
                $scope.assigned = false;
                $scope.onTheGo = true;
                $scope.complete = false;
            }
            else if (type == 3) {
                $scope.assigned = false;
                $scope.onTheGo = false;
                $scope.complete = true;
            }
        };

        $scope.startTask = function ($index) {
            $scope.tasks[$index].status = 'on-the-go';
        };

        $scope.markFinalised = function ($index) {
            $scope.tasks[$index].status = 'finalised';
        };


        $scope.getUserName = function(){
            return $window.sessionStorage.firstName;
        }

        $scope.setTask = function(index) {
            $window.sessionStorage.taskNumber = $scope.taskData[index].taskNumber;


        }
        /*ProjectFactory.getTasks($window.sessionStorage.projectName).then(function (res) {
            console.log('!!');
            $scope.status = {
                unassigned: 0,
                otg: 0,
                finalised: 0,
                complete: 0
            };
            res.data.forEach(function (task) {
                if (task.status == "on-the-go")
                    $scope.status.otg += Number(1);
                else if (task.status = "unassigned")
                    $scope.status.unassigned += Number(1);
                else if (task.status = "complete")
                    $scope.status.complete += Number(1);
                else if (task.status = "finalised")
                    $scope.status.finalised += Number(1);

            })
        })*/

    }
]);
/*-------------------  Modal Controller  -------------------- */

myApp.controller('ModalInstanceCtrl', function ($scope, $modalInstance, task, TaskFactory, $window) {

    $scope.taskData = task;
    $scope.comment = '';
    $scope.commentData = [];
    $scope.tracker = 0;

    $scope.startDate = function () {
        var sdate = new Date($scope.taskData.startDate);
        return sdate.toDateString();
    };

    $scope.saveComment = function(){
        TaskFactory.addComment($scope.taskData.taskId, $scope.comment, new Date(), $window.sessionStorage.user);
    }
    $scope.getComment = function(taskId){
        TaskFactory.getComments(taskId).then(function(results){
            console.log(results);
            results.data.forEach(function(comment){
                $scope.commentData.push({
                    commentId: comment.comment_id,
                    commentText: comment.comment_text,
                    commentDate: comment.comment_date,
                    user: comment.email
                })
            })
        })
    }
    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.back = function(tracker){
        if($scope.tracker > 0) {
            $scope.tracker = tracker - 1;
        }
    }
    $scope.forward = function(tracker){
        if($scope.tracker != ($scope.commentData.length - 1)) {
            $scope.tracker = tracker + 1;
        }
    }
});

/*-------------------  User Modal Controller  -------------------- */

myApp.controller('TaskModalInstanceCtrl', function ($scope, $modalInstance, task, TaskFactory, $window, UserFactory) {

    $scope.taskData = task;
    $scope.teamData = [];


    $scope.getTeamMembers = function(taskId){
        TaskFactory.getUserRoles(taskId).then(function(results){
            results.data.forEach(function(user){
                $scope.teamData.push({
                    firstName: user.first_name,
                    lastName: user.last_name,
                    email: user.email,
                    role: user.role_name.toUpperCase()
                })
                console.log($scope.teamData);
            })
        })
    }

    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});

