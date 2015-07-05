/**
 * Created by scottmackenzie on 2/07/2015.
 */

/*myApp.controller("PMContainerCtrl", ['$scope', '$rootScope', 'PMDashboard',
    function ($scope, $rootScope, PMDashboard) {
       //$scope.PMDashboard = PMDashboard;
        //$scope.projectList = $scope.PMDashboard.getProjectList();
        //$scope.currentProject = PMDashboard.getCurrentProject();

        //$scope.PMDashboard = PMDashboard;
        $scope.projectList = [];//= PMDashboard.projects;//[]
        $scope.currentProject = {};// = PMDashboard.currentProject;//{}

        $rootScope.$on('switch project', function() {
            console.log('switch');
            $scope.projectList = PMDashboard.getProjectList();
            $scope.currentProject= PMDashboard.getCurrentProject();
        })


        //called when switching project tabs.  sets the current project in PMDashboard service,
        $scope.switchProject = function(index) {
            PMDashboard.setCurrentProject(index);
        }
    }]
);

myApp.controller("PMProjectTrackingCtrl", ['$scope', 'PMDashboard',
    function($scope, PMDashboard) {
    }]
);

myApp.controller("PMTasksCtrl", ['$scope', '$rootScope', '$stateParams', 'PMDashboard',
    function($scope, $rootScope, $stateParams, PMDashboard) {
        //$scope.PMDashboard = PMDashboard;
        $scope.currentProject = {};
        $scope.tasks = [];

        $rootScope.$on('switch project', function() {
            console.log('the old switcheroo');
            $scope.currentProject = PMDashboard.getCurrentProject();
            $scope.tasks = PMDashboard.getProjectTasks();
            console.log("Tasks: ", $scope.tasks);
        })

    }]
);

myApp.controller("PMStatisticsCtrl", ['$scope',
    function($scope) {

    }]
);*/

//watch version of controllers
myApp.controller("PMContainerCtrl", ['$scope', '$rootScope', 'PMDashboard',
        function ($scope, $rootScope, PMDashboard) {
            $scope.PMDashboard = PMDashboard;
            $scope.projectList = [];//= PMDashboard.projects;//[]
            $scope.currentProject = {};// = PMDashboard.currentProject;//{}

            $scope.$watch('PMDashboard.getProjectList()', function(projectList) {
                $scope.projectList = projectList;
            })

            $scope.$watch('PMDashboard.getCurrentProject()', function(newCurrentProject) {
                $scope.currentProject = newCurrentProject;
            })

            //called when switching project tabs.  sets the current project in PMDashboard service,
            $scope.switchProject = function(index) {
                PMDashboard.setCurrentProject(index);
            }
        }]
);

myApp.controller("PMProjectTrackingCtrl", ['$scope', 'PMDashboard',
        function($scope, PMDashboard) {
        }]
);

myApp.controller("PMTasksCtrl", ['$scope', '$stateParams', 'PMDashboard',
        function($scope, $stateParams, PMDashboard) {
            $scope.PMDashboard = PMDashboard;
            $scope.currentProject = {};
            $scope.tasks = [];

            $scope.$watch('PMDashboard.getCurrentProject()', function(newCurrentProject) {
                $scope.currentProject = newCurrentProject;
            })

            $scope.$watch('PMDashboard.getProjectTasks()', function(projectTasks) {
                $scope.tasks = projectTasks;
            })

        }]
);

myApp.controller("PMStatisticsCtrl", ['$scope',
        function($scope) {

        }]
);