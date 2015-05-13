/**
 * Created by scottmackenzie on 5/05/2015.
 */
myApp.controller("UserCtrl", ['$scope', 'UserFactory',
    function($scope, UserFactory) {
        //$scope.users = [];
// Access the factory and get the latest user list
        /*UserFactory.getUsers().then(function(user) {
            $scope.users = user.data;
        });*/
        /*$scope.user = {
            email : 'test@test',
            firstName : 'Terry',
            lastName : 'Sterling',
            password : 'password',
            phone : '0299999999',
            role : 'Administrator',
            performanceIndex : 0,
            previousRoles : ['Developer', 'Tester']
        };*/

        /*if you're testing user create and can't be fucked filling out the form, replace the $scope.user below
          with the one above (you'll still need to pick the role from dropdown menu)
         */
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
            UserFactory.createUser($scope.user).success(function(err, res) {
                alert($scope.user.email + ' successfully saved in database');
            }).error(function(err, res) {
                var err_msg = "save user failed: ";
                if(err.code == "23505")
                    err_msg += "that user already exists";
                else
                    err_msg += err.detail;
                alert(err_msg);
            })
        }

        $scope.submitUser = function() {
            console.log($scope.user);
        }

    }
]);