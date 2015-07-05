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
                skills : user.skills
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
                skills : user.skills

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

