myApp.controller("CreateProjectCtrl", ['$scope', 'ProjectFactory', 'userFactoryTest',
    function ($scope, ProjectFactory, userFactoryTest) {
        $scope.project ={};
        $scope.selectedProjectManager ="";
        $scope.customStyle = {}
        $scope.customStyle.fontStyle = {"color":"orange"};
        $scope.users = [];
        userFactoryTest.getUserNames().then(function (results) {
            $scope.users = results;
            console.log($scope.users);
        });

        $scope.tooltip = {
            projectName: "Enter project name",
            budget: "Enter a budget for your project",
            startDate: "Enter starting date for your project",
            endDate: "Enter project end date for your project",
            projectManager: "Enter a user to manage this project",
            description: "Enter a description about your project"
        };

        $scope.open = function($event, open) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope[open] = true;
        };

        $scope.findUser = function(name){
            $scope.project.projectManager = name;
        };

        $scope.test = function(){
            console.log($scope.project);
        };

        $scope.submitProject = function () {
            $scope.errorMessage = {};
            $scope.numerals = "12345678910"
            $scope.error = false;
            if (!$scope.project.projectName){
                $scope.error = true;
                $scope.errorMessage.projectName = "Need to supply Project Name";
            }
            if (!$scope.project.budget){
                $scope.error = true;
                $scope.errorMessage.budget = "Need to supply a budget";
            }
            if(!angular.isUndefined($scope.project.budget)) {
                for (var i = 0; i < $scope.project.budget.length; i++) {
                    if ($scope.numerals.indexOf($scope.project.budget.charAt(i)) == -1) {
                        $scope.error = true;
                        $scope.errorMessage.budget = " needs to be numerals only";
                        break;
                    }
                }
            }
            if (!$scope.project.startDate){
                $scope.error = true;
                $scope.errorMessage.startDate = "Need to supply a starting date";
            }
            if ($scope.project.startDate > $scope.project.endDate){
                $scope.error = true;
                $scope.errorMessage.startDate = " needs to be before the end date";
                $scope.errorMessage.endDate = " needs to be after the start date";
            }
            if(!$scope.project.endDate){
                $scope.error = true;
                $scope.errorMessage.endDate = "Need to supply an estimated end date";
            }
            if(!$scope.project.projectManager){
                $scope.error = true;
                $scope.errorMessage.projectManager = " needs to be assigned";
            }
            if(!$scope.project.description){
                $scope.error = true;
                $scope.errorMessage.description = " of the project needs to be supplied";
            }
            ProjectFactory.createProject($scope.project).success(function (err, res) {
                alert($scope.project.projectName + ' successfully saved in database');
            }).error(function (err, res) {
                var msg = "Create project failed: " + err;
                console.log(err);
                alert(msg);
            })
        }
    }
]);

myApp.controller("ModifyProjectCtrl", ['$scope', 'ProjectFactory','$stateParams', 'userFactoryTest',
    function ($scope, ProjectFactory, $stateParams, userFactoryTest) {
        $scope.project= {};
        $scope.selectedProjectManager ="";
        $scope.users = [];
        userFactoryTest.getUserNames().then(function (results) {
            $scope.users = results;
        });
        ProjectFactory.getProject($stateParams.projectName).then(function(results) {
            $scope.project = results.data;
            for(var i = 0; i < $scope.users.length; i++){
                if ($scope.users[i].email == $scope.project.projectManager){
                    $scope.project.projectManager = $scope.users[i].name;
                    $scope.selectedProjectManager = $scope.project.projectManager;
                }
            }
        });
    }]);