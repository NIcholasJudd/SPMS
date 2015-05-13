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

        $scope.taskData = {
            taskId: 0,
            taskNumber: 0,
            projectName: null,
            taskName: null,
            duration: null,
            description: null,
            progress: 0,
            teamMembers: [],
            status: null,
            priority: null,
            parentId: 0
        };

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
            if ($scope.Tasks[$index].priority == 'High'){
                return 'panel panel-danger';
            } else if($scope.Tasks[$index].priority == 'medium'){
                return 'panel panel-warning';
            }else
            {
                return 'panel panel-info';
            }
        }

        $scope.selectedUser = [];
        $scope.setUser = function(index) {
            
            if (searchEmail(index) == -1){
                $scope.taskData.teamMembers.push({
                    name: $scope.selectedUser[index].name,
                    email: $scope.selectedUser[index].email
                })
                $scope.selectedUser.splice(index,1);
            }
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
          /*  $scope.taskData.teamMembers.push({
                name : $scope.selectedUser[index].name,
                email : $scope.selectedUser[index].email
            })*/
console.log($scope.taskData)
}
}]);

