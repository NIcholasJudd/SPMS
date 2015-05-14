/**
 * Created by scottmackenzie on 12/05/2015.
 */


 myApp.controller("TaskCtrl", ['$scope','ProjectFactory', 'UserFactory',
    function($scope, ProjectFactory, UserFactory) {

        $scope.countOnTheGo= {
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
        /*task_id | task_number | project_name | task_name |    description     | start_date | 
        likely_duration | optimistic_duration | pessimistic_duration | progress_percentage |  status   | priority | parent_id */
        $scope.taskData = [{
            taskId: null,
            taskNumber: null,
            projectName: null,
            taskName: null,
            taskDescription: null,
            startDate: null,
            likelyDuration: null,
            optimisticDuration: null,
            pessimisticDuration: null,
            progress: null,
            status: null,
            teamMembers: [{
                name: null,
                email: null
            }],
            priority: null,
            parentId: null
        }];

      /* $scope.projectName = "My Project 1";
        ProjectFactory.getTasks($scope.projectName).then(function(results) {
            console.log("Tasks", results.data);
            results.data.forEach(function(tasks){
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
                    priority: tasks.priority,
                    parentId: tasks.parent_id
                })
            });
            countTasks();
        })*/
$scope.selectedUser = [];
$scope.teamMembers = [];
UserFactory.getUsers().then(function(results) {
    console.log('HERE:', results.data);
    results.data.forEach(function(user) {
        $scope.teamMembers.push({
            name : user.first_name + ' ' + user.last_name,
            email : user.email
        })
    });
})
$scope.taskPriority = function($index){
    if ($scope.taskData[$index].priority == 'critical'){
        return 'panel panel-danger';
    } else if($scope.taskData[$index].priority == 'medium'){
        return 'panel panel-warning';
    }else
    {
        return 'panel panel-info';
    }
}
function countTasks(){
    for (var i =0; i < $scope.taskData.length; i++){
        if ($scope.taskData[i].status == "on-the-go"){
            $scope.countOnTheGo.value += Number(1);
        }else if ($scope.taskData[i].status == "finalised"){
            $scope.countAwaitingApproval += Number(1);
        }
    }
}

$scope.setUser = function(index) {
    console.log(index);
    $scope.selectedUser.push({
        name: $scope.teamMembers[index].name,
        email: $scope.teamMembers[index].email
    });
    $scope.teamMembers.splice(index,1);
    console.log($scope.selectedUser);
    console.log($scope.teamMembers);
}
function searchEmail(index) {
    if($scope.taskData.teamMembers.length == 0){
        return -1;
    }
    for (var i = 0; i < $scope.taskData.teamMembers.length; i++) {
        if ($scope.selectedUser[index].email == $scope.taskData.teamMembers[i].email) {
            return 1;
        }
    }
    return -1;
}
$scope.delValue = 0;
$scope.removeValue = function(index){
    $scope.delValue = index;
}
$scope.removeFromTask = function(index) {
            //console.log($scope.taskData.teamMembers[$scope.delValue]);
            console.log($scope.delValue);
            $scope.selectedUser.push({
                name : $scope.teamMembers[$scope.delValue].name,
                email : $scope.teamMembers[$scope.delValue].email
            })
            $scope.teamMembers.splice($scope.delValue);
        }
        $scope.addUserToTask = function() {
         $scope.teamMembers.push({
            name : $scope.selectedUser[index].name,
            email : $scope.selectedUser[index].email
        })
         console.log($scope.taskData)
     }
 }]);

