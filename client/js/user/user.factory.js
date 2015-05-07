/**
 * Created by scottmackenzie on 5/05/2015.
 */

myApp.factory('UserFactory', function($http) {
    return {
        getUsers : function() {
            return $http.get('http://localhost:3000/api/auth/admin/users')
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
        }
    }
});

