/**
 * Created by scottmackenzie on 5/05/2015.
 */
myApp.controller("UserCtrl", ['$scope', 'UserFactory',
    function($scope, UserFactory) {

        $scope.user = {
            email : "",
            firstName : "",
            lastName : "",
            password : "",
            phone : "",
            role : "",
            performanceIndex : 0,
            previousRoles : ['Developer', 'Tester']
        };
        $scope.roles = [{name: 'Administrator'}, {name: 'Team Member'}];
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

        $scope.selectedRole = {name: 'Available Roles:'};

        $scope.setRole= function(role){
          $scope.selectedRole = role;
            $scope.user.role = role.name.toLowerCase();
        };

        $scope.show = function() {
            console.log($scope.user);
        }
        $scope.saveUser = function() {
            var msg = "Form error: ";
            var ok = true;
            if(!$scope.user.firstName) {
                ok = false;
                msg += "first name missing\n";
            }
            if(!$scope.user.lastName) {
                ok = false;
                msg += "last name missing\n";
            }
            if(!$scope.user.email) {
                ok = false;
                msg += "email missing\n";
            }
            if(!$scope.user.password) {
                ok = false;
                msg += "password missing\n";
            }
            if(!$scope.user.role) {
                ok = false;
                msg += "role missing\n";
            }
            if(ok === false) {
                alert(msg);
                return;
            }
            console.log("USER: ", $scope.user);
            UserFactory.createUser($scope.user).success(function(err, res) {
                alert($scope.user.email + ' successfully saved in database');
            }).error(function(err, res) {
                var msg = "Create user failed: " + err;
                console.log(err);
                alert(msg);
            })
        }

        $scope.submitUser = function() {
            console.log($scope.user);
        }



    }
]);