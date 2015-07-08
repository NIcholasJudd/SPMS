myApp.controller("projectCreate", ['$scope', 'ProjectFactory', 'userFactoryTest',
    function ($scope, ProjectFactory, userFactoryTest) {
        $scope.project;
        $scope.selectedProjectManager;
        $scope.users = [];
        userFactoryTest.getUserNames().then(function (results) {
            $scope.users = results;
            console.log($scope.users);
        })
        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        $scope.test = function(){
            console.log($scope.project);
        }
    }
]);