/**
 * Created by scottmackenzie on 4/07/2015.
 */

myApp.controller("TaskModifyCtrl", ['$scope', '$stateParams', 'TaskFactory',
        function($scope, $stateParams, TaskFactory) {

            $scope.task = {};
            $scope.projectTasks = [];
            $scope.dependentTasks = [];
            $scope.nonDependentTasks = [];
            $scope.assignedTeamMembers = [];

            //Initial setup of the Modify task page.  Retrieve task to be modified, the rest of the tasks belonging
            //to that project, and the dependencies of that modifiable task
            TaskFactory.getTask($stateParams.taskId)
                .then(function(task) {
                    $scope.task = task;
                    return TaskFactory.getProjectTasks($scope.task.projectName);

                })
                .then(function(tasks) {
                    $scope.projectTasks = tasks;
                    return TaskFactory.getDependencies($scope.task.taskId);
                })
                .then(function(dependencies) {
                    //assign dependent task names & ids to dependent tasks
                    $scope.dependentTasks = $scope.projectTasks.filter(function(task) {
                        return task.taskId !== $scope.task.taskId && isDependent(dependencies, task);
                    });
                    //assign non-dependent task names & ids to non-dependent tasks
                    $scope.nonDependentTasks = $scope.projectTasks.filter(function(task) {
                        return task.taskId !== $scope.task.taskId && !isDependent(dependencies, task);
                    });
                });

            //populate existing user roles
            TaskFactory.getUserRoles($stateParams.taskId)
                .then(function(users) {
                    users.forEach(function(user) {
                        user["name"] = user.firstName + ' ' + user.lastName;
                    })
                    $scope.assignedTeamMembers = users;
                });

            //returns true if the $scope.task is dependent on the argument task
            var isDependent = function(dependencies, task) {
                var flag = false;
                dependencies.forEach(function(dependency) {
                    if(dependency.source == task.taskId)
                        flag = true;
                })
                return flag;
            }

            $scope.clearDependencies = function() {
                //move dependentTasks back to nonDependentTasks
                $scope.nonDependentTasks.push.apply($scope.nonDependentTasks, $scope.dependentTasks);
                //clear dependentTasks
                $scope.dependentTasks = [];
            }

            $scope.setDependencies = function(newTask) {
                //remove task from nonDependentTasks array
                $scope.nonDependentTasks.forEach(function(task, index) {
                    if(task.taskId === newTask[0].taskId)
                        $scope.nonDependentTasks.splice(index, 1);
                })
                //move task to dependentTasks array
                $scope.dependentTasks.push(newTask[0]);
            }



        }]
);