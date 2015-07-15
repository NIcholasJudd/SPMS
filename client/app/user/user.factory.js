/**
 * Created by scottmackenzie on 5/05/2015.
 */

myApp.factory('UserFactory', function($http) {
    return {
        getUsers : function() {
            return $http.get('http://localhost:3000/api/auth/users')
        },
        getUserTasks : function(email) {
            return $http.get('http://localhost:3000/api/auth/user/' + email + '/tasks/');
        },
        createUser: function(user) {
            return $http.post('http://localhost:3000/api/auth/admin/user/', {
                email: user.email,
                firstName : user.firstName,
                lastName : user.lastName,
                password: user.password,
                phone : user.phone,
                role : user.role,
                performanceIndex : user.performanceIndex,
                previousRoles : user.previousRoles
            })
        },

        updateUser: function(user){
            return $http.put('http://localhost:3000/api/auth/admin/user/' + email, {
                email: user.email,
                firstName : user.firstName,
                lastName : user.lastName,
                phone : user.phone,
                role : user.role,
                performanceIndex : user.performanceIndex,
                previousRoles : user.previousRoles

            })
        },

        updatePassword : function(email, password) {
            return $http.put('http://localhost:3000/api/auth/admin/user/' + email + '/password', {
                password: password
            })
        },

        archiveUser: function(email, active) {
            return $http.put('http://localhost:3000/api/auth/admin/user/' + email + '/archive', {
                active : active
            })
        }

    }
});

myApp.factory('userFactoryTest', function($http, $q, $rootScope, $window, baseUrl) {
   var service = {};
    var user=[];
    service.getUserNames = function () {
        var deferred = $q.defer();
        $http.get(baseUrl + '/api/auth/users', {params : { "fields" : ['"firstName"', '"lastName"', '"email"']}})
            .success(function(data) {
                data.forEach(function(data) {
                    user.push({
                        name: data.firstName + " " + data.lastName,
                        email: data.email
                });
                })
                deferred.resolve(user);
            })
                .error(function() {
                    console.log("Error receiving projectList from the database");
                    deferred.reject("getProjectList error");
                });
        return deferred.promise;
    };
    return service;
});
