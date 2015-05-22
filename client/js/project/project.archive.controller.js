/**
 * Created by scottmackenzie on 23/05/15.
 */

myApp.controller("ProjectArchiveCtrl", ['$scope', '$window', '$route', 'ProjectFactory', 'CurrentProject', 'ArchivedProjects', '$window',
    function($scope, $window, $route, ProjectFactory, CurrentProject, ArchivedProjects, $window) {
        $scope.archiveReason;
        $scope.archivedProjects = ArchivedProjects.data;

        $scope.projectData = {
            projectName : CurrentProject.data.project_name,
            budget : CurrentProject.data.budget,
            startDate : new Date(CurrentProject.data.start_date).toString(),
            endDate : new Date(CurrentProject.data.estimated_end_date).toString(),
            projectManager : CurrentProject.data.project_manager,
            description : CurrentProject.data.description,
            active : CurrentProject.data.active
        }
        console.log($scope.projectData.active);

        $scope.archiveProject = function(projectName, archiveReason) {
            ProjectFactory.archiveProject(projectName, false, archiveReason).then(function(result) {
                console.log(result);
                alert((result.data[0][0].project_name) + ' has been archived');
                $route.reload();//$window.location.href = '/#/project/archive';
            })
        }

        $scope.restoreProject = function(projectName) {
            ProjectFactory.archiveProject(projectName, true, '').then(function(result) {
                console.log(result);
                alert((result.data[0][0].project_name) + ' has been restored');
                $route.reload();//$window.location.href = '/#/project/archive';
            })
        }

        /*$rootScope.$on('project archived'), function() {
            ProjectFactory.getArchivedProjects().then(function(result) {
                console.log(result.data);
                $scope.archivedProjects = result.data;
                //$scope.$apply();
            })
        }*/
    }
]);
