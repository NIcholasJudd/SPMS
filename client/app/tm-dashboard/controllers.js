/**
 * Created by scottmackenzie on 8/07/15.
 */

myApp.controller("TMContainerCtrl", ['$scope', '$rootScope', 'PMDashboard', 'TMDashboard',
    function ($scope, $rootScope, PMDashboard, TMDashboard) {
        getProjectList();

        console.log($scope.projectList);

        function getProjectList() {
            TMDashboard.getTmTasks()
                .then(
                    function(result)    {
                        $scope.projectList =  result;
                    }
                );
        }
    }]
);

myApp.controller("TMDataCtrl", ['$scope', '$rootScope', 'PMDashboard', 'TMDashboard',
    function ($scope, $rootScope, PMDashboard, TMDashboard) {
        console.log("TESTY");
    }]
);

/*
myApp.controller("TMStatisticsCtrl", ['$scope', 'PMDashboar         function($scope, PMDashboard) {
        $scope.status = PMDashboard.getTaskStatus();

        $scope.switchPanel =  function(panelName) {
            $scope.$parent.currentPanel = panelName;
              }]
);

myApp.controller("TMDetailsCtrl", ['$scope', 'PMDashboar         function($scope, PMDashboard) {
        $scope.tasks = PMDashboard.getProjectTasks        }]
);

myApp.controller("TMAssignedCtrl", ['$scope', 'PMDashboar         function($scope, PMDashboard) {
        $scope.tasks = PMDashboard.getProjectTasks        }]
);

myApp.controller("TMProgressCtrl", ['$scope', 'PMDashboar         function($scope, PMDashboard) {
        $scope.tasks = PMDashboard.getProjectTasks        }]
);

myApp.controller("TMCompleteCtrl", ['$scope', 'PMDashboar         function($scope, PMDashboard) {
        $scope.tasks = PMDashboard.getProjectTasks        }]
);*/