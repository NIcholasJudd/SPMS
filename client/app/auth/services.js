/**
 * Created by scottmackenzie on 3/05/2015.
 */

//check user status on the client side
myApp.factory('AuthenticationFactory', function($window) {
    var auth = {
        isLogged: false,
        check: function() {
            if ($window.sessionStorage.token && $window.sessionStorage.user) {
                this.isLogged = true;
            } else {
                this.isLogged = false;
                delete this.user;
            }
        }
    }
    return auth;
});

//login: contact login api endpoint, and validate user
//logout: log user out, delete session storage
myApp.factory('UserAuthFactory', function($window, $location, $http, AuthenticationFactory) {
    return {
        login: function(username, password) {
            return $http.post('http://localhost:3000/login', {
                email: username,
                password: password
            });
        },
        logout: function() {
            if (AuthenticationFactory.isLogged) {
                AuthenticationFactory.isLogged = false;
                delete AuthenticationFactory.user;
                delete AuthenticationFactory.userRole;
                delete $window.sessionStorage.token;
                delete $window.sessionStorage.user;
                delete $window.sessionStorage.userRole;
                delete $window.sessionStorage.projectName;
                delete $window.sessionStorage.taskId;
                delete $window.sessionStorage.taskNumber;
                $location.path("/login");
            }
        }
    }
});

//send authentication token and key with every request to server
myApp.factory('TokenInterceptor', function($q, $window) {
    return {
        request: function(config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
                config.headers['X-Access-Token'] = $window.sessionStorage.token;
                config.headers['X-Key'] = $window.sessionStorage.user;
                config.headers['Content-Type'] = "application/json";
            }
            return config || $q.when(config);
        },
        response: function(response) {
            return response || $q.when(response);
        }
    };
});

