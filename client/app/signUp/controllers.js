/**
 * Created by nicholasjudd on 20/07/15.
 */
myApp.controller("signUpContainerCtrl", ['$scope', '$rootScope', 'signUp', '$q',
    function ($scope, $rootScope, signUp, $q) {
        $scope.plans = signUp.getPlanList();
        $scope.selectedPlan = [];
        $scope.user = {};
        $scope.setPlan = function (Plan) {
            $scope.selectedPlan = Plan;
        };
        $scope.submitUser = function () {
            if (checkValidity()) {
                console.log("HELLO");
            } else {
                console.log("HEY THERE");
            }
        };

        function checkValidity() {
            $scope.error = false;
            // signUp.checkIfUserExists($scope.user.emailAddress);
            $q.all(signUp.checkIfUserExists())
            signUp.checkIfUserExists($scope.user.emailAddress)
                .then(function(data){
                    $scope.error = data;
                    this.console.log($scope.error);
                });
            console.log($scope.error);

            /*if ($scope.userError.status === 2){
             console.log("HEY");
             }
             //$scope.error = signUp.checkIfAccountExists($scope.user.accountName);
             if (typeof $scope.user.emailAddress == "undefined" || !$scope.user.emailAddress){
             console.log("test1");
             $scope.error = true;
             }
             if ($scope.user.password != $scope.user.passwordCheck) {
             console.log($scope.user.password);
             console.log($scope.user.passwordCheck);
             console.log("test2");
             $scope.error = true;
             }
             if (!$scope.user.firstName) {
             console.log("test3");
             $scope.error = true;
             }
             if (!$scope.user.lastName) {
             console.log("test4");
             $scope.error = true;
             }
             if (!$scope.user.phone){
             console.log("test5");
             $scope.error = true;
             }
             if (typeof $scope.user.password == "undefined" ||!$scope.user.password || $scope.user.password.length < 4) {
             console.log("test5");
             $scope.error = true;
             }
             */if ($scope.error === true) {
             console.log("test6");
             return true;
             }else{
             console.log("test7");
             return false;
             }
        }
    }
]);