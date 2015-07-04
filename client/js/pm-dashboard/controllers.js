/**
 * Created by scottmackenzie on 2/07/2015.
 */

myApp.controller("PMContainerCtrl", ['$scope', '$rootScope', 'PMDashboard',
    function ($scope, $rootScope, PMDashboard) {
        $scope.projects = [];
        $scope.currentProject = {};


        //Retrieve current list of projects from the db via PMDashboard service
        PMDashboard.getProjects()
            .then(function(projects){
                $scope.projects = projects;
                $scope.currentProject = PMDashboard.getCurrentProject();
            })

        //called when switching project tabs.  sets the current project in PMDashboard service,
        $scope.switchProject = function(index) {
            PMDashboard.setCurrentProject($scope.projects[index]);
            $scope.currentProject = PMDashboard.getCurrentProject();
        }
    }]
);

myApp.controller("PMProjectTrackingCtrl", ['$scope', 'PMDashboard',
    function($scope, PMDashboard) {
    }]
);

myApp.controller("PMTasksCtrl", ['$scope', '$stateParams', 'PMDashboard',
    function($scope, $stateParams, PMDashboard) {

        $scope.tasks = [];

        PMDashboard.getCurrentTasks()
            .then(function(tasks) {
                $scope.tasks = tasks;
            })

    }]
);