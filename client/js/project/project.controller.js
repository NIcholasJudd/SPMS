/**
 * Created by scottmackenzie on 5/05/2015.
 */

myApp.controller("ProjectCtrl", ['$scope','ProjectFactory', 'UserFactory',
    function($scope, ProjectFactory, UserFactory) {
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

        $scope.projectManagers = [];
        UserFactory.getUsers().then(function(results) {
            console.log('HERE:', results.data);
            results.data.forEach(function(user) {
                $scope.projectManagers.push({
                    name : user.first_name + ' ' + user.last_name,
                    email : user.email
                })
            });
        })
        /*ProjectFactory.getProjects().then(function(projects) {
            $scope.projects = projects;
        })*/
        $scope.selectedProjectManager = 'Please select one:';
        $scope.setProjectManager = function(index) {
            $scope.selectedProjectManager = $scope.projectManagers[index].name;
            $scope.projectData.projectManager = $scope.projectManagers[index].email;
        }

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
