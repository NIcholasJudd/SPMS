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
            $scope.functionPoints = [
            {
                  title: "Number of External Inputs",
                  count: null,
                  wf: null,
                  low: 3,
                  med: 4,
                  high: 6
            },
            {
                  title: "Number of External Outputs",
                  count: null,
                  wf: null,
                  low: 4,
                  med: 5,
                  high: 7
            },
            {
                  title: "Number of External Queries",
                  cout: null,
                  wf: null,
                  low: 3,
                  med: 4,
                  high: 6
            },
            {
                  title: "Number of Internal Logical Files",
                  count: null,
                  wf: null,
                  low: 7,
                  med: 10,
                  high: 15
            },
            {
                  title: " NUmber of External Interface Files",
                  count: null,
                  wf:null,
                  low: 5,
                  med: 7,
                  high: 10
            }];
       	$scope.adjustmentFactor = [
       	{ 	
       		id: "fp1",
       		title: "How many data communication facilities are there?",
       		value: null
       	},
       	{
       		id: "fp2",
       		title: "How are distributed data and processing functions handled?",
       		value: null
       	},
       	{
       		id: "fp3",
       		title: "Was response time or throughput required by the user?",
       		value: null
       	},
       	{ 	
       		id: "fp4",
       		title: "How heavily used is the current hardware platform?",
       		value: null
       	},
       	{
       		id: "fp5",
       		title: "How frequently are transactions executed?",
       		value: null
       	},
       	{
       		id: "fp6",
       		title: "What percentage of the information is entered online?",
       		value: null
       	},
       	{ 	
       		id: "fp7",
       		title: "Was the application designed for end-user efficiency?",
       		value: null
       	},
       	{
       		id: "fp8",
       		title: "How many internal logic files are updated by online transactions?",
       		value:null
       	},
       	{
       		id: "fp9",
       		title: "Does the application have extensive logical or math processing?",
       		value: null
       	},
       	{ 	
       		id: "fp10",
       		title: "Was the application developed to meet one or many user needs?",
       		value: null
       	},
       	{
       		id: "fp11",
       		title: "How difficult is conversion and instalation?",
       		value: null
       	},
       	{
       		id: "fp12",
       		title: "How effective/automated are startup, backup, and recovery??",
			value: null
       	},
       	{ 	
       		id: "fp13",
       		title: "Was the application designed for multiple sites/organisations?",
       		value: null
       	},
       	{
       		id: "fp14",
       		title: "Was the application designed to facilitate change?",
       		value: null
       	}
       	];
       	$scope.ValueAdjustmentFactor={
       		value: null
       	};
            $scope.functionPointCount = {
                  value:null
            };
       	$scope.submitCocomo = function() {
       		var sf= (0.91 + 0.01 * (Number($scope.PREC.value) + Number($scope.FLEX.value) + Number($scope.RESL.value) + Number($scope.TEAM.value) + Number($scope.PMAT.value)));
       		var pm= 2.94 * Math.pow((Number($scope.systemSize.value)/1000),sf);
       		pm = pm * (Number($scope.RCPX.value)) * (Number($scope.RUSE.value)) * (Number($scope.PDIF.value)) * (Number($scope.PERS.value)) * (Number($scope.PREX.value)) * (Number($scope.FCIL.value)) * (Number($scope.SCED.value));
       		pm = pm/(Number($scope.staffSize.value));
       		pm = pm.toPrecision(4);
       		window.alert(pm + " person months");
       	}
       	$scope.submitFunctionPoints = function() {
       		$scope.ValueAdjustmentFactor.value = (Number($scope.adjustmentFactor[0].value) + Number($scope.adjustmentFactor[1].value) + Number($scope.adjustmentFactor[2].value) + Number($scope.adjustmentFactor[3].value) + Number($scope.adjustmentFactor[4].value) + Number($scope.adjustmentFactor[5].value) + Number($scope.adjustmentFactor[6].value) + Number($scope.adjustmentFactor[7].value) + Number($scope.adjustmentFactor[8].value) + Number($scope.adjustmentFactor[9].value) + Number($scope.adjustmentFactor[10].value) + Number($scope.adjustmentFactor[11].value) + Number($scope.adjustmentFactor[12].value) + Number($scope.adjustmentFactor[13].value));
			for (var i = 0; i < 5; i++){
                        $scope.functionPointCount.value += (Number($scope.functionPoints[i].count) * Number($scope.functionPoints[i].wf));
                  }
                  var adjustedFP = Number($scope.functionPointCount.value) * (0.65 + 0.01 * Number($scope.ValueAdjustmentFactor.value));
                  window.alert(Number(adjustedFP));
       	}
    }
]);