/**
 * Created by scottmackenzie on 6/null5/15.
 */
myApp.controller("EffortCtrl", ['$scope', 'ProjectFactory',
    function($scope, $location) {
        $scope.ctrlName = "EffortCtrl";
        /* $scope.go allows you to go to the results page from input page */
        $scope.go = function(path) {
            $location.path(path);
        }
       	$scope.systemSize =
       	{ value: null};
       	$scope.staffSize =
       	{value: null};
       	$scope.PREC = 
       	{ value: null};
       	$scope.FLEX = 
       	{ value: null};
       	$scope.RESL =
       	{ value: null};
       	$scope.TEAM =
       	{ value: null};
       	$scope.PMAT =
       	{ value: null};

       	$scope.RCPX =
       	{value: null};
       	$scope.RUSE =
       	{value: null};
       	$scope.PDIF =
       	{value: null};
       	$scope.PERS =
       	{value: null};
       	$scope.PREX =
       	{value: null};
       	$scope.FCIL =
       	{value: null};
       	$scope.SCED =
       	{value: null};

       	$scope.adjustmentFactor = 
       	{
       		one: null,
       		two: null,
       		three: null,
       		four: null,
       		five: null,
       		six: null,
       		seven: null,
       		eight: null,
       		nine: null,
       		ten: null,
       		tweleve: null,
       		thirteen: null,
       		fourteen: null
       	};
       	$scope.ValueAdjustmentFactor={
       		value: null
       	};
       	$scope.submitCocomo = function() {
       		var sf= (0.91 + 0.01 * (Number($scope.PREC.value) + Number($scope.FLEX.value) + Number($scope.RESL.value) + Number($scope.TEAM.value) + Number($scope.PMAT.value)));
       		var pm= 2.94 * Math.pow((Number($scope.systemSize.value)/1000),sf);
       		pm = pm * (Number($scope.RCPX.value)) * (Number($scope.RUSE.value)) * (Number($scope.PDIF.value)) * (Number($scope.PERS.value)) * (Number($scope.PREX.value)) * (Number($scope.FCIL.value)) * (Number($scope.SCED.value));
       		pm = pm/(Number($scope.staffSize.value));
       		pm = pm.toPrecision(4);
       		window.alert(pm + " person months");
       	}
       	$scope.setValue = function(name, value) {
       		console.log(name);
       		console.log(value);
       	}
       	$scope.submitFunctionPoints = function() {
       		$scope.ValueAdjustmentFactor.value = (Number($scope.adjustmentFactor.one) + Number($scope.adjustmentFactor.two) + Number($scope.adjustmentFactor.three) + Number($scope.adjustmentFactor.four) + Number($scope.adjustmentFactor.five) + Number($scope.adjustmentFactor.six) + Number($scope.adjustmentFactor.eight) + Number($scope.adjustmentFactor.nine) + Number($scope.adjustmentFactor.ten) + Number($scope.adjustmentFactor.eleven) + Number($scope.adjustmentFactor.twelve) + Number($scope.adjustmentFactor.thirteen) + Number($scope.adjustmentFactor.fourteen));
       		console.log($scope.adjustmentFactor);
       	}
    }
]);