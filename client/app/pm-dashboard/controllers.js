/**
 * Created by scottmackenzie on 2/07/2015.
 */

// to do:
// * tabs don't get reset properly on navigation away and return - wait to hear about tab refactor
// * not sure how modal works for openModal in tasks.html - need to verify whether the modal can use a
//   ui router state rather than templateUrl, controller etc defined in controller
// *

myApp.controller("PMContainerCtrl", ['$scope', '$rootScope', 'PMDashboard',
    function ($scope, $rootScope, PMDashboard) {

        $scope.projectList = PMDashboard.getProjectList();
        $scope.currentProject = PMDashboard.getCurrentProject();
        $scope.currentProjectIndex = PMDashboard.getCurrentProjectIndex();
        $scope.tasks = PMDashboard.getProjectTasks();
        $scope.seeTasks = false;

        $rootScope.$on('switch project', function() {
            $scope.projectList = PMDashboard.getProjectList();
            $scope.currentProject = PMDashboard.getCurrentProject();
            $scope.currentProjectIndex = PMDashboard.getCurrentProjectIndex();
            $scope.tasks = PMDashboard.getProjectTasks();
        })

        //called when switching project tabs.  sets the current project in PMDashboard service,
        $scope.switchProject = function(index) {
            PMDashboard.setCurrentProject(index);
        }


    }]
);

myApp.controller("PMProjectTrackingCtrl", ['$scope', 'PMDashboard',
    function($scope, PMDashboard) {
        $scope.currentProject = PMDashboard.getCurrentProject();
        //toggle display of tasks panel
        $scope.displayTasks = function() {
            $scope.$parent.seeTasks = !$scope.$parent.seeTasks;
        }
    }]
);

myApp.controller("PMTasksCtrl", ['$scope', '$rootScope', '$stateParams', 'PMDashboard',
    function($scope, $rootScope, $stateParams, PMDashboard) {

        $scope.currentProject = $scope.$parent.currentProject;
        $scope.tasks = $scope.$parent.tasks;

        $scope.markComplete = function(index) {
            PMDashboard.completeTask(index);
        }
    }]
);

myApp.controller("PMStatisticsCtrl", ['$scope', 'PMDashboard',
    function($scope, PMDashboard) {
        $scope.status = PMDashboard.getTaskStatus();

        //'task status' called when task marked as complete
        $scope.$on('task status', function() {
            $scope.status = PMDashboard.getTaskStatus();
            console.log($scope.status);
        })
    }]
);

myApp.controller("PMProgressCtrl", ['$scope', 'PMDashboard',
    function($scope, PMDashboard) {
        console.log("TEST 1");
        $scope.$on('switch project', function() {
            console.log("TEST 2");
            $scope.project = PMDashboard.getCurrentProject();
            $scope.startDate = new Date($scope.currentProject.startDate).toDateString();
            $scope.endDate = new Date($scope.currentProject.estimatedEndDate).toDateString();
            $scope.progress = calculateDateProgress($scope.startDate, $scope.endDate);
            console.log($scope.startDate);
            function calculateDateProgress(startDate, endDate) {
                var max = new Date(endDate) - new Date(startDate);
                var curr = new Date() - new Date(startDate);
                var total = ((100 / max) * curr);
                return total;
            }
        })
    }]
);

myApp.controller("PMCostManagementCtrl", ['$scope', 'PMDashboard',
        function($scope, PMDashboard) {
            $scope.$on('switch project', function() {
                $scope.project = PMDashboard.getCurrentProject();
            })

        }]
);