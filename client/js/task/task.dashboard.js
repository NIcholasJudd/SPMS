/**
 * Created by nicholasjudd on 22/05/15.
 */
myApp.controller("TaskDashCtrl", ['$scope', 'ProjectFactory', 'UserFactory', 'TaskFactory', '$window', '$modal',
    function ($scope, ProjectFactory, UserFactory, TaskFactory, $window, $modal) {

        $scope.projectNames = [];
        $scope.taskData = [];
        $scope.status = {
            unassigned: 0,
            otg: 0,
            finalised: 0
        };
        $scope.tasks = [];

        ProjectFactory.getProjects().then(function (projects) {
            projects.data.forEach(function (projects) {
                if ($window.sessionStorage.userRole == "administrator") {
                    $scope.projectNames.push(projects.project_name);
                    $window.sessionStorage.projectName = $scope.projectNames[0];
                }else {
                    UserFactory.getUserTasks($window.sessionStorage.user).then(function (results) {
                        results.data.forEach(function (userProjects) {
                            if (userProjects.project_name == projects.project_name) {
                                if ($scope.projectNames.indexOf(projects.project_name) < 0) {
                                    $scope.projectNames.push(userProjects.project_name);
                                }
                                $window.sessionStorage.projectName = $scope.projectNames[0];
                            }
                        })
                    })
                }
            })
            $scope.importTasks($window.sessionStorage.projectName);
        });


        $scope.importTasks = function (proName) {
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
                            taskDescription: task.description,
                            priority: task.priority,
                            status: task.status,
                            progress: task.progress_percentage,
                            projectName: task.project_name
                        })
                    })
                } else {
                    res.data.forEach(function (task) {
                        TaskFactory.getUserRoles(task.task_id).then(function (results) {
                            results.data.forEach(function (tempUser) {
                                if ($window.sessionStorage.user == tempUser.email && tempUser.task_id == task.task_id) {
                                    if (task.status == "on-the-go")
                                        $scope.status.otg += Number(1);
                                    else if (task.status = "unassigned")
                                        $scope.status.unassigned += Number(1);
                                    else if (task.status = "finalised")
                                        $scope.status.complete += Number(1);
                                    $scope.tasks.push({
                                        taskId: task.task_id,
                                        taskName: task.task_name,
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

        for(var i=0; i<$scope.tasks.length;i++){
            if($scope.tasks[i].taskId == index)
                found = i;
        }
/* track by taskId create index server side*/
        $scope.startTask = function ($index) {
            TaskFactory.updateStatus($index, 'on-the-go');
            $scope.importTasks($window.sessionStorage.projectName);
        };

        $scope.markComplete = function ($index) {
            console.log($index);
            TaskFactory.updateStatus($index, 'finalised');
            $scope.importTasks($window.sessionStorage.projectName);
        };

$scope.setProject = function (projectName) {
    $scope.importTasks(projectName);
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
}
])
;