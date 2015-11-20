/**
 * Created by scottmackenzie on 3/05/2015.
 * Modified by paulbeavis on 06/05/2015.
 *
 */

myApp.controller('LoginCtrl', ['$scope', '$window', '$state', 'UserAuthFactory', 'AuthenticationFactory',
    function($scope, $window, $state, UserAuthFactory, AuthenticationFactory) {
        //Hard coded user
        $scope.user = {};
        $scope.location = $window.location;
        $scope.company = $scope.location.host;
        $scope.resetLogin = function(){
            $scope.user = {};
            $scope.loginForm.$setPristine();
        };

        $scope.signUp = function(){
            $state.go("signUp");
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
                    AuthenticationFactory.userRole = data.user.userType;
                    $window.sessionStorage.token = data.token;
                    $window.sessionStorage.user = data.user.email; // to fetch the user details on refresh
                    $window.sessionStorage.firstName = data.user.firstName;
                    $window.sessionStorage.userRole = data.user.userType; // to fetch the user details on refresh
                    //redirect user to home page
                    $state.go("app.home");
                }).error(function(status) {
                    alert('Please check your email and password, and try again');
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
            return $window.sessionStorage.firstName;
        }
    }
]);