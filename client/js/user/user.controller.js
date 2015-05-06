/**
 * Created by scottmackenzie on 5/05/2015.
 */
myApp.controller("UserCtrl", ['$scope', 'UserFactory',
    function($scope, UserFactory) {
        $scope.users = [];
        //$scope.test = 69;
// Access the factory and get the latest products list
        UserFactory.getUsers().then(function(user) {
            $scope.users = user.data;
        });
        $scope.user = {};
        $scope.roles = ['admin', 'user'];
        $scope.selected = undefined;
        $scope.skills = [
            { title: 'C++'},
            { title: 'Java'},
            { title: 'MySQL'},
            { title: 'HTML'},
            { title: 'JavaScript'},
            { title: 'AngularJS'},
            { title: 'C'},
            { title: 'Python'},
            { title: 'C#'},
            { title: 'Objective C'}
        ];


        $scope.show = function() {
            console.log($scope.user);
        }
        $scope.saveuser = function() {
            UserFactory.saveUser($scope.user).success(function(err, res) {
                alert($scope.user.username + ' successfully saved in database');
            }).error(function(err, res) {
                var err_msg = "save user failed: ";
                if(err.code == "23505")
                    err_msg += "that user already exists";
                else
                    err_msg += err.detail;
                alert(err_msg);
            })
        }
    }
]);