myApp.controller("projectCreate", ['$scope', 'ProjectFactory', 'userFactoryTest',
    function ($scope, ProjectFactory, userFactoryTest) {
        $scope.project ="";
        $scope.selectedProjectManager ="";
        $scope.users = [];
        userFactoryTest.getUserNames().then(function (results) {
            $scope.users = results;
            console.log($scope.users);
        })
        $scope.open = function($event, open) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope[open] = true;
        };

        $scope.test = function(){
            $scope.project.projectManager = $scope.selectedProjectManager;
            console.log($scope.project);
        };
    }
]);