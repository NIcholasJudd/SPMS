/**
 * Created by scottmackenzie on 5/05/2015.
 */

myApp.controller("ProjectCtrl", ['$scope','ProjectFactory',
    function($scope, ProjectFactory) {
        $scope.projectData = {
            projectName: null,
            description: null,
            budget: null,
            duration : null,
            startDate: null,
            estimatedEndDate: null,
            progress: 0,
            projectManager: null
        };
        /*ProjectFactory.getProjects().then(function(projects) {
            $scope.projects = projects;
        })*/

        $scope.submitProject = function() {
            //calculate project duration
            $scope.projectData.duration = calculateDuration(this.projectData.startDate, this.projectData.estimatedEndDate);
            console.log(this.projectData.duration, 'days difference between start and estimated end');//testing purposes
            console.log(this.projectData);//testing purposes
            /*  save new project.  .success/.error execute when response received from database, depending on success
                of query
            */
            ProjectFactory.createProject($scope.projectData)
                .success(function(err, res) {
                    alert($scope.projectData.projectName + ' successfully saved in database');
                }).error(function(err, res) {
                    var err_msg = "save project failed: ";
                    if(err.code == "23505")
                        err_msg += "that user already exists";
                    else
                        err_msg += err.detail;
                    alert(err_msg);
                })
        };

        function calculateDuration(startDate, endDate) {
            //calculate duration from dates entered, in days
            var millisecondsInDay = 86400000;
            var millisecondsDifference = (new Date(endDate) - new Date(startDate));
            return (millisecondsDifference / millisecondsInDay).toString() + " days";
        }
    }
]);