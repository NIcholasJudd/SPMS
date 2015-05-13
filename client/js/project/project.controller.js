/**
 * Created by scottmackenzie on 5/05/2015.
 */

myApp.controller("ProjectCtrl", ['$scope','ProjectFactory', 'UserFactory',
    function($scope, ProjectFactory, UserFactory) {
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

        ProjectFactory.getProjects().then(function(projects) {
            projects.data.forEach(function(projects){
                $scope.projectData.push({
                    projectName:  projects.project_name,
                    description: projects.description,
                    budget: projects.budget,
                    duration : projects.duration,
                    startDate: projects.start_date,
                    estimatedEndDate: projects.estimated_end_date,
                    progress: projects.progress,
                    projectManager: projects.project_manager
                });
            });
        });

        $scope.selectedProjectManager = 'Please select one:';
        /*ProjectFactory.getProjects().then(function(projects) {
            $scope.projects = projects;
        })*/
        

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

        /*********************** Dashboard Functions ************************/

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

        $scope.currentTime = function($index){
            console.log($scope.progressLevel);
            var max = (new Date($scope.projectData[$index].estimatedEndDate) -
            new Date($scope.projectData[$index].startDate));

            var curr =(new Date() - new Date($scope.projectData[$index].startDate));
            var total = ((100/max) * curr);

            return total;
        };

    }

]);
