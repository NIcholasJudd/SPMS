/**
 * Created by nicholasjudd on 20/07/15.
 */
myApp.controller("signUpContainerCtrl", ['$scope', '$rootScope', 'signUp',
    function ($scope, $rootScope, signUp) {
        $scope.plans = signUp.getPlansListFromServer();
        console.log($scope.plans);
        $scope.selectedPlan= {};

        $scope.setPlan = function (plan) {
            $scope.selectedPlan = plan;
            console.log(plan);
        };

        $scope.submitUser = function(){
            console.log($scope.user);
        };
    }
]);