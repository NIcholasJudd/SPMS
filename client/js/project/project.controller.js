/**
 * Created by scottmackenzie on 5/05/2015.
 */

myApp.controller("ProjectCtrl", ['$scope','ProjectFactory',
    function($scope, ProjectFactory) {
        $scope.projectData = {
            projName: null,
            projDescription: null,
            estBudget: null,
            startDate: null,
            estimatedCompDate: null,
            usernamePM: null
        };
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

        $scope.submitProject = function() {
            console.log(this.projectData);
        }
    }
]);