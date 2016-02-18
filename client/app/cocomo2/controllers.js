

myApp.controller('Cocomo2Ctrl', ['$scope', '$window','$stateParams','cocomoFactory',
    function($scope, $window, $stateParams, cocomoFactory) {
    $scope.project = $stateParams.projectName;
    $scope.kLoc = {};
    $scope.softProj ={};
    $scope.product1 = {value: 0};
    $scope.product2 = {value: 0};
    $scope.product3 = {value: 0};
    $scope.hardware1 = {value: 0};
    $scope.hardware2 = {value: 0};
    $scope.hardware3 = {value: 0};
    $scope.hardware4 = {value: 0};
    $scope.personnel1 = {value: 0};
    $scope.personnel2 = {value: 0};
    $scope.personnel3 = {value: 0};
    $scope.personnel4 = {value: 0};
    $scope.personnel5 = {value: 0};
    $scope.project1 = {value: 0};
    $scope.project2 = {value: 0};
    $scope.project3 = {value: 0};

    $scope.submitCocomo = function () {
        $scope.eaf = Number($scope.product1.value) + Number($scope.product2.value) + Number($scope.product3.value);
        $scope.eaf += Number($scope.hardware1.value) + Number($scope.hardware2.value) + Number($scope.hardware3.value) + Number($scope.hardware4.value);
        $scope.eaf += Number($scope.personnel1.value) + Number($scope.personnel2.value) + Number($scope.personnel3.value) + Number($scope.personnel4.value) + Number($scope.personnel5.value);
        $scope.eaf += Number($scope.project1.value) + Number($scope.project2.value) + Number($scope.project3.value);
        if ($scope.softProj == 1) {
            $scope.cScore = 3.2*(Math.pow($scope.kLoc,1.05))*($scope.eaf);
        } else if ($scope.softProj == 2) {
            $scope.cScore = 3.0*(Math.pow($scope.kLoc,1.12))*($scope.eaf);
        } else{
            $scope.cScore = 2.8*(Math.pow($scope.kLoc,1.20))*($scope.eaf);
        }
        console.log($scope.project);
        console.log($scope.cScore);
        $scope.cocomoScores = {};
        cocomoFactory.saveCocomoScores($scope.project,$scope.cocomoScores, $scope.cScore,true);
    }

}])