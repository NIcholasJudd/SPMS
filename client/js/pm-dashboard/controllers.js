/**
 * Created by scottmackenzie on 2/07/2015.
 */

myApp.controller("PMContainerCtrl", ['$scope', '$rootScope', 'PMDashboard'/*, 'UserFactory', '$window',
    'assignedProjects'*/,
    function ($scope, $rootScope, PMDashboard/*, UserFactory, $window, assignedProjects*/) {
        $scope.projectData = [];
        PMDashboard.getProjects()
            .then(function(projects){
                console.log("projects", projects);
                $scope.projectData = projects;
            })

        //$scope.$watch($)
    }]
)