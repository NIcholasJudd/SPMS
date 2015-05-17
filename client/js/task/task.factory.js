/**
 * Created by nicholasjudd on 17/05/15.
 */
myApp.factory('TaskFactory', function ($http) {
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
        }
    }
});