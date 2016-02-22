/**
 * Created by scottmackenzie on 14/07/15.
 */
// TODO what goes here looks crap
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