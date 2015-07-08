/**
 * Created by scottmackenzie on 8/07/15.
 */

myApp.controller("TMContainerCtrl", ['$scope', '$rootScope', 'PMDashboard',
    function($scope, $rootScope, PMDashboard) {
        $scope.projectList = PMDashboard.getProjectList();
        $scope.currentProject= PMDashboard.getCurrentProject();
        //console.log($scope.projectList);

        $rootScope.$on('switch project', function() {
            $scope.projectList = PMDashboard.getProjectList();
            $scope.currentProject= PMDashboard.getCurrentProject();
            //$scope.currentProjectIndex = PMDashboard.getCurrentProjectIndex();
            //$scope.tasks = PMDashboard.getProjectTasks();
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
            console.log("HERE FUCKER", $scope.status);
        }]
);

myApp.controller("TMDetailsCtrl", ['$scope', 'PMDashboard',
        function($scope, PMDashboard) {
            $scope.tasks = PMDashboard.getProjectTasks();
        }]
);