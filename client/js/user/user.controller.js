/**
 * Created by scottmackenzie on 5/05/2015.
 */
myApp.controller("UserCtrl", ['$scope', 'UserFactory',
    function($scope, UserFactory) {

        $scope.user = {
            email : "",
            firstName : "",
            lastName : "",
            password : "",
            phone : "",
            role : "",
            performanceIndex : 0,
            previousRoles : ['Developer', 'Tester']
        };
        $scope.roles = [{name: 'Administrator'}, {name: 'Team Member'}];
        $scope.selected = undefined;
        $scope.skills = [
            { title: 'C++'},
            { title: 'Java'},
            { title: 'MySQL'},
            { title: 'HTML'},
            { title: 'JavaScript'},
            { title: 'AngularJS'},
            { title: 'C'},
            { title: 'Python'},
            { title: 'C#'},
            { title: 'Objective C'}
        ];

        $scope.selectedRole = {name: 'Available Roles:'};

        $scope.setRole= function(role){
          $scope.selectedRole = role;
            $scope.user.role = role.name.toLowerCase();
        };

        $scope.show = function() {
            console.log($scope.user);
        }
        $scope.saveUser = function() {
            var msg = "Form error: ";
            var ok = true;
            if(!$scope.user.firstName) {
                ok = false;
                msg += "first name missing\n";
            }
            if(!$scope.user.lastName) {
                ok = false;
                msg += "last name missing\n";
            }
            if(!$scope.user.email) {
                ok = false;
                msg += "email missing\n";
            }
            if(!$scope.user.password) {
                ok = false;
                msg += "password missing\n";
            }
            if(!$scope.user.role) {
                ok = false;
                msg += "role missing\n";
            }
            if(ok === false) {
                alert(msg);
                return;
            }
            console.log("USER: ", $scope.user);
            UserFactory.createUser($scope.user).success(function(err, res) {
                alert($scope.user.email + ' successfully saved in database');
            }).error(function(err, res) {
                var msg = "Create user failed: " + err;
                console.log(err);
                alert(msg);
            })
        }

        $scope.submitUser = function() {
            console.log($scope.user);
        }



    }
]);

//Created by Nicholas Judd 2/7/15
myApp.controller("userCreate", ['$scope', 'UserFactory',
    function($scope, UserFactory) {
        $scope.roles = [
            {name: 'Administrator'},
            {name: 'Team Member'}];

        $scope.skills = [
            { title: 'C++'},
            { title: 'Java'},
            { title: 'MySQL'},
            { title: 'HTML'},
            { title: 'JavaScript'},
            { title: 'AngularJS'},
            { title: 'C'},
            { title: 'Python'},
            { title: 'C#'},
            { title: 'Objective C'}
        ];
        $scope.user = {
            email : "",
            firstName : "",
            lastName : "",
            password : "",
            phone : "",
            role : "",
            performanceIndex : 0,
            skills : [],
            previousRoles : ['Developer', 'Tester']
        };

        $scope.selectedRole = {name: 'Available Roles:'};


        $scope.setRole= function(role){
            console.log("TEST");
            $scope.selectedRole = role;
            $scope.user.role = role.name.toLowerCase();
        };

        $scope.saveUser = function() {
            $scope.user.skills = $('#userSkill').val();
            console.log($scope.user);
        }
    }
]);

myApp.controller("passwordCheck", ['$scope',
    function($scope) {

        $('#pass').keyup(function(e) {
            var strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
            var mediumRegex = new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
            var enoughRegex = new RegExp("(?=.{3,}).*", "g");
            if (false == enoughRegex.test($(this).val())) {
                $('#passstrength').html('More Characters');
            } else if (strongRegex.test($(this).val())) {
                $('#passstrength').className = 'ok';
                $('#passstrength').html('Strong!');
            } else if (mediumRegex.test($(this).val())) {
                $('#passstrength').className = 'alert';
                $('#passstrength').html('Medium!');
            } else {
                $('#passstrength').className = 'error';
                $('#passstrength').html('Weak!');
            }
            return true;
        });

        $(document).ready(function() {
            $("#pass2").keyup(validate);
        });

        function validate() {
            var password1 = $("#pass").val();
            var password2 = $("#pass2").val();



            if(password1 == password2) {
                $("#validate-status").text("valid");
            }
            else {
                $("#validate-status").text("invalid");
            }

        }
    }

]);