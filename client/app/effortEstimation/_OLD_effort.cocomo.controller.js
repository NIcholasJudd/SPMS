/**
 * Created by scottmackenzie on 6/05/15.
 */
myApp.controller("EffortCocomoCtrl", ['$scope', '$window', 'ProjectFactory', 'CocomoScores',
    function ($scope, $window, ProjectFactory, CocomoScores) {
        $scope.systemSize = {value: 0};
        $scope.staffSize = {value: 0};
        //scale factors
        $scope.PREC = {value: 0};
        $scope.FLEX = {value: 0};
        $scope.RESL = {value: 0};
        $scope.TEAM = {value: 0};
        $scope.PMAT = {value: 0};
        //multipliers
        $scope.RCPX = {value: 0};
        $scope.RUSE = {value: 0};
        $scope.PDIF = {value: 0};
        $scope.PERS = {value: 0};
        $scope.PREX = {value: 0};
        $scope.FCIL = {value: 0};
        $scope.SCED = {value: 0};
        //if cocomoScores previously calculated, assign previous values
        if(CocomoScores.data.calculated === true) {
            $scope.systemSize.value = CocomoScores.data.cocomo_scores[0];
            $scope.staffSize.value = CocomoScores.data.cocomo_scores[1];
            $scope.PREC.value = CocomoScores.data.cocomo_scores[2];
            $scope.FLEX.value = CocomoScores.data.cocomo_scores[3];
            $scope.RESL.value = CocomoScores.data.cocomo_scores[4];
            $scope.TEAM.value = CocomoScores.data.cocomo_scores[5];
            $scope.PMAT.value = CocomoScores.data.cocomo_scores[6];
            $scope.RCPX.value = CocomoScores.data.cocomo_scores[7];
            $scope.RUSE.value = CocomoScores.data.cocomo_scores[8];
            $scope.PDIF.value = CocomoScores.data.cocomo_scores[9];
            $scope.PERS.value = CocomoScores.data.cocomo_scores[10];
            $scope.PREX.value = CocomoScores.data.cocomo_scores[11];
            $scope.FCIL.value = CocomoScores.data.cocomo_scores[12];
            $scope.SCED.value = CocomoScores.data.cocomo_scores[13];
        }

        $scope.submitCocomo = function () {
            var sf = (0.91 + 0.01 * (Number($scope.PREC.value) + Number($scope.FLEX.value) + Number($scope.RESL.value) + Number($scope.TEAM.value) + Number($scope.PMAT.value)));
            var pm = 2.94 * Math.pow((Number($scope.systemSize.value) / 1000), sf);
            pm = pm * (Number($scope.RCPX.value)) * (Number($scope.RUSE.value)) * (Number($scope.PDIF.value)) * (Number($scope.PERS.value)) * (Number($scope.PREX.value)) * (Number($scope.FCIL.value)) * (Number($scope.SCED.value));
            pm = pm / (Number($scope.staffSize.value));
            pm = pm.toPrecision(4);
            window.alert(pm + " person months.  This answer has saved to the project manager dashboard");
            var cocomoScores = [];
            cocomoScores.push(Number($scope.systemSize.value));
            cocomoScores.push(Number($scope.staffSize.value));
            cocomoScores.push(Number($scope.PREC.value));
            cocomoScores.push(Number($scope.FLEX.value));
            cocomoScores.push(Number($scope.RESL.value));
            cocomoScores.push(Number($scope.TEAM.value));
            cocomoScores.push(Number($scope.PMAT.value));
            cocomoScores.push(Number($scope.RCPX.value));
            cocomoScores.push(Number($scope.RUSE.value));
            cocomoScores.push(Number($scope.PDIF.value));
            cocomoScores.push(Number($scope.PERS.value));
            cocomoScores.push(Number($scope.PREX.value));
            cocomoScores.push(Number($scope.FCIL.value));
            cocomoScores.push(Number($scope.SCED.value));
            ProjectFactory.saveCocomoScores($window.sessionStorage.projectName, cocomoScores, pm, true);
        }
    }
]);