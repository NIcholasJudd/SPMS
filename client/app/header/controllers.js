myApp.controller("HeaderCtrl", ['$scope', '$window', '$location', 'UserAuthFactory', 'AuthenticationFactory',
  function($scope, $window, $location, UserAuthFactory, AuthenticationFactory) {
    $scope.isActive = function(route) {
      return route === $location.path();
    }
    $scope.userType = $window.sessionStorage.userRole;
    $scope.logout = function () {
      UserAuthFactory.logout();
    }
    $scope.getState = function() {
      if(AuthenticationFactory.isLogged === true)
        return "app.home";
      else
        return "login";
    }
  }
]);



