/**
 * Created by nicholasjudd on 20/05/15.
 */
myApp.controller("TaskModCtrl", ['$scope', 'ProjectFactory', 'UserFactory',
    function ($scope, ProjectFactory, UserFactory) {

        $scope.modifyTask={};
        $scope.dependencies=[];
        $scope.projectData={};
        $scope.search={};
        $scope.priorityLevel = ["Critical", "High", "Medium", "Low"];
        $scope.Roles = ["Developer", "Tester", "Bug Fixer", "Analyst", "Graphic Designer", "Interface Designer", "Server Designer", "Database Engineer"];
        $scope.Skills = ["c++", "java", "html", "javascript", "Databases", "angular", "bootstrap"];

        $scope.$watch(function () {
                return ProjectFactory.getCurrentProject();
            },
            function () {
                $scope.projectData = ProjectFactory.getCurrentProject().projectName;
           }, true);

        /****   Form Fucntions  ****/
        $scope.clearDependencies = function () {
            $scope.dependencies = [];
        }

        $scope.setDependencies = function (item) {
            var bool = false
            var count = 0;
            var linkArray = [];
            item.forEach(function (i) {
                linkArray.push({
                    source: i.taskId,
                    type: 'finish to start'
                });
            })
            $scope.newTask.dependencies = linkArray;
            for (var i = 0; i < $scope.dependencies.length; i++) {
                if ($scope.dependencies[i].taskId == item[0].taskId) {
                    bool = true;
                }
            }
            if (bool == false) {
                count = Number(item.taskNumber - 1);
                $scope.dependencies.push({
                    taskName: item[0].taskName,
                    taskId: item[0].taskId
                })
            }
            console.log(item);
        }

        $scope.setRole = function (item, index) {
            $scope.assignedTeamMembers[index].roleName = item;
        }

    }
]);