/**
 * Created by scottmackenzie on 5/05/2015.
 */
myApp.factory('ProjectFactory', function($http) {
    //$window.sessionStorage.project = {};//var currentProject = {};
    return {
        /*getProjects: function() {
                return Projects;
            },*/
        getTasks: function(projectName) {
            return $http.get('http://localhost:3000/api/auth/project/' + projectName + '/tasks/');
        },
        getLinks: function(projectName) {
            return $http.get('http://localhost:3000/api/auth/project/' + projectName + '/links/');
        },

        createProject: function(project) {
            return $http.post('http://localhost:3000/api/auth/admin/project/', {
                projectName: project.projectName,
                description: project.description,
                budget: project.budget,
                duration : project.duration,
                startDate: project.startDate,
                estimatedEndDate: project.endDate,
                progress: project.progress,
                projectManager: project.projectManager
            })
        },

        updateProject: function(project){
            return $http.put('http://localhost:3000/api/auth/project/' + project.projectName, {
                description: project.description,
                budget: project.budget,
                duration : project.duration,
                startDate: project.startDate,
                estimatedEndDate: project.estimatedEndDate,
                progress: project.progress,
                projectManager: project.projectManager
            })
        },

        archiveProject: function(projectName, active, reason) {
            return $http.put('http://localhost:3000/api/auth/admin/project/' + projectName + '/archive', {
                active : active,
                reason : reason
            })
        },

        getProject : function(projectName) {
            return $http.get('http://localhost:3000/api/auth/project/' + projectName);
        },

        getProjects: function(){
            return $http.get('http://localhost:3000/api/auth/projects');
        },

        getPMProjects : function(email) {
            return $http.get('http://localhost:3000/api/auth/user/' + email + '/projects');
        },

        getArchivedProjects : function() {
            return $http.get('http://localhost:3000/api/auth/admin/projects');
        },

        getFunctionPointData : function(projectName) {
            return $http.get('http://localhost:3000/api/auth/project/' + projectName + '/functionPoint');
        },

        saveFunctionPointData : function(projectName, adjustedFP, valueArray, functionCounts, calculated) {
            return $http.put('http://localhost:3000/api/auth/project/' + projectName + '/functionPoint', {
                adjustedFP : adjustedFP,
                valueArray : valueArray,
                calculated : calculated,
                functionCounts : functionCounts
            })
        },

        getCocomoScores : function(projectName) {
            return $http.get('http://localhost:3000/api/auth/project/' + projectName + '/cocomoScore');
        },

        saveCocomoScores : function(projectName, cocomoScores, personMonths, calculated) {
            return $http.put('http://localhost:3000/api/auth/project/' + projectName + '/cocomoScore', {
                cocomoScores : cocomoScores,
                personMonths : personMonths,
                calculated : calculated
            })
        }

    }
});
