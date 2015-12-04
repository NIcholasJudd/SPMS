/**
 * Created by scottmackenzie on 23/05/15.
 */

myApp.controller("ProjectArchiveCtrl", ['$scope', '$rootScope', '$window', '$route', 'ProjectFactory', 'ActiveProjects',
    'ArchivedProjects', '$window',
    function($scope, $rootScope, $window, $route, ProjectFactory, ActiveProjects, ArchivedProjects, $window) {
        $scope.archiveReason;
        $scope.activeProjects = ActiveProjects.data;
        $scope.archivedProjects = ArchivedProjects.data;

        $scope.archiveProject = function(projectName, archiveReason) {
            console.log(projectName, archiveReason);
            ProjectFactory.archiveProject(projectName, false, archiveReason).then(function(result) {
                console.log(result);
                if(!archiveReason) {
                    alert('Error: Please provide an archive reason');
                    return;
                }
                if($window.sessionStorage.projectName === projectName)
                    $window.sessionStorage.projectName = "";
                alert((result.data[0][0].project_name) + ' has been archived');
                $rootScope.$broadcast('project-update');
            })
        }

        $scope.restoreProject = function(projectName) {
            ProjectFactory.archiveProject(projectName, true, '').then(function(result) {
                alert((result.data[0][0].project_name) + ' has been restored');
                $rootScope.$broadcast('project-update');
            })
        }
        $scope.$on('project-update', function() {
            ProjectFactory.getProjects().then(function(result) {
                $scope.activeProjects = result.data;
            });
            ProjectFactory.getArchivedProjects().then(function(result) {
                $scope.archivedProjects = result.data;
            });
            console.log($scope.activeProjects);
        })
    }
]);
