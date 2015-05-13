/**
 * Created by scottmackenzie on 12/05/2015.
 */


 myApp.controller("TaskCtrl", ['$scope','ProjectFactory', 'UserFactory',
    function($scope, ProjectFactory, UserFactory) {
        $scope.Tasks = [
        {title: 'Title',
        description: 'Description',
        priority: 'High'},
        {title: 'Title',
        description: 'Description',
        priority: 'medium'},
        {title: 'Title',
        description: 'Description',
        priority:'low'},
        {title: 'Title',
        description: 'Description',
        priority:'low'},
        {title: 'Title',
        description: 'Description',
        priority:'low'},
        {title: 'Title',
        description: 'Description',
        priority:'low'},
        {title: 'Title',
        description: 'Description',
        priority:'low'},
        {title: 'Title',
        description: 'Description',
        priority:'low'},
        {title: 'Title',
        description: 'Description',
        priority:'low'},
        {title: 'Title',
        description: 'Description',
        priority:'low'}
        ];
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
        $scope.taskData = [];
        $scope.projectName = "My Project 1";
        ProjectFactory.getTasks($scope.projectName).then(function(results) {
            console.log("Tasks", results.data);
            results.data.forEach(function(tasks){
                $scope.taskData.push({
                    taskId: tasks.task_id,
                    taskNumber: tasks.task_number,
                    projectName: tasks.project_name,
                    taskName: tasks.task_name,
                    taskDescription: tasks.descripton,
                    startDate: tasks.start_date,
                    likleyDuration: tasks.likley_duration,
                    optomisticDuration: tasks.optomistic_duration,
                    pessimisticDuration: tasks.pessimistic_duration,
                    progress: tasks.progress_percentage,
                    status: tasks.status,
                    priority: tasks.priority,
                    parentId: tasks.parent_id
                })
            });
            countTasks();
        })
        $scope.teamMembers = [];
        UserFactory.getUsers().then(function(results) {
            console.log('HERE:', results.data);
            results.data.forEach(function(user) {
                $scope.teamMembers.push({
                    name : user.first_name + ' ' + user.last_name,
                    email : user.email
                })
                $scope.selectedUser.push({
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
        
        $scope.selectedUser = [];
        $scope.setUser = function(index) {
            console.log(searchEmail(index));
            if (searchEmail(index) == -1){
                $scope.taskData.teamMembers.push({
                    name: $scope.selectedUser[index].name,
                    email: $scope.selectedUser[index].email
                })
                $scope.selectedUser.splice(index,1);
            }
            console.log($scope.taskData.teamMembers);
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
                name : $scope.taskData.teamMembers[$scope.delValue].name,
                email : $scope.taskData.teamMembers[$scope.delValue].email
            })
            $scope.taskData.teamMembers.splice($scope.delValue);
        }
        $scope.addUserToTask = function() {
           $scope.taskData.teamMembers.push({
            name : $scope.selectedUser[index].name,
            email : $scope.selectedUser[index].email
        })
           console.log($scope.taskData)
       }
   }]);

