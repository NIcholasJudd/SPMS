myApp.controller("HeaderCtrl", ['$scope', '$window', '$location', 'UserAuthFactory',
  function($scope, $window, $location, UserAuthFactory) {
    $scope.isActive = function(route) {
      return route === $location.path();
    }
    $scope.userType = $window.sessionStorage.userRole;
    $scope.logout = function () {
      UserAuthFactory.logout();
    }
  }
]);



