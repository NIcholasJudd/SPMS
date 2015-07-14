/**
 * Created by nicholasjudd on 18/05/15.
 */
myApp.controller("ProjectModCtrl", ['$scope', 'ProjectFactory', 'UserFactory', 'currentProject',
    function ($scope, ProjectFactory, UserFactory, currentProject) {

        $scope.projectData = {
            projectName : currentProject.data.project_name,
            budget : currentProject.data.budget,
            startDate : currentProject.data.start_date,
            estimatedEndDate : currentProject.data.estimated_end_date,
            projectManager : currentProject.data.project_manager,
            description : currentProject.data.description
        }

        $scope.projectManager = {};
        $scope.projectManagers = [];
        UserFactory.getUsers().then(function (results) {
            results.data.forEach(function (user) {
                $scope.projectManagers.push({
                    name: user.first_name + ' ' + user.last_name,
                    email: user.email
                })
                if ($scope.projectData.projectManager == user.email) {
                    $scope.projectManager.name = user.first_name + ' ' + user.last_name
                    $scope.projectManager.email = user.email
                }
            });
        })

        $scope.submit = function() {
            //calculate project duration
            console.log("test");
            $scope.projectData.duration = calculateDuration(this.projectData.startDate, this.projectData.estimatedEndDate);
            console.log(this.projectData.duration, 'days difference between start and estimated end');//testing purposes
            console.log(this.projectData);//testing purposes
            /*  save new project.  .success/.error execute when response received from database, depending on success
             of query
             */

            ProjectFactory.updateProject($scope.projectData)
                .success(function(err, res) {
                    alert($scope.projectData.projectName + ' successfully updated in database');
                }).error(function(err, res) {
                    var err_msg = "updated project failed: ";
                    if(err.code == "23505")
                        err_msg += "that project dosent exists";
                    else
                        err_msg += err.detail;
                    alert(err_msg);
                })
        };

        function calculateDuration(startDate, endDate) {
            //calculate duration from dates entered, in days
            $scope.projectData.progress = 0;
            var millisecondsInDay = 86400000;
            var millisecondsDifference = (new Date(endDate) - new Date(startDate));
            return (millisecondsDifference / millisecondsInDay).toString() + " days";
        }
        $scope.open = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.opened = true;
        };

        /* this stuff is required for archiving a project */
        $scope.active = !currentProject.data.active;

        $scope.archiveProject = function(projectName, active) {
            ProjectFactory.archiveProject(projectName, active)
                .success(function(err, res) {
                    if(active === false)
                        alert(projectName + ' has been successfully archived');
                    else
                        alert(projectName + ' has been successfully restored');
                })
                .error(function(err, res) {
                    if(active === false)
                        alert('archive failed');
                    else
                        alert('restore failed');
                })
        }
    }
]);