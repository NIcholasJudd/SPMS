myApp.controller("HeaderCtrl", ['$scope', '$location', 'UserAuthFactory',
  function($scope, $location, UserAuthFactory) {
    $scope.isActive = function(route) {
      return route === $location.path();
    }
    $scope.logout = function () {
      UserAuthFactory.logout();
    }
  }
]);

myApp.controller("HomeCtrl", ['$scope', '$window', '$location', '$routeParams',
    function($scope, $window, $location, $routeParams) {

        $scope.name = "Home Controller";


        $scope.Tasks = [
            {
                title: 'Title',
                description: 'Description',
                priority: 'High'
            },
            {
                title: 'Title',
                description: 'Description',
                priority: 'medium'
            },
            {
                title: 'Title',
                description: 'Description',
                priority: 'low'
            },
            {
                title: 'Title',
                description: 'Description',
                priority: 'low'
            },
            {
                title: 'Title',
                description: 'Description',
                priority: 'low'
            },
            {
                title: 'Title',
                description: 'Description',
                priority: 'low'
            },
            {
                title: 'Title',
                description: 'Description',
                priority: 'low'
            },
            {
                title: 'Title',
                description: 'Description',
                priority: 'low'
            },
            {
                title: 'Title',
                description: 'Description',
                priority: 'low'
            },
            {
                title: 'Title',
                description: 'Description',
                priority: 'low'
            }
        ];

        $scope.taskPriority = function ($index) {
            if ($scope.Tasks[$index].priority == 'High') {
                return 'panel panel-danger';
            } else if ($scope.Tasks[$index].priority == 'medium') {
                return 'panel panel-warning';
            } else {
                return 'panel panel-info';
            }
        };

        $scope.pMenuTab = [];

        if($location.path() === '/dashboard/pmDashboard') {
            $scope.pMenuTab = [ {
                title : 'Create Task',
                iconclass : 'glyphicon glyphicon-calendar',
                url: '#/project/taskCreate'
            }, {
                title : 'Modify Project',
                iconclass : 'glyphicon glyphicon-folder-open',
                url: '#/project/modify'
            }]
        }else if($location.path() === '/dashboard/tmDashboard') {
            $scope.pMenuTab = [ {
                title : 'Gantt Chart',
                iconclass : 'glyphicon glyphicon-random',
                url: '#/project/ganttChart'
            }]
        }

        /*<ul class="nav nav-pills nav-stacked">
        <li class="custom-pill" role="presentation"><a ng-href="#/../project/ganttChart"><span class="glyphicon glyphicon-random"></span><h6>Gantt Chart</h6></a></li>
        </ul>*/

        if ($window.sessionStorage.userRole === 'administrator') {
            $scope.pMenuTab.push({
                title: 'Create Project (Admin Only)',
                iconclass: 'glyphicon glyphicon-hdd',
                url: '#/project/create'
            });
            $scope.pMenuTab.push({
                title: 'User Management (Admin Only)',
                iconclass: 'glyphicon glyphicon-user',
                url: '#/user/create'
            });
            if($location.path() === '/dashboard/pmDashboard') {
                $scope.pMenuTab.push({
                    title: 'Archive Project',
                    iconclass: 'glyphicon glyphicon-trash',
                    url: '#/project/archive'
                })
            }
        }

        console.log('Current route name: ' + $location.path());
        // Get all URL parameter
        console.log($routeParams);


       /*$scope.pMenuTab = [
       {
           title: 'Project Management',
           iconclass: 'glyphicon glyphicon-folder-open',
           url: '#/project/create'
       },
       {
           title: 'Task Management',
           iconclass: 'glyphicon glyphicon-paperclip',
           url: '#/project/taskCreate'

       },
       {
           title: 'User Management',
           iconclass: 'glyphicon glyphicon-user',
           url: '#/user/create'
       }
       ];*/
  }

]);

