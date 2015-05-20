myApp.controller("TypeaheadCtrl", ['$scope','UserFactory', function ($scope, UserFactory, Roles, Skill) {

    $scope.selectedNames = undefined;
    $scope.selectedRoles = undefined;
    $scope.selectedSkill = undefined;
    $scope.roles = ["Developer", "Tester", "Bug Fixer", "Analyst", "Graphic Designer", "Interface Designer", "Server Designer", "Database Engineer"];
    $scope.skills = ["c++", "java", "html", "javascript", "Databases", "angular", "bootstrap"];
    $scope.user = [];
    UserFactory.getUsers().then(function (results) {
        console.log('HERE:', results.data);
        results.data.forEach(function (user) {
            $scope.user.push(user.first_name + ' ' + user.last_name)
        })
    })

}]);