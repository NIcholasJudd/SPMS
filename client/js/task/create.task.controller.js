/**
 * Created by nicholasjudd on 20/05/15.
 */
myApp.controller("TaskCreateCtrl", ['$scope', 'ProjectFactory', 'UserFactory', 'TaskFactory', '$window',
    function ($scope, ProjectFactory, UserFactory, TaskFactory, $window) {
        $scope.Roles = ["Developer", "Tester", "Bug Fixer", "Analyst", "Graphic Designer", "Interface Designer", "Server Designer", "Database Engineer"];
        $scope.priorityLevel = ["critical", "high", "medium", "low"];


    }]);
