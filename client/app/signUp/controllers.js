/**
 * Created by nicholasjudd on 20/07/15.
 */
myApp.controller("signUpContainerCtrl", ['$scope', '$rootScope', 'signUp',
    function ($scope, $rootScope, signUp) {
        $scope.plans=[];
        $scope.test = "TEST";
        signUp.getPlansListFromServer().then(function(data)
        {
            $scope.plans = data;
            console.log($scope.test);

        });
        $scope.selectedPlan= {};
        console.log($scope.plans);
        $scope.setPlan = function (plan) {
            $scope.selectedPlan = plan;
            console.log(plan);
        };

        $scope.submitUser = function(){
            console.log($scope.user);
            console.log($scope.selectedPlan);
        };
    }
]);