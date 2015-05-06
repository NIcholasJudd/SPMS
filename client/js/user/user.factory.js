/**
 * Created by scottmackenzie on 5/05/2015.
 */

myApp.factory('UserFactory', function($http) {
    return {
        getUsers : function() {
            return $http.get('http://localhost:3000/api/auth/admin/users')
        },
        saveUser: function(user) {
            return $http.post('http://localhost:3000/api/auth/admin/user', {
                username : user.username,
                password : user.password,
                userrole : user.userrole
            })
        }
    }
});

