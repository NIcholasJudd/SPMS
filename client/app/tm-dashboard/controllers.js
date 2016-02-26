/**
 * Created by scottmackenzie on 8/07/15.
 */

myApp.controller("TMContainerCtrl", ['$scope', '$rootScope', 'PMDashboard', 'TMDashboard',
    function ($scope, $rootScope, PMDashboard, TMDashboard) {
        getProjectList();

        function getProjectList() {
            TMDashboard.getTmProjects()
                .then(
                    function(result)    {
                        $scope.projectList =  result;
                        $scope.currentProjectIndex =  TMDashboard.getCurrentProjectIndex();
                        $scope.currentProject = TMDashboard.getCurrentProject();

                        getProjectTasks();
                    }
                );
        }

        function getProjectTasks() {
            TMDashboard.getTmTasks()
                .then(
                    function(result) {
                        $scope.tasks = result;
                    }
                );
        }
    }]
);

myApp.controller("TMDataCtrl", ['$scope', '$rootScope', 'PMDashboard', 'TMDashboard',
    function ($scope, $rootScope, PMDashboard, TMDashboard) {
        $scope.$parent.assigned = true;
        $scope.$parent.progress = false;
        $scope.$parent.complete = false;

        $scope.displayAssigned = function() {
            $scope.$parent.assigned = true;
            $scope.$parent.progress = false;
            $scope.$parent.complete = false;
        }

        $scope.displayProgress = function() {
            $scope.$parent.assigned = false;
            $scope.$parent.progress = true;
            $scope.$parent.complete = false;
        }

        $scope.displayComplete = function() {
            $scope.$parent.assigned = false;
            $scope.$parent.progress = false;
            $scope.$parent.complete = true;
        }
    }]
);

myApp.controller("TMAssignedCtrl", ['$scope', '$rootScope', 'PMDashboard', 'TMDashboard',
    function ($scope, $rootScope, PMDashboard, TMDashboard) {
    }]
);
myApp.controller("TMProgressCtrl", ['$scope', '$rootScope', 'PMDashboard', 'TMDashboard',
    function ($scope, $rootScope, PMDashboard, TMDashboard) {

    }]
);
myApp.controller("TMCompleteCtrl", ['$scope', '$rootScope', 'PMDashboard', 'TMDashboard',
    function ($scope, $rootScope, PMDashboard, TMDashboard) {

    }]
);

