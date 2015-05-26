/**
 * Created by scottmackenzie on 6/null5/15.
 */
myApp.controller("EffortFunctionPointCtrl", ['$scope', '$window', 'FunctionPointData', 'ProjectFactory',
    function ($scope, $window, FunctionPointData, ProjectFactory) {
        //$scope.ctrlName = "EffortCtrl";
        /* $scope.go allows you to go to the results page from input page */
        /*$scope.go = function (path) {
            $location.path(path);
        }*/
        console.log(FunctionPointData);
        $scope.functionPoints = [
            {
                title: "Number of External Inputs",
                count1: 0,
                count2: 0,
                count3: 0,
                low: 3,
                med: 4,
                high: 6
            },
            {
                title: "Number of External Outputs",
                count1: 0,
                count2: 0,
                count3: 0,
                low: 4,
                med: 5,
                high: 7
            },
            {
                title: "Number of External Queries",
                count1: 0,
                count2: 0,
                count3: 0,
                low: 3,
                med: 4,
                high: 6
            },
            {
                title: "Number of Internal Logical Files",
                count1: 0,
                count2: 0,
                count3: 0,
                low: 7,
                med: 10,
                high: 15
            },
            {
                title: " Number of External Interface Files",
                count1: 0,
                count2: 0,
                count3: 0,
                low: 5,
                med: 7,
                high: 10
            }];
        $scope.adjustmentFactor = [
            {
                id: "fp1",
                title: "How many data communication facilities are there?",
                value: 0
            },
            {
                id: "fp2",
                title: "How are distributed data and processing functions handled?",
                value: 0
            },
            {
                id: "fp3",
                title: "Was response time or throughput required by the user?",
                value: 0
            },
            {
                id: "fp4",
                title: "How heavily used is the current hardware platform?",
                value: 0
            },
            {
                id: "fp5",
                title: "How frequently are transactions executed?",
                value: 0
            },
            {
                id: "fp6",
                title: "What percentage of the information is entered online?",
                value: 0
            },
            {
                id: "fp7",
                title: "Was the application designed for end-user efficiency?",
                value: 0
            },
            {
                id: "fp8",
                title: "How many internal logic files are updated by online transactions?",
                value: 0
            },
            {
                id: "fp9",
                title: "Does the application have extensive logical or math processing?",
                value: 0
            },
            {
                id: "fp10",
                title: "Was the application developed to meet one or many user needs?",
                value: 0
            },
            {
                id: "fp11",
                title: "How difficult is conversion and installation?",
                value: 0
            },
            {
                id: "fp12",
                title: "How effective/automated are startup, backup, and recovery??",
                value: 0
            },
            {
                id: "fp13",
                title: "Was the application designed for multiple sites/organisations?",
                value: 0
            },
            {
                id: "fp14",
                title: "Was the application designed to facilitate change?",
                value: 0
            }
        ];
        /* if function points previously calculated, read the previous answers in so user can adjust previous answers */
        if(FunctionPointData.data.calculated === true) {
            var i = 0;
            FunctionPointData.data.adjustment_factor.forEach(function(af) {
                console.log(af);
              $scope.adjustmentFactor[i].value = af;
                i++;
            })
            for(var i = 0; i < 5; i++) {
                $scope.functionPoints[i].count1 = FunctionPointData.data.function_counts[i][0];
                $scope.functionPoints[i].count2 = FunctionPointData.data.function_counts[i][1];
                $scope.functionPoints[i].count3 = FunctionPointData.data.function_counts[i][2];
            }

        }
        $scope.submitFunctionPoints = function () {
            var functionPointCount = 0;
            var valueAdjustmentFactor = (Number($scope.adjustmentFactor[0].value) + Number($scope.adjustmentFactor[1].value) + Number($scope.adjustmentFactor[2].value) + Number($scope.adjustmentFactor[3].value) + Number($scope.adjustmentFactor[4].value) + Number($scope.adjustmentFactor[5].value) + Number($scope.adjustmentFactor[6].value) + Number($scope.adjustmentFactor[7].value) + Number($scope.adjustmentFactor[8].value) + Number($scope.adjustmentFactor[9].value) + Number($scope.adjustmentFactor[10].value) + Number($scope.adjustmentFactor[11].value) + Number($scope.adjustmentFactor[12].value) + Number($scope.adjustmentFactor[13].value));
            for (var i = 0; i < 5; i++) {
                functionPointCount += (Number($scope.functionPoints[i].count1) * Number($scope.functionPoints[i].low));
                functionPointCount += (Number($scope.functionPoints[i].count2) * Number($scope.functionPoints[i].med));
                functionPointCount += (Number($scope.functionPoints[i].count3) * Number($scope.functionPoints[i].high));
            }
            var adjustedFP = Number(functionPointCount) * (0.65 + 0.01 * Number(valueAdjustmentFactor));
            window.alert('Function Point Count = ' + Number(adjustedFP) + '.  This score has saved to your home dashboard');
            var valueArray = [], functionCounts = [];
            $scope.adjustmentFactor.forEach(function(af) {
                valueArray.push(af.value);
            })
            $scope.functionPoints.forEach(function(fp) {
                functionCounts.push([fp.count1, fp.count2, fp.count3]);
            })
            ProjectFactory.saveFunctionPointData($window.sessionStorage.projectName, adjustedFP, valueArray, functionCounts, true);
        }
    }
]);