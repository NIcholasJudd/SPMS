var myApp = angular.module('ngclient', ['ngRoute', 'ui.bootstrap', 'ui.slider', 'ui.bootstrap.typeahead']);
var myApp = angular.module('ngclient', ['ngRoute', 'ui.bootstrap', 'ui.bootstrap.tabs', 'ui.slider', 'mj.scrollingTabs']);

myApp.config(function($routeProvider, $httpProvider) {
  //add Token Interceptor
  $httpProvider.interceptors.push('TokenInterceptor');
  $routeProvider
      .when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl',
        access: {
          requiredLogin: false
        }
      }).when('/', {
        templateUrl: 'partials/home.html',
        controller: 'LoginCtrl',
        access: {
          requiredLogin: true
        }
      }).when('/project/create', {
        templateUrl: 'partials/project/project.create.html',
        controller: 'ProjectCtrl',
        access: {
          requiredLogin: true,
            adminOnly: true
        }
      }).when('/project/modify', {
          templateUrl: 'partials/project/project.modify.html',
          controller: 'ProjectModCtrl',
          access: {
              requiredLogin: true,
              adminOnly: false
          },
          resolve : {
              currentProject : function(ProjectFactory, $window) {
                  return ProjectFactory.getProject($window.sessionStorage.projectName);
              }
          }
      }).when('/project/taskCreate', {
        templateUrl: 'partials/project/task.create.html',
        controller: 'TaskCtrl',
        access: {
          requiredLogin: true,
            adminOnly : false
        }
      }).when('/project/taskModify', {
          templateUrl: 'partials/project/task.modify.html',
          controller: 'TaskModCtrl',
          access: {
              requiredLogin: true,
              adminOnly : false
          }
      }).when('/effort/functionPoints', {
        templateUrl: 'partials/effort/functionPoints.html',
        controller: 'EffortCtrl',
        access: {
              requiredLogin: true,
              adminOnly: false
          }
      }).when('/effort/effortEstimation', {
        templateUrl: 'partials/effort/effort.estimation.html',
        controller: 'EffortCtrl',
        access: {
              requiredLogin: true,
              adminOnly: false
          }
      }).when('/project/ganttChart', {
        templateUrl: 'partials/project/ganttChart.html',
        controller: 'GanttChartCtrl',
        access: {
              requiredLogin: true,
              adminOnly: false
          }
      }).when('/project/apn', {
          templateUrl: 'partials/project/apn.html',
          controller: 'APNCtrl',
          access: {
              requiredLogin: true,
              adminOnly : false
          }
      }).when('/dashboard/adminDashboard', {
        templateUrl: 'partials/dashboard/administrator.dashboard.html',
        controller: 'HomeCtrl',
        access: {
          requiredLogin: true,
            adminOnly : false
        }
      }).when('/dashboard/pmDashboard', {
        templateUrl: 'partials/dashboard/project.manager.dashboard.html',
        controller: 'ProjectDashboardCtrl',
        access: {
          requiredLogin: true,
            adminOnly : false
        }
      }).when('/dashboard/tmDashboard', {
        templateUrl: 'partials/dashboard/team.member.dashboard.html',
        controller: 'TaskCtrl',
        access: {
          requiredLogin: true,
            adminOnly : false
        }
      }).when('/user/create', {
        templateUrl: 'partials/user/user.create.html',
        controller: 'UserCtrl',
        access: {
          requiredLogin: true,
            adminOnly : true
        }
      }).when('/error', {
          templateUrl: 'partials/error.html'
      }).otherwise({
        redirectTo: '/login'
      });
});
myApp.run(function($rootScope, $window, $location, AuthenticationFactory) {
// when the page refreshes, check if the user is already logged in
  AuthenticationFactory.check();
  $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
    if ((nextRoute.access && nextRoute.access.requiredLogin) && !AuthenticationFactory.isLogged) {
      $location.path("/login");
    } else {
        /* if user doesn't have admin and tries to access admin page, direct to error message page*/
        //this line below fixed the 'not authorised on refresh' error... <-- might need to check for vulnerabilities caused by it
        if (!AuthenticationFactory.userRole) AuthenticationFactory.userRole = $window.sessionStorage.userRole;
        if (!AuthenticationFactory.user) AuthenticationFactory.user = $window.sessionStorage.user;
        if((nextRoute.access && nextRoute.access.adminOnly) && AuthenticationFactory.userRole != 'administrator') {
            $location.path("/error").replace();
        } else {
            // check if user object exists else fetch it. This is incase of a page refresh
            if (!AuthenticationFactory.user) AuthenticationFactory.user = $window.sessionStorage.user;
            if (!AuthenticationFactory.userRole) AuthenticationFactory.userRole = $window.sessionStorage.userRole;
            console.log('myapp.run: ', AuthenticationFactory.userRole);
        }
    }
  });
  $rootScope.$on('$routeChangeSuccess', function(event, nextRoute, currentRoute) {
    $rootScope.showMenu = AuthenticationFactory.isLogged;
    $rootScope.role = AuthenticationFactory.userRole;
// if the user is already logged in, take him to the home page
    if (AuthenticationFactory.isLogged == true && $location.path() == '/login') {
      $location.path('/');
    }
  });
});