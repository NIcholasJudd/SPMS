/**
 * Created by nicholasjudd on 20/07/15.
 */
myApp.controller("signUpContainerCtrl", ['$scope', '$rootScope', 'signUp',
    function ($scope, $rootScope, signUp) {
        $scope.plans = signUp.getPlanList();
        $scope.selectedPlan = [];

        $scope.setPlan = function(Plan) {
            $scope.selectedPlan = Plan;
        };
        $scope.submitUser = function(){
            console.log($scope.plans);
            console.log($scope.selectedPlan);
        };
    }
]);