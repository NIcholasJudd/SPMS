/**
 * Created by scottmackenzie on 2/07/2015.
 */

/* PMDashboard Factory
 * On initial load, the list of relevant project names are retrieved from the server.
 * Then, the project details and tasks for the first project are retrieved.
 * With each change of tab, the project details and tasks are retrieved from the database
 */

myApp.factory('PMDashboard', function($http, $q, $rootScope, $window, baseUrl) {
    var service = {};
    var projectList = [];
    var currentProjectIndex;
    var currentProject = {};
    var projectTasks = [];
    var taskStatus;

    function calculateStatistics() {
        //reset task status
        taskStatus = {
            unassigned : 0,
            otg : 0,
            finalised : 0,
            complete : 0
        };
        projectTasks.forEach(function(task) {
            switch(task["status"]) {
                case "unassigned" : taskStatus.unassigned++;
                    break;
                case "on-the-go" : taskStatus.otg++;
                    break;
                case "finalised" : taskStatus.finalised++;
                    break;
                case "complete" : taskStatus.complete++;
                    break;
            }
        })
        $rootScope.$broadcast('task status');
    };

    service.getProjectListFromServer = function() {
        var deferred = $q.defer();
        $http.get(baseUrl + '/api/auth/projects', {params : { "fields" : ['"projectName"']}})
            .success(function(data) {
                projectList = [];
                data.forEach(function(data) {
                    projectList.push(data.projectName);
                })
                deferred.resolve(projectList);
            })
            .error(function() {
                console.log("Error receiving projectList from the database");
                deferred.reject("getProjectList error");
            });
        return deferred.promise;
    };

    service.getProjectFromServer = function(projectName) {
        var deferred = $q.defer();
        $http.get(baseUrl + '/api/auth/project/' + projectName)
            .success(function(data) {
                currentProject = data;
                deferred.resolve(currentProject);
            })
            .error(function() {
                console.log("Error receiving projects from the database");
                deferred.reject("getProjects error");
            });
        return deferred.promise;
    };

    service.getProjectTasksFromServer = function(projectName) {
        var deferred = $q.defer();
        $http.get(baseUrl + '/api/auth/project/' + projectName + '/tasks/')
            .success(function(tasks) {
                projectTasks = tasks;
                deferred.resolve(tasks);
            })
            .error(function() {
                console.log("Error receiving tasks from the database");
                deferred.reject("getCurrentTasks error");
            });
        return deferred.promise;
    };

    service.setCurrentProject = function(index) {

        currentProjectIndex = $window.sessionStorage.currentProjectIndex = index;
        $q.all([
            service.getProjectFromServer(projectList[currentProjectIndex]),
            service.getProjectTasksFromServer(projectList[currentProjectIndex])
        ]).then(function() {
            $rootScope.$broadcast('switch project');
            calculateStatistics();
        } );

    };

    service.getCurrentProject = function() {
        return currentProject;
    };


    service.getProjectList = function() {
        return projectList;
    };

    service.getProjectTasks = function() {
        return projectTasks;
    };

    service.getCurrentProjectIndex = function() {
        return currentProjectIndex;
    }

    service.getTaskStatus = function() { return taskStatus; };

    service.completeTask = function(index) {
        projectTasks[index].status = "complete";
        calculateStatistics();
    }

    //set current task on initial load
    if($window.sessionStorage.currentProjectIndex)
        currentProjectIndex = $window.sessionStorage.currentProjectIndex;
    else
        currentProjectIndex = 0;

    //get projects and tasks on initial load
    service.getProjectListFromServer()
        .then(function() {
            if(projectList.length > 0) {
                $q.all([
                    service.getProjectFromServer(projectList[currentProjectIndex]),
                    service.getProjectTasksFromServer(projectList[currentProjectIndex])
                ]).then(function() {
                    $rootScope.$broadcast('switch project');
                    calculateStatistics();
                } );
            }
        });

    return service;
});

