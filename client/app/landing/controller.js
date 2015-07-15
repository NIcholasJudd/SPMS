/**
 * Created by scottmackenzie on 14/07/15.
 */

myApp.controller("LandingCtrl", ['$scope', 'AuthenticationFactory',
        function($scope, AuthenticationFactory) {
            $scope.getState = function() {
                if(AuthenticationFactory.isLogged === true)
                    return "app.home";
                else
                    return "login";
            }

        }]
);