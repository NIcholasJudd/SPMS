var myApp = angular.module('ngclient', ['ui.router', 'ui.bootstrap', 'ui.slider', 'ui.bootstrap.typeahead', 'ui.bootstrap.tabs', 'mj.scrollingTabs', 'angularModalService']);

myApp.config(function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {
  //add Token Interceptor
  $httpProvider.interceptors.push('TokenInterceptor');

    // use the HTML5 History API
    //$locationProvider.html5Mode(true).hashPrefix('!');

  $urlRouterProvider.otherwise('/');

  $stateProvider
      .state('login', {
          url: "/login",
          views: {
              'container@' : {
                  templateUrl: "/views/login.html",
                  controller: "LoginCtrl"
              }
          }

      })
      .state('app', {
          url: "",
          abstract: true,
          views: {
              'header': {
                  templateUrl: '/views/header.html',
                  controller: 'HeaderCtrl'
              }
          }
      })
      .state('app.home', {
          url: "/",
          views: {
              'container@' : {
                  templateUrl: "views/home.html"
              }
          }
      })
      .state('app.dashboard', {
          url: "/dashboard",
          abstract: true,
          views: {
              'container@' : {
                  template: "<ui-view/>"// Note: abstract still needs a ui-view for its children to populate.
              }
          }
      })
      .state('app.dashboard.projectManager', {
          url: "/project-manager",
          views: {
              'container@' : {
                  templateUrl: "views/dashboards/projectManager/container.html",
                  controller: "PMContainerCtrl"
              },
              'projecttracking@app.dashboard.projectManager' : {
                  templateUrl: "views/dashboards/projectManager/project-tracking.html"
              }/*,
              'tasks@app.dashboard.projectManager' : {
                  templateUrl: "views/dashboards/projectManager/tasks.html"
              },
              'projectstatistics@app.dashboard.projectManager' : {
                  templateUrl: "views/dashboards/projectManager/project-statistics.html"
              },
              'projectprogression@app.dashboard.projectManager' : {
                  templateUrl: "views/dashboards/projectManager/project-progression.html"
              }*/
          }
      })
      .state('app.userCreate', {
          url: "/user/create",
          views: {
              'container@' : {
                  templateUrl: "views/user/create.html"
              }
          }
      });



  /*$routeProvider
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
      }).when('/project/archive', {
          templateUrl: 'partials/project/project.archive.html',
          controller: 'ProjectArchiveCtrl',
          access: {
              requiredLogin: true,
              adminOnly : true
          },
          resolve: {
              ActiveProjects : function(ProjectFactory) {
                  return ProjectFactory.getProjects();
              },
              ArchivedProjects : function(ProjectFactory) {
                  return ProjectFactory.getArchivedProjects();
              }
          }
      }).when('/project/taskCreate', {
        templateUrl: 'partials/project/task.create.html',
        controller: 'TaskCreateCtrl',
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
      }).when('/project/taskDetails', {
          templateUrl: 'partials/project/task.detail.html',
          controller: 'TaskDetailCtrl',
          access: {
              requiredLogin: true,
              adminOnly : false
          }
      }).when('/effort/functionPoints', {
        templateUrl: 'partials/effort/functionPoints.html',
        controller: 'EffortFunctionPointCtrl',
        access: {
              requiredLogin: true,
              adminOnly: false
          },
          resolve : {
              FunctionPointData : function(ProjectFactory, $window) {
                  return ProjectFactory.getFunctionPointData($window.sessionStorage.projectName);
              }
          }
      }).when('/effort/effortEstimation', {
        templateUrl: 'partials/effort/effort.estimation.html',
        controller: 'EffortCocomoCtrl',
        access: {
              requiredLogin: true,
              adminOnly: false
          },
          resolve : {
              CocomoScores : function(ProjectFactory, $window) {
                  return ProjectFactory.getCocomoScores($window.sessionStorage.projectName);
              }
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
      }).when('/dashboard/pmDashboard', {
        templateUrl: 'partials/dashboard/project.manager.dashboard.html',
        controller: 'ProjectDashboardCtrl',
        access: {
          requiredLogin: true,
            adminOnly : false
        },
          resolve : {
              assignedProjects : function(ProjectFactory, $window) {
                  if($window.sessionStorage.userRole === 'administrator')
                      return ProjectFactory.getProjects();
                  else {
                      console.log('team member');
                      return ProjectFactory.getPMProjects($window.sessionStorage.user);
                  }
              }
          }
      }).when('/dashboard/tmDashboard', {
        templateUrl: 'partials/dashboard/team.member.dashboard.html',
        controller: 'TaskDashCtrl',
        access: {
          requiredLogin: true,
            adminOnly : false
        }
      }).when('/modal', {
          templateUrl: 'partials/modal.html',
          controller: 'HomeCtrl',
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
      });*/
});
myApp.run(function($rootScope, $window, $location, AuthenticationFactory) {
// when the page refreshes, check if the user is already logged in
  AuthenticationFactory.check();
  $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
    if ((nextRoute.access && nextRoute.access.requiredLogin) && !AuthenticationFactory.isLogged) {
      $state.go("login");
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
      $state.go('/');
    }
  });
});