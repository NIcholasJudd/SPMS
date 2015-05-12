/**
 * Created by scottmackenzie on 12/05/2015.
 */


myApp.controller("TaskCtrl", ['$scope',
    function($scope) {
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
    }
]);
