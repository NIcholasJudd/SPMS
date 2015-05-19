/**
 * Created by nicholasjudd on 18/05/15.
 */
myApp.controller("ProjectModCtrl", ['$scope', 'ProjectFactory', 'UserFactory',
    function ($scope, ProjectFactory, UserFactory) {
    $scope.setProject={};
        ProjectFactory.getProjects().then(function (projects) {
            projects.data.forEach(function (projects) {
                $scope.projectData.push({
                    projectName: projects.project_name
                });
            });
        });
    })
])