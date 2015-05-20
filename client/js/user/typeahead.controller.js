myApp.controller("TypeaheadCtrl", ['$scope','UserFactory', function ($scope, UserFactory, Roles, Skill) {

    $scope.selected = undefined;
    $scope.roles = Roles;
    $scope.skills = Skill;
    $scope.user = [];
    UserFactory.getUsers().then(function (results) {
        console.log('HERE:', results.data);
        results.data.forEach(function (user) {
            $scope.user.push(user.first_name + ' ' + user.last_name)
        })
    })

}]);