/**
 * Created by scottmackenzie on 5/05/2015.
 */

myApp.controller("ProjectCtrl", ['$scope','ProjectFactory',
    function($scope, ProjectFactory) {
        $scope.ctrlName = "ProjectCtrl";
        $scope.factoryName = "ProjectFactory";
        $scope.projects = ProjectFactory.getProjects();
        console.log(ProjectFactory.getProjects());
        /*ProjectFactory.getProjects().then(function(projects) {
            $scope.projects = projects;
        })*/
        $scope.addProject = function(name, description, duration) {
            ProjectFactory.addProject(name, description, duration);
        }
    }
]);