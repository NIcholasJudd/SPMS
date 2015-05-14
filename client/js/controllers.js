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

myApp.controller("HomeCtrl", ['$scope',
    function($scope) {

    $scope.name = "Home Controller";



    $scope.Tasks = [
      {title: 'Title',
      description: 'Description',
      priority: 'High'},
      {title: 'Title',
      description: 'Description',
      priority: 'medium'},
      {title: 'Title',
      description: 'Description',
      priority:'low'},
      {title: 'Title',
      description: 'Description',
      priority:'low'},
      {title: 'Title',
      description: 'Description',
      priority:'low'},
      {title: 'Title',
      description: 'Description',
      priority:'low'},
      {title: 'Title',
      description: 'Description',
      priority:'low'},
      {title: 'Title',
      description: 'Description',
      priority:'low'},
      {title: 'Title',
      description: 'Description',
      priority:'low'},
      {title: 'Title',
      description: 'Description',
      priority:'low'}
    ];

  $scope.taskPriority = function($index){
    if ($scope.Tasks[$index].priority == 'High'){
      return 'panel panel-danger';
    } else if($scope.Tasks[$index].priority == 'medium'){
        return 'panel panel-warning';
    }else
    {
      return 'panel panel-info';
    }
  };

      $scope.greetingTime = function(){

          var currTime = (new Date()).getHours();
          if(currTime < 12) {
              return "Morning";
          }else if(currTime > 12 && currTime < 18){
              return "Afternoon";
          }else {
              return "Evening";
          }
      };

       $scope.pMenuTab = [
           {
               title: 'Project Management',
               iconclass: 'glyphicon glyphicon-folder-open'
           },
           {
               title: 'Task Management',
               iconclass: 'glyphicon glyphicon-paperclip'

           },
           {
               title: 'User Management',
               iconclass: 'glyphicon glyphicon-user'
           }
       ];
  }

]);

