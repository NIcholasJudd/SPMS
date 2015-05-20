/**
 * Created by scottmackenzie on 5/05/2015.
 */

myApp.controller("ProjectDashboardCtrl", ['$scope','ProjectFactory', 'UserFactory', '$window',
    function($scope, ProjectFactory, UserFactory, $window) {
        $scope.projectData = [];

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

        ProjectFactory.getPMProjects($window.sessionStorage.user).then(function(projects) {
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
            ProjectFactory.setCurrentProject($scope.projectData[1]);
        });

        function calculateDuration(startDate, endDate) {
            //calculate duration from dates entered, in days
            var millisecondsInDay = 86400000;
            var millisecondsDifference = (new Date(endDate) - new Date(startDate));
            return (millisecondsDifference / millisecondsInDay).toString() + " days";
        }

        /*********************** Dashboard Functions ************************/
        $scope.getProjectArray = function() {
            return $scope.projectData;
        };

        $scope.getProjectData = function($index){
            return $scope.projectData[$index];
        };

        $scope.startDate = function($index){
            var sdate = new Date($scope.projectData[$index].startDate);
            return sdate.toDateString();
        }

        $scope.endDate = function($index){
            var edate = new Date($scope.projectData[$index].estimatedEndDate);
            return edate.toDateString();
        }

        function calculateDateProgress(startDate, endDate) {
            var max = new Date(endDate) - new Date(startDate);
            var curr = new Date() - new Date(startDate);
            var total = ((100/max) * curr);
            return total;
        }

        /* sets the current project in project factory, so that gantt chart can access current project */
        $scope.setProject = function(index) {
            $window.sessionStorage.projectName = $scope.projectData[index].projectName;
            //ProjectFactory.setCurrentProject($scope.projectData[index]);
            console.log('current project is: ', ProjectFactory.getCurrentProject());
        }

    }

]);
