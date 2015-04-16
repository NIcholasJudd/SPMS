var app = angular.module('myApp', []);

// Routing of the embedded task pages
app.config(function($routeProvider) {
    $routeProvider

        .when('/', {
            templateUrl : 'pages/dashboard.html'
        })

        // route for the 'unassigned tasks' page
        .when('/unassigned', {
            templateUrl : 'pages/tasks.unassigned.html'/*,
            controller  : 'DashboardController'*/
        })

        // route for the 'on-the-go tasks' page
        .when('/on-the-go', {
            templateUrl : 'pages/tasks.on-the-go.html'/*,
            controller  : 'DashboardController'*/
        })

        // route for the 'finalised tasks' page
        .when('/to-be-finalised', {
            templateUrl : 'pages/tasks.finalised.html'/*,
            controller  : 'DashboardController'*/
        })
        //route for the 'completed tasks' page

        .when('/completed', {
            templateUrl : 'pages/tasks.completed.html'
        });
});


app.controller('DashboardController', function($scope) {
	$scope.tasks = $scope.tasks || [{
		name: "design database schema",
		description: "UML design of tables and relationships between tables",
		status: "unassigned",
        assignees: [],
        startDate: null,
        estimatedEndDate: null,
        endDate: null
	}, {
		name: "build database",
		description: "build the database according to the UML design",
		status: "unassigned",
        assignees: [],
        startDate: null,
        estimatedEndDate: null,
        endDate: null
	}, {
        name: "test the database",
        description: "Test the database",
        status: "unassigned",
        assignees: [],
        startDate: null,
        estimatedEndDate: null,
        endDate: null
    }, {
        name: "deploy the database",
        description: "deploy the database to Amazon Web Services",
        status: "unassigned",
        assignees: [],
        startDate: null,
        estimatedEndDate: null,
        endDate: null
    }, {
        name: "fix page refresh bug",
        description: "User data not loading when the user refreshes the page",
        status: "on-the-go",
        assignees: ["Scott", "Nick"],
        startDate: "13/03/2015",
        estimatedEndDate: "01/04/2015",
        endDate: null,
        comments: ["likely to be delayed", "this is a difficult bug"]
    }, {
        name: "implement server side validation",
        description: "Security measure",
        status: "on-the-go",
        assignees: ["Scott", "Nick", "Paul"],
        startDate: "22/03/2015",
        estimatedEndDate: "14/04/2015",
        endDate: null,
        comments: ["cross side checks complete, now working on DDOS"]
    }, {
        name: "test for security vulnerabilities",
        description: "XSS scripting, DDoS, etc",
        status: "on-the-go",
        assignees: ["Nick", "Jim"],
        startDate: "01/02/2015",
        estimatedEndDate: "15/04/2015",
        endDate: null
    }, {
        name: "User profile UI",
        description: "User interface of profile when user logs in",
        status: "to-be-finalised",
        assignees: ["Nick", "Scott"],
        startDate: "01/02/2015",
        estimatedEndDate: "15/04/2015",
        endDate: null
    }, {
        name: "Server side API implementation",
        description: "Handle http requests from client to server, set up framework for database queries to be made",
        status: "to-be-finalised",
        assignees: ["Paul", "Jim"],
        startDate: "16/03/2015",
        estimatedEndDate: "29/03/2015",
        endDate: null
    }, {
        name: "Login",
        description: "Login screen",
        status: "completed",
        assignees: ["Paul", "Scott"],
        startDate: "29/02/2015",
        estimatedEndDate: "16/03/2015",
        endDate: "15/03/2015"
    }, {
        name: "Login functionality",
        description: "Login functionality description",
        status: "completed",
        assignees: ["Jim", "Nick"],
        startDate: "04/03/2015",
        estimatedEndDate: "15/03/2015",
        endDate: "22/03/2015"
    }];

    $scope.users = [{
        name: "Scott",
        skills: ["C++"]
    }, {
        name: "Nick",
        skills: ["C++", "Java"]
    }, {
        name: "Paul",
        skills: ["C++", "Web Dev"]
    }, {
        name: "Jim",
        skills: ["C++"]
    }];

    $scope.tempAssignee = [];
    $scope.addTempAssignee = function(user) {
        $scope.tempAssignee.push(user);
    }

    $scope.changeStatus = function(task) {
        var index = $scope.tasks.indexOf(task);
        console.log(index);
        if($scope.tasks[index].status == "unassigned") {
            if($scope.tasks[index].assignees.length == 0)
                alert("assign developers first by opening a task and clicking a developer name");
            else {
                $scope.tasks[index].status = "on-the-go";
                $scope.tasks[index].startDate = "02/04/2015";            
                $scope.tasks[index].estimatedEndDate = "15/04/2015";               
            }
        }            
        else if($scope.tasks[index].status == "to-be-finalised") {
            $scope.tasks[index].status = "completed";
            $scope.tasks[index].endDate = "02/04/2015";            
        }
        console.log($scope.tasks);
        $scope.$apply;
    }


    $scope.addAssignee = function(task, user) {
        console.log("called" + task);
        /*$scope.tempAssignee.forEach(function(user) {
            task.assignees.push(user);
        })*/
        //this.$hide;
        /*if(task.assignees.length > 0)
            task.status = "on-the-go";*/
        var userIndex = task.assignees.indexOf(user);
        if(userIndex > -1)
            alert(user.name + " has already been assigned to this task");
        else {
            //var taskIndex = $scope.tasks.indexOf(task);
            //$scope.tasks[taskIndex].assignees.push(user);
            task.assignees.push(user);
            console.log(task);
            //console.log(taskIndex);
            //console.log($scope.tasks[taskIndex].assignees);
            //console.log($scope.tasks);
        }
        //task.status = "on-the-go";
    }
})