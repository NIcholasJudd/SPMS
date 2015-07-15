var myApp = angular.module('ngclient',
    [
        'ui.router',
        'myApp.config',
        'ui.bootstrap',
        'ui.slider',
        'ui.bootstrap.typeahead',
        'ui.bootstrap.tabs',
        'mj.scrollingTabs',
        'angularModalService'
    ]);

myApp.config(function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {
    //add Token Interceptor
    $httpProvider.interceptors.push('TokenInterceptor');
    // use the HTML5 History API
    $locationProvider.html5Mode(true);
    //map home route to landing page
    $urlRouterProvider.when('', '/');
    //unknown route to 404
    $urlRouterProvider.otherwise('/404');

    $stateProvider
        .state('landing', {
            url: "/",
            views: {
                'container@' : {
                    templateUrl: "/app/landing/landing.html",
                    controller: "LandingCtrl"
                }
            }
        })
        .state('login', {
            url: "/login",
            views: {
                'container@': {
                    templateUrl: "/app/auth/login.html",
                    controller: "LoginCtrl"
                }
            }
        })
        .state('app', {
            url: "",
            abstract: true,
            views: {
                'header': {
                    templateUrl: '/app/header/header.html',
                    controller: 'HeaderCtrl'
                }
            }
        })
        .state('app.home', {
            url: "/home",
            views: {
                'container@': {
                    templateUrl: "/app/home/home.html"
                }
            },
            access: {
                requiredLogin: false,
                adminOnly: false
            }
        })
        .state('app.pmDashboard', {
            abstract : true,
            url: "/dashboard/project-manager",
            views: {
                'container@': {
                    templateUrl: "app/pm-dashboard/container.html",
                    controller: "PMContainerCtrl"
                }
            },
            access: {
                requiredLogin: true,
                adminOnly: false
            }
        })
            .state('app.pmDashboard.panels', {
                url: "",
                views: {
                    'projecttracking@app.pmDashboard' : {
                        templateUrl: "/app/pm-dashboard/project-tracking.html",
                        controller: "PMProjectTrackingCtrl"
                    },
                    'tasks@app.pmDashboard' : {
                        templateUrl: "/app/pm-dashboard/tasks.html",
                        controller: "PMTasksCtrl"
                    },
                    'statistics@app.pmDashboard' : {
                        templateUrl: "/app/pm-dashboard/statistics.html",
                        controller: "PMStatisticsCtrl"
                    },
                    'progress@app.pmDashboard' : {
                        templateUrl: "/app/pm-dashboard/progress.html",
                        controller: "PMProgressCtrl"
                    },
                    'costManagement@app.pmDashboard' : {
                        templateUrl: "/app/pm-dashboard/cost-management.html",
                        controller: "PMCostManagementCtrl"
                    }
                },
                access: {
                    requiredLogin: true,
                    adminOnly: false
                }
            })
        .state('app.tmDashboard', {
            abstract : true,
            url: "/dashboard/team-member",
            views: {
                'container@' : {
                    templateUrl : "/app/tm-dashboard/container.html",
                    controller: "TMContainerCtrl"
                }
            },
            access: {
                requiredLogin: true,
                adminOnly: false
            }
        })
            .state('app.tmDashboard.tasks', {
            abstract : true,
            url: "",
            views : {
                'statistics@app.tmDashboard': {
                    templateUrl: "/app/tm-dashboard/statistics.html",
                    controller: "TMStatisticsCtrl"
                }
            },
            access: {
                requiredLogin: true,
                adminOnly: false
            }
        })
                .state('app.tmDashboard.tasks.status', {
                    url: "",
                    views: {
                        'assigned@app.tmDashboard' : {
                            templateUrl: "/app/tm-dashboard/assigned.html",
                            controller: "TMAssignedCtrl"
                        },
                        'progress@app.tmDashboard' : {
                            templateUrl: "/app/tm-dashboard/progress.html",
                            controller: "TMProgressCtrl"
                        },
                        'complete@app.tmDashboard' : {
                            templateUrl: "/app/tm-dashboard/complete.html",
                            controller: "TMAssignedCtrl"
                        }
                    },
                    access: {
                        requiredLogin: true,
                        adminOnly: false
                    }
                })
        .state('app.createUser', {
            url: "/user/create",
            views: {
                'container@': {
                    templateUrl: "/app/user/create.html",
                    controller: "userCreate"
                }
            },
            access: {
                requiredLogin: true,
                adminOnly: true
            }
        })
        .state('app.userModify', {
            url: "/user/modify",
            views: {
                'container@': {
                    templateUrl: "/app/user/modify.html",
                    controller:"userModify"
                },
                'modifyForm@app.userModify': {
                    templateUrl: "/app/user/modifyForm.html"
                }
            },
            access: {
                requiredLogin: true,
                adminOnly: false
            }
        })
        .state('app.createProject', {
            url: "/project/create",
            views: {
                'container@': {
                    templateUrl: "/app/project/create.html",
                    controller: "projectCreate"
                }
            },
            access: {
                requiredLogin: true,
                adminOnly: true
            }
        })
        .state('app.createTask', {
            url: "/task/create/:projectName",
            views: {
                'container@' : {
                    templateUrl: "/app/task/create.html",
                    controller: "TaskCreateCtrl"
                }
            }
        })
        .state('app.taskModify', {
            url: "/task/modify/:taskId",
            views: {
                'container@' : {
                    templateUrl: "/app/task/modify.html",
                    controller: "TaskModifyCtrl"
                }
            },
            access: {
                requiredLogin: true,
                adminOnly: false
            }
        })
        .state('app.ganttChart', {
            url: "/ganttChart/:projectName",
            views: {
                'container@' : {
                    templateUrl: "/app/ganttChart/ganttChart.html",
                    controller: "GanttChartCtrl"
                }
            },
            access: {
                requiredLogin: true,
                adminOnly: false
            }
        })
        .state('app.cocomo2', {
            url: "/cocomo2/:projectName",
            views: {
                'container@' : {
                    templateUrl: "/app/cocomo2/cocomo2.html",
                    controller: "Cocomo2Ctrl"
                }
            },
            access: {
                requiredLogin: true,
                adminOnly: false
            }
        })
        .state('app.effortEstimation', {
            url: "/effort-estimation/:projectName",
            views: {
                'container@' : {
                    templateUrl: "/app/effortEstimation/effortEstimation.html",
                    controller: "EffortEstimationCtrl"
                }
            },
            access: {
                requiredLogin: true,
                adminOnly: false
            }
        })
        .state('app.apn', {
            url: "/apn/:projectName",
            views: {
                'container@' : {
                    templateUrl: "/app/apn/apn.html",
                    controller: "ApnCtrl"
                }
            },
            access: {
                requiredLogin: true,
                adminOnly: false
            }
        })
        .state('404', {
            url: "/404",
            views: {
                'container@' : {
                    templateUrl: "/app/error/404.html",
                    controller: "ErrorCtrl"
                }
            },
            resolve: {
                PreviousState: [
                    "$state",
                    function ($state) {
                        var currentStateData = {
                            name: $state.current.name,
                            params: $state.params,
                            URL: $state.href($state.current.name, $state.params)
                        };
                        return currentStateData;
                    }
                ]
            }
        })
        .state('401', {
            url: "/401",
            views: {
                'container@' : {
                    templateUrl: "/app/error/401.html",
                    controller: "ErrorCtrl"
                }
            },
            resolve: {
                PreviousState: [
                    "$state",
                    function ($state) {
                        var currentStateData = {
                            name: $state.current.name,
                            params: $state.params,
                            URL: $state.href($state.current.name, $state.params)
                        };
                        return currentStateData;
                    }
                ]
            }
        });
});

myApp.run(function ($rootScope, $state, $window, $location, AuthenticationFactory) {
// when the page refreshes, check if the user is already logged in
    AuthenticationFactory.check();
    $rootScope.$on("$stateChangeStart", function (event, nextRoute, currentRoute) {
        if ((nextRoute.access && nextRoute.access.requiredLogin) && !AuthenticationFactory.isLogged) {
            $rootScope.error = "Access denied";
            event.preventDefault();
        } else {
            /* if user doesn't have admin and tries to access admin page, direct to error message page*/
            //this line below fixed the 'not authorised on refresh' error... <-- might need to check for vulnerabilities caused by it
            if (!AuthenticationFactory.userRole) AuthenticationFactory.userRole = $window.sessionStorage.userRole;
            if (!AuthenticationFactory.user) AuthenticationFactory.user = $window.sessionStorage.user;
            if ((nextRoute.access && nextRoute.access.adminOnly) && AuthenticationFactory.userRole != 'administrator') {
                event.preventDefault();
                $state.go("401");//$location.path("/error").replace();
            } else {
                // check if user object exists else fetch it. This is incase of a page refresh
                if (!AuthenticationFactory.user) AuthenticationFactory.user = $window.sessionStorage.user;
                if (!AuthenticationFactory.userRole) AuthenticationFactory.userRole = $window.sessionStorage.userRole;
            }
        }
    });
    $rootScope.$on('$stateChangeSuccess', function (event, nextRoute, currentRoute) {
        $rootScope.showMenu = AuthenticationFactory.isLogged;
        $rootScope.role = AuthenticationFactory.userRole;
// if the user is already logged in, take them to the home page
        if (AuthenticationFactory.isLogged == true && $state.is('login')) {
            console.log('titsbalss');
            $state.go('app.home');
        }
    });
    $rootScope.$on('$stateChangeError', function(event, nextRoute, currentRoute, fromState, fromParams, error){
        console.log('hi');
        if(error.status === 401) {
            $state.go('401');
        } else {
            $state.go('404');
        }
    })
});