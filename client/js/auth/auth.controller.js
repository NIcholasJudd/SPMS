/**
 * Created by scottmackenzie on 3/05/2015.
 * Modified by paulbeavis on 06/05/2015.
 *
 */

myApp.controller('LoginCtrl', ['$scope', '$window', '$location', 'UserAuthFactory', 'AuthenticationFactory',
    function($scope, $window, $location, UserAuthFactory, AuthenticationFactory) {
        //Hard coded user
        $scope.user = {};

        $scope.resetLogin = function(){
            $scope.user = {};
            $scope.loginForm.$setPristine();
        };

        $scope.login = function() {
            var username = $scope.user.username,
                password = $scope.user.password;
            if (username !== undefined && password !== undefined) {
                //fire request to login endpoint via factory
                UserAuthFactory.login(username, password).success(function(data) {
                    //set session variables
                    AuthenticationFactory.isLogged = true;
                    AuthenticationFactory.user = data.user.email;
                    AuthenticationFactory.userRole = data.user.user_type;
                    $window.sessionStorage.token = data.token;
                    $window.sessionStorage.user = data.user.email; // to fetch the user details on refresh
                    $window.sessionStorage.userRole = data.user.user_type; // to fetch the user details on refresh
                    //redirect user to home page
                    $location.path("/");
                }).error(function(status) {
                    alert('Oops something went wrong!');
                });
            } else {
                alert('Invalid credentials');
            }
        };

        $scope.greetingTime = function(){

            var currTime = (new Date()).getHours();
            if(currTime < 12) {
                return "Morning";
            }else if(currTime > 12 && currTime < 18){
                return "Afternoon";
            }else {
                return "Evening";
            }
        };

        $scope.getUserName = function(){
            return $window.sessionStorage.user;

        }
    }
]);