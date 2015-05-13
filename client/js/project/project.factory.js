/**
 * Created by scottmackenzie on 5/05/2015.
 */
myApp.factory('ProjectFactory', function($http) {
    return {

        createProject: function(project) {
            return $http.post('http://localhost:3000/api/auth/admin/project/', {
                projectName: project.projectName,
                description: project.description,
                budget: project.budget,
                duration : project.duration,
                startDate: project.startDate,
                estimatedEndDate: project.estimatedEndDate,
                progress: project.progress,
                projectManager: project.projectManager
            })
        },

        getProjects: function(){
            return $http.get('http://localhost:3000/api/auth/admin/projects');
        }
    }
});
