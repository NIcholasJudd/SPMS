/**
 * Created by scottmackenzie on 2/07/2015.
 */

// FIXME: on first load not setting first project as active
// FIXME: Not getting COCOMO Score on load of pm-dash
// FIXME: Not pulling function point data as of yet
// FIXME: bootstrap glyphicons dont work in firefox or chrome
// FIXME: I dont like the color scheme
// TODO Build Pert analysis
// TODO no task data implemented yet
// TODO Create and design an issue or bug list for projects and tasks
// TODO create and design a comment interface
// TODO create and design a chat box

myApp.controller("PMContainerCtrl", ['$scope', '$window', '$rootScope', 'PMDashboard', 'cocomoFactory',
    function ($scope, $window, $rootScope, PMDashboard, cocomoFactory) {
        $scope.$parent.taskView = false;
        $scope.currentProjectIndex =  PMDashboard.getCurrentProjectIndex();
        //$scope.functionPoints = PMDashboard
        $scope.projectList = PMDashboard.getProjectList();
        $scope.currentProject = PMDashboard.getCurrentProject();
        $scope.tasks = PMDashboard.getProjectTasks();
        getCocomo();

        $rootScope.$on('switch project', function() {
            $scope.projectList = PMDashboard.getProjectList();
            $scope.currentProject = PMDashboard.getCurrentProject();
            getCocomo();

            $scope.tasks = PMDashboard.getProjectTasks();

        });

        //called when switching project tabs.  sets the current project in PMDashboard service,
        $scope.switchProject = function(index) {
            PMDashboard.setCurrentProject(index);
            $scope.currentProjectIndex = index;
        }

        function getCocomo() {
            cocomoFactory.getCocomoScores($scope.currentProject.projectName)
                .then(
                    function(result)    {
                        $scope.cocomoScores = result.data;
                    }
                )
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

myApp.controller("PMStatisticsCtrl", ['$scope', 'PMDashboard', 'cocomoFactory',
    function($scope, PMDashboard, cocomoFactory) {
        $scope.pert = -1;
        $scope.status = PMDashboard.getTaskStatus();
        //'task status' called when task marked as complete
        $scope.$on('task status', function() {
            $scope.status = PMDashboard.getTaskStatus();
        })
        $scope.displayTasks = function() {
            console.log($scope.$parent.taskView);
            $scope.$parent.taskView = !$scope.$parent.taskView;

        }
    }]
);

myApp.controller("PMProgressCtrl", ['$scope', 'PMDashboard',
    function($scope, PMDashboard) {
        $scope.$on('switch project', function() {
            $scope.project = PMDashboard.getCurrentProject();
            $scope.startDate = new Date($scope.currentProject.startDate).toDateString();
            $scope.endDate = new Date($scope.currentProject.estimatedEndDate).toDateString();
            $scope.progress = calculateDateProgress($scope.startDate, $scope.endDate);
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