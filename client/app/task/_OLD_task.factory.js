/**
 * Created by nicholasjudd on 17/05/15.
 */
myApp.factory('TaskFactoryOld', function ($http) {
    var currentTask = {};
    return {

        createTask: function (task, roles, dependencies) {
            return $http.post('http://localhost:3000/api/auth/project/' + task.projectName + '/task', {
                taskName: task.taskName,
                description: task.taskDescription,
                startDate: task.taskStartDate,
                likelyDuration: task.taskLikelyDuration.toString() + ' days',
                optimisticDuration: task.taskOptimisticDuration.toString() + ' days',
                pessimisticDuration: task.taskPessimisticDuration.toString() + ' days',
                comfortZone: task.taskComfortZone.toString() + ' days',
                progressPercentage: 0,
                status: task.status,
                priority: task.priority.toLowerCase(),
                parentId: task.parentId,
                taskRoles: roles,
                links: dependencies
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
                comfortZone: task.taskComfortZone.toString() + ' days',
                priority: task.priority.toLowerCase(),
                progressPercentage: task.progress / 100,
                parentId: task.parentId,
                taskRoles: roles,
                links: dependencies
            })
        },

        updateProgress : function(taskId, progress) {
            return $http.put('http://localhost:3000/api/auth/task/' + taskId + '/progress', {progressPercentage : progress});
        },

        updateStatus : function(taskId, status) {
            return $http.put('http://localhost:3000/api/auth/task/' + taskId + '/status', {status : status});
        },

        archiveTask: function(taskId, active) {
            return $http.put('http://localhost:3000/api/auth/task/' + taskId + '/archive', {active: active});
        },
            
        getCurrentTask: function(projectName, taskNumber) {
            return $http.get('http://localhost:3000/api/auth/project/' + projectName + '/task/' + taskNumber);
        },

        getTask: function(taskId) {
            return $http.get('http://localhost:3000/api/auth/task/' + taskId);
        },

        getUsers : function(taskId) {
            return $http.get('http://localhost:3000/api/auth/task/' + taskId + '/users');
        },

        getUserRoles : function(taskId) {
            return $http.get('http://localhost:3000/api/auth/task/' + taskId + '/userRoles');
        },

        /* add a comment to a particular task */
        addComment : function(taskId, commentText, commentDate, email) {
            return $http.post('http://localhost:3000/api/auth/task/' + taskId + '/comment', {
                commentText : commentText,
                commentDate : commentDate,
                email : email
            })
        },

        /*  get all comments for a particular task.  the commenter's first name and lastname are returned, as well
            as comment data */
        getComments : function(taskId) {
            return $http.get('http://localhost:3000/api/auth/task/' + taskId + '/comments');
        }


    }
});