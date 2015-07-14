/**
 * Created by scottmackenzie on 8/07/15.
 */

myApp.controller("TMContainerCtrl", ['$scope', '$rootScope', 'PMDashboard',
    function($scope, $rootScope, PMDashboard) {
        $scope.projectList = PMDashboard.getProjectList();
        $scope.currentProject= PMDashboard.getCurrentProject();
        $scope.currentPanel = "assigned";
        $scope.projectIndex = PMDashboard.getCurrentProjectIndex();

        $rootScope.$on('switch project', function() {
            $scope.projectList = PMDashboard.getProjectList();
            $scope.currentProject= PMDashboard.getCurrentProject();
        })

        //called when switching project tabs.  sets the current project in PMDashboard service,
        $scope.switchProject = function(index) {
            PMDashboard.setCurrentProject(index);
        }
    }]
);

myApp.controller("TMStatisticsCtrl", ['$scope', 'PMDashboard',
        function($scope, PMDashboard) {
            $scope.status = PMDashboard.getTaskStatus();

            $scope.switchPanel = function(panelName) {
                $scope.$parent.currentPanel = panelName;
            }
        }]
);

myApp.controller("TMDetailsCtrl", ['$scope', 'PMDashboard',
        function($scope, PMDashboard) {
            $scope.tasks = PMDashboard.getProjectTasks();
        }]
);

/* That'll do for now */

myApp.controller("TMAssignedCtrl", ['$scope', 'PMDashboard',
        function($scope, PMDashboard) {
            $scope.tasks = PMDashboard.getProjectTasks();
        }]
);

myApp.controller("TMProgressCtrl", ['$scope', 'PMDashboard',
        function($scope, PMDashboard) {
            $scope.tasks = PMDashboard.getProjectTasks();
        }]
);

myApp.controller("TMCompleteCtrl", ['$scope', 'PMDashboard',
        function($scope, PMDashboard) {
            $scope.tasks = PMDashboard.getProjectTasks();
        }]
);