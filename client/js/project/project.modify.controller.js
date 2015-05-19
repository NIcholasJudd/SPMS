/**
 * Created by nicholasjudd on 18/05/15.
 */
myApp.controller("ProjectModCtrl", ['$scope', 'ProjectFactory', 'UserFactory',
    function ($scope, ProjectFactory, UserFactory) {
        $scope.$watch(function () {
                return ProjectFactory.getCurrentProject();
            },
            function () {
                $scope.projectData = ProjectFactory.getCurrentProject();
            }, true);

        $scope.projectManager = {};
        $scope.projectManagers = [];
        UserFactory.getUsers().then(function (results) {
            console.log('HERE:', results.data);
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
            console.log($scope.projectManager);
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
            $scope.projectData.progress = 0;
            var millisecondsInDay = 86400000;
            var millisecondsDifference = (new Date(endDate) - new Date(startDate));
            return (millisecondsDifference / millisecondsInDay).toString() + " days";
        }
        $scope.open = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            console.log($event);
            $scope.opened = true;
        };
    }
]);