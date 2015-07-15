/**
 * Created by scottmackenzie on 13/07/15.
 */

myApp.controller("ErrorCtrl", ['$scope', 'PreviousState', 'AuthenticationFactory',
        function($scope, PreviousState, AuthenticationFactory) {
            //previousState used in back button on error page
            $scope.previousState = PreviousState.name;
            //if no previous state found, generate state based on current authentication
            if ($scope.previousState === '') {
                if (AuthenticationFactory.isLogged == true)//if logged in, send back to home screen
                    $scope.previousState = 'app.home';
                else //otherwise send to login
                    $scope.previousState = 'login';
            }
        }]
);