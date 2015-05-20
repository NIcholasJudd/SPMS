/**
 * Created by nicholasjudd on 17/05/15.
 */
myApp.factory('TaskFactory', function ($http) {
    var currentTask = {};
    return {

        createTask: function (task, roles) {
            return $http.post('http://localhost:3000/api/auth/project/' + task.projectName + '/task', {
                taskName: task.taskName,
                description: task.taskDescription,
                startDate: task.taskStartDate,
                likelyDuration: task.taskLikelyDuration.toString() + ' days',
                optimisticDuration: task.taskOptimisticDuration.toString() + ' days',
                pessimisticDuration: task.taskPessimisticDuration.toString() + ' days',
                progressPercentage: 0,
                status: task.status,
                priority: task.priority.toLowerCase(),
                parentId: task.parentId,
                taskRoles: roles,
                links: task.dependencies
            })
        },

        updateTask: function (task, roles, dependencies) {
            return $http.put('http://localhost:3000/api/auth/task/' + task.taskId, {
                taskName: task.taskName,
                description: task.taskDescription,
                startDate: task.taskStartDate,
                likelyDuration: task.taskLikelyDuration.toString() + ' days',
                optimisticDuration: task.taskOptimisticDuration.toString() + ' days',
                pessimisticDuration: task.taskPessimisticDuration.toString() + ' days',
                priority: task.priority.toLowerCase(),
                parentId: task.parentId,
                taskRoles: roles,
                links: dependencies  
            })
        },

        archiveTask: function(taskId, active) {
            return $http.put('http://localhost:3000/api/auth/task/' + taskId + '/archive', {active: active});
        },
            
        getCurrentTask: function(projectName, taskNumber) {
            return $http.get('http://localhost:3000/api/auth/project/' + projectName + '/task/' + taskNumber);
        },

        getUsers : function(taskId) {
            return $http.get('http://localhost:3000/api/auth/task/' + taskId + '/users');
        }
    }
});