/**
 * Created by nicholasjudd on 22/05/15.
 */
myApp.controller("TaskDashCtrl", ['$scope', '$rootScope', 'ProjectFactory', 'UserFactory', 'TaskFactory', '$window', '$modal', '$route',
    function ($scope, $rootScope, ProjectFactory, UserFactory, TaskFactory, $window, $modal, $route) {

        $scope.projectNames = [];
        $scope.currentProject;
        $scope.taskData = [];
        $scope.status = {
            unassigned: 0,
            otg: 0,
            finalised: 0
        };
        $scope.tasks = [];
        $scope.assigned = true;
        $scope.onTheGo = false;
        $scope.complete = false;

        //if($window.sessionStorage.userRole === 'administrator') {
            ProjectFactory.getProjects().then(function (projects) {
                console.log("GET PROJECTS: ", projects.data);
                projects.data.forEach(function (projects) {
                    if ($window.sessionStorage.userRole == "administrator") {
                        $scope.projectNames.push(projects.project_name);
                        if ($scope.projectNames.length > 0) {
                            if (!$window.sessionStorage.projectName || $window.sessionStorage.projectName == null ||
                                $scope.projectNames.indexOf($window.sessionStorage.projectName) === -1) {
                                $window.sessionStorage.projectName = $scope.currentProject = $scope.projectNames[0];
                            } else
                                $scope.currentProject = $window.sessionStorage.projectName;
                        }
                    } else {
                        UserFactory.getUserTasks($window.sessionStorage.user).then(function (results) {
                            results.data.forEach(function (userProjects) {
                                if (userProjects.project_name == projects.project_name) {
                                    if ($scope.projectNames.indexOf(projects.project_name) < 0) {
                                        $scope.projectNames.push(userProjects.project_name);
                                    }
                                    if ($scope.projectNames.length > 0) {
                                        console.log('Project names: ', $scope.projectNames);
                                        if (!$window.sessionStorage.projectName || $window.sessionStorage.projectName != null) {
                                            $window.sessionStorage.projectName = $scope.currentProject = $scope.projectNames[0];
                                            $scope.retrieveTasks($window.sessionStorage.projectName);
                                        }
                                        else {
                                            $scope.currentProject = $window.sessionStorage.projectName;
                                            $scope.retrieveTasks($window.sessionStorage.projectName);
                                        }
                                        //console.log("before iport tasks");
                                    }
                                }
                            })
                        })/*.finally(function() {
                            $scope.retrieveTasks($window.sessionStorage.projectName);
                            console.log($window.sessionStorage.projectName);
                        })*/
                        //$rootScope.$broadcast('task-updated');
                    }
                })
                console.log("WINDOW: ", $window.sessionStorage.projectName);
                //$scope.retrieveTasks($window.sessionStorage.projectName);
            });
        /*} else {
            ProjectFactory.getPMProjects().then(function (projects) {
                console.log("GET PROJECTS: ", projects.data);
                projects.data.forEach(function (projects) {
                    if ($window.sessionStorage.userRole == "administrator") {
                        $scope.projectNames.push(projects.project_name);
                        if ($scope.projectNames.length > 0) {
                            if (!$window.sessionStorage.projectName || $window.sessionStorage.projectName == null ||
                                $scope.projectNames.indexOf($window.sessionStorage.projectName) === -1) {
                                $window.sessionStorage.projectName = $scope.currentProject = $scope.projectNames[0];
                            } else
                                $scope.currentProject = $window.sessionStorage.projectName;
                        }
                    } else {
                        UserFactory.getUserTasks($window.sessionStorage.user).then(function (results) {
                            results.data.forEach(function (userProjects) {
                                if (userProjects.project_name == projects.project_name) {
                                    if ($scope.projectNames.indexOf(projects.project_name) < 0) {
                                        $scope.projectNames.push(userProjects.project_name);
                                    }
                                    if ($scope.projectNames.length > 0) {
                                        console.log('Project names: ', $scope.projectNames);
                                        if (!$window.sessionStorage.projectName || $window.sessionStorage.projectName != null)
                                            $window.sessionStorage.projectName = $scope.currentProject = $scope.projectNames[0];
                                        else
                                            $scope.currentProject = $window.sessionStorage.projectName;
                                        //console.log("before iport tasks");
                                    }
                                }
                            })
                        })
                        //$rootScope.$broadcast('task-updated');
                    }
                })
                $scope.retrieveTasks($window.sessionStorage.projectName);
            });
        }*/

        $scope.retrieveTasks = function (proName) {
            console.log("IMPORT TAKSS");
            ProjectFactory.getTasks(proName).then(function (res) {
                console.log(proName);
                $scope.status = {
                    unassigned: 0,
                    otg: 0,
                    finalised: 0
                };
                $scope.tasks = [];

                if ($window.sessionStorage.userRole == "administrator") {
                    res.data.forEach(function (task) {
                        if (task.status == "on-the-go")
                            $scope.status.otg += Number(1);
                        else if (task.status == "unassigned")
                            $scope.status.unassigned += Number(1);
                        else if (task.status == "finalised")
                            $scope.status.finalised += Number(1);
                        $scope.tasks.push({
                            taskId: task.task_id,
                            taskName: task.task_name,
                            taskNumber: task.task_number,
                            taskDescription: task.description,
                            priority: task.priority,
                            status: task.status,
                            progress: task.progress_percentage,
                            projectName: task.project_name
                        })
                    })
                } else {
                    console.log("HERE");
                    res.data.forEach(function (task) {
                        console.log("TASK: ", task);
                        TaskFactory.getUserRoles(task.task_id).then(function (results) {
                            console.log("task_id: ", results);
                            results.data.forEach(function (tempUser) {
                                if ($window.sessionStorage.user == tempUser.email && tempUser.task_id == task.task_id) {
                                    if (task.status == "on-the-go")
                                        $scope.status.otg += Number(1);
                                    else if (task.status == "unassigned")
                                        $scope.status.unassigned += Number(1);
                                    else if (task.status == "finalised") {
                                        $scope.status.finalised += Number(1);
                                    }
                                    $scope.tasks.push({
                                        taskId: task.task_id,
                                        taskName: task.task_name,
                                        taskNumber : task.task_number,
                                        taskDescription: task.description,
                                        priority: task.priority,
                                        status: task.status,
                                        progress: task.progress_percentage,
                                        projectName: task.project_name
                                    })
                                }
                            })
                        })
                    })

                }

            })
        }

        /* track by taskId create index server side*/
        $scope.startTask = function ($index) {
            TaskFactory.updateStatus($index, 'on-the-go').then(function(res) {
                /*once task status has been updated, reload tasks from database */
                $rootScope.$broadcast('task-updated');
            })
        };

        $scope.markFinalised = function ($index) {
            TaskFactory.updateStatus($index, 'finalised').then(function(res) {
                /*once task status has been updated, reload tasks from database */
                $rootScope.$broadcast('task-updated');
            });
        };

        $scope.markComplete = function ($index) {
            TaskFactory.updateStatus($index, 'complete').then(function(res) {
                /*once task status has been updated, reload tasks from database */
                $rootScope.$broadcast('task-updated');
            });
        };

        /* this is called by any $rootScope.$broadcast('task-updated'), refreshes tasks from db */
        $scope.$on('task-updated', function() {
            $scope.retrieveTasks($window.sessionStorage.projectName);
        })

        $scope.getUserName = function () {
            return $window.sessionStorage.firstName;
        }

        $scope.setProject = function (projectName) {
            $window.sessionStorage.projectName = $scope.currentProject = projectName;
            $scope.retrieveTasks(projectName);
        }

        $scope.setCurrentTask = function (taskNumber) {
            console.log("set current task", taskNumber);
            $window.sessionStorage.taskId = taskNumber;
            /*TaskFactory.getCurrentTask($window.sessionStorage.projectName, taskNumber).then(function (results) {
                results.data.forEach(function (tasks) {
                    console.log("SET CURRENT TAKS: ", tasks);
                    $window.sessionStorage.taskId = tasks.task_id;
                    $window.sessionStorage.taskNumber = tasks.task_number;
                })
            })*/
        }


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

        $scope.importTasks = function(proName) {
            ProjectFactory.getTasks(proName).then(function (res) {
                console.log(proName);
                res.data.forEach(function (task) {
                    console.log(task.status);
                    $scope.tasks.push({
                        taskId: task.task_id,
                        taskName: task.task_name,
                        taskDescription: task.description,
                        priority: task.priority,
                        status: task.status,
                        progress: task.progress_percentage,
                        projectName: task.project_name,
                        startDate: task.start_date,
                        taskNumber: task.task_number,
                        likelyDuration: task.likely_duration,
                        optimisticDuration: task.optimistic_duration,
                        pessimisticDuration: task.pessimistic_duration,
                        parentId: task.parent_id
                    })
                })
            })
        }
        $scope.openModal = function (index) {
            var found;
            for(var i=0; i<$scope.tasks.length;i++){
                if($scope.tasks[i].taskId == index)
                    found = i;
            }
            var modalInstance = $modal.open({
                    templateUrl: '/partials/dashboard/myModalContent.html',
                    controller: 'ModalInstanceCtrl',
                    resolve: {
                        task:function(){
                            return $scope.tasks[found];
                        }
                    }
                }
            )
        };

        $scope.priorityLevel = function(level){
            if(level == 'critical'){
                return "danger";
            }
            else if(level == 'high'){
                return "warning";
            }
            else if(level == 'medium'){
                return "success";
            }
            else if(level == 'low'){
                return "info";
            }
        };

        $scope.openUserModal = function (index) {
            var found;
            for(var i=0; i<$scope.tasks.length;i++){
                if($scope.tasks[i].taskId == index)
                    found = i;
            }
            var modalInstance = $modal.open({
                    templateUrl: '/partials/dashboard/taskUserModal.html',
                    controller: 'TaskModalInstanceCtrl',
                    size: 'sm',
                    resolve: {
                        task:function(){
                            return $scope.tasks[found];
                        }
                    }
                }
            )
        };

}
])
;