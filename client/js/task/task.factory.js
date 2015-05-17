/**
 * Created by nicholasjudd on 17/05/15.
 */
myApp.factory('TaskFactory', function ($http) {
    return {

        createTask: function (task) {
            return $http.post('http://localhost:3000/api/auth/admin/project/', {

                task_number: task.taskNumber,
                project_name: task.projectName,
                task_name: task.taskName,
                description: task.taskDescription,
                start_date: task.startDate,
                likely_duration: task.likelyDuration,
                optimistic_duration: task.optimisticDuration,
                pessimistic_duration: task.pessimisticDuration,
                progress_percentage: task.progressPercentage,
                status: task.status,
                priority: task.priority,
                parent_id: task.parentId,
                taskRoles: [{
                    email: task.email,
                    roleName: task.roleName
                }],
                links: [{
                    projectName: task.projectName,
                    source: task.source,
                    type: task.type
                }]
            })
        }
    }
});