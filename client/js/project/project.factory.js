/**
 * Created by scottmackenzie on 5/05/2015.
 */
myApp.factory('ProjectFactory', function($http) {
    var Projects = [];
    Projects.push({
        name : 'Project 1',
        description : 'Description of Project 1',
        duration : 365
    });
    Projects.push({
        name : 'Project 2',
        description : 'Description of Project 2',
        duration : 180
    });
    return {
        getProjects: function() {
                return Projects;
            },
        addProject: function(newName, newDescription, newDuration) {
            Projects.push({
                name : newName,
                description : newDescription,
                duration : newDuration
            })
        }
    }
});

/*

 myApp.factory('ProjectFactory', function($http) {
 return {
 getProjects: function() {
 var Projects = [];
 Projects.push({
 name : 'Project 1',
 startDate : '06/05/2015',
 duration : 365
 });
 Projects.push({
 name : 'Project 2',
 startDate : '06/06/2015',
 duration : 180
 });
 return Projects;
 }
 }
 });
 */