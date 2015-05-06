/**
 * Created by scottmackenzie on 3/05/2015.
 */

myApp.controller('LoginCtrl', ['$scope', '$window', '$location', 'UserAuthFactory', 'AuthenticationFactory',
    function($scope, $window, $location, UserAuthFactory, AuthenticationFactory) {
        //Hard coded user
        $scope.user = {};
        $scope.login = function() {
            var username = $scope.user.username,
                password = $scope.user.password;
            if (username !== undefined && password !== undefined) {
                //fire request to login endpoint via factory
                UserAuthFactory.login(username, password).success(function(data) {
                    //set session variables
                    AuthenticationFactory.isLogged = true;
                    AuthenticationFactory.user = data.user.username;
                    AuthenticationFactory.userRole = data.user.userrole;
                    console.log('Role: ', AuthenticationFactory);
                    $window.sessionStorage.token = data.token;
                    $window.sessionStorage.user = data.user.username; // to fetch the user details on refresh
                    $window.sessionStorage.userRole = data.user.userrole; // to fetch the user details on refresh
                    //redirect user to home page
                    $location.path("/");
                }).error(function(status) {
                    alert('Oops something went wrong!');
                });
            } else {
                alert('Invalid credentials');
            }
        };
    }
]);