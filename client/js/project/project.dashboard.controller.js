/**
 * Created by scottmackenzie on 5/05/2015.
 */

myApp.controller("ProjectDashboardCtrl", ['$scope', '$rootScope', 'ProjectFactory', 'UserFactory', '$window',
    'assignedProjects', 'FunctionPointData',
    function ($scope, $rootScope, ProjectFactory, UserFactory, $window, assignedProjects, FunctionPointData) {
        $scope.functionPointCalculated = FunctionPointData.data.calculated;
        $scope.functionPoints = FunctionPointData.data.adjusted_function_point_count;
        $scope.projectData = [];
        $scope.currentProject;
        $scope.taskData = {
            taskId: 0,
            taskNumber: 0,
            projectName: null,
            taskName: null,
            duration: null,
            description: null,
            progress: 0,
            status: null,
            priority: null,
            parentId: 0
        };

        /* 'assignedProjects' is resolved within app.js before the page loads, so that the tab-set always has
         data before loading.
         */

        assignedProjects.data.forEach(function (projects) {
            $scope.projectData.push({
                projectName: projects.project_name,
                description: projects.description,
                budget: projects.budget,
                duration: projects.duration,
                startDate: projects.start_date,
                estimatedEndDate: projects.estimated_end_date,
                progress: calculateDateProgress(projects.start_date, projects.estimated_end_date),
                projectManager: projects.project_manager
            });
        });


        function getTasks() {
            ProjectFactory.getTasks($window.sessionStorage.projectName).then(function (res) {
                console.log(res.data);
                $scope.status = {
                    unassigned: 0,
                    otg: 0,
                    finalised: 0,
                    complete: 0
                };
                res.data.forEach(function (task) {
                    if (task.status == "on-the-go")
                        $scope.status.otg += Number(1);
                    else if (task.status = "unassigned")
                        $scope.status.unassigned += Number(1);
                    else if (task.status = "complete")
                        $scope.status.complete += Number(1);
                    else if (task.status = "finalised")
                        $scope.status.finalised += Number(1);

                })
            })
        }






        console.log('window sesoin: ', $window.sessionStorage.projectName);
        if ($scope.projectData.length > 0) {
            if(!$window.sessionStorage.projectName) {
                console.log('!');
                $window.sessionStorage.projectName = $scope.currentProject = $scope.projectData[0].projectName;
            }
            else {
                console.log('not !');
                if($window.sessionStorage.projectName == null) {
                    $window.sessionStorage.projectName = $scope.currentProject = $scope.projectData[0].projectName;
                    console.log('null');
                }
                else
                    $scope.currentProject = $window.sessionStorage.projectName;
            }
            getTasks();
        }

        /*ProjectFactory.getPMProjects($window.sessionStorage.user).then(function(projects) {
         projects.data.forEach(function(projects){
         $scope.projectData.push({
         projectName:  projects.project_name,
         description: projects.description,
         budget: projects.budget,
         duration : projects.duration,
         startDate: projects.start_date,
         estimatedEndDate: projects.estimated_end_date,
         progress: calculateDateProgress(projects.start_date, projects.estimated_end_date),
         projectManager: projects.project_manager
         });
         });

         //ProjectFactory.setCurrentProject($scope.projectData[1]);
         }).finally(function() {
         if($scope.projectData.length > 0)
         $window.sessionStorage.projectName = $scope.projectData[0].projectName;
         //$scope.$apply();
         });*/

        function calculateDuration(startDate, endDate) {
            //calculate duration from dates entered, in days
            var millisecondsInDay = 86400000;
            var millisecondsDifference = (new Date(endDate) - new Date(startDate));
            return (millisecondsDifference / millisecondsInDay).toString() + " days";
        }

        /*********************** Dashboard Functions ************************/
        $scope.getProjectArray = function () {
            return $scope.projectData;
        };

        $scope.getProjectData = function ($index) {
            return $scope.projectData[$index];
        };

        $scope.startDate = function ($index) {
            var sdate = new Date($scope.projectData[$index].startDate);
            return sdate.toDateString();
        }

        $scope.endDate = function ($index) {
            var edate = new Date($scope.projectData[$index].estimatedEndDate);
            return edate.toDateString();
        }

        function calculateDateProgress(startDate, endDate) {
            var max = new Date(endDate) - new Date(startDate);
            var curr = new Date() - new Date(startDate);
            var total = ((100 / max) * curr);
            return total;
        }

        /* sets the current project in $window.sessionStorage, so that other pages can access current project */
        $scope.setProject = function (index) {
            console.log('set Project');
            $window.sessionStorage.projectName = $scope.currentProject = $scope.projectData[index].projectName;
            $rootScope.$broadcast('project-changed');
            getTasks();
            /*ProjectFactory.getTasks($window.sessionStorage.projectName).then(function (res) {
                console.log('!!!');
                $scope.status = {
                    unassigned: 0,
                    otg: 0,
                    finalised: 0,
                    complete: 0
                };
                res.data.forEach(function (task) {
                    if (task.status == "on-the-go")
                        $scope.status.otg += Number(1);
                    else if (task.status = "unassigned")
                        $scope.status.unassigned += Number(1);
                    else if (task.status = "complete")
                        $scope.status.complete += Number(1);
                    else if (task.status = "finalised")
                        $scope.status.finalised += Number(1);

                })
            })

            console.log('called');
            $window.sessionStorage.projectName = $scope.currentProject = $scope.projectData[index].projectName;
            console.log($window.sessionStorage.projectName);*/
        }

    }

]);
