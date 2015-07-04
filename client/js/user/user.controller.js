/**
 * Created by Nicholas Judd 2/07/15
 */
//Create User Controllers
myApp.controller("userCreate", ['$scope', 'UserFactory',
    function ($scope, UserFactory) {
        $scope.roles = [
            {name: 'Administrator'},
            {name: 'Team Member'}];
        $scope.passwordCheck = {password: ''};
        $scope.skills = [
            {title: 'C++'},
            {title: 'Java'},
            {title: 'MySQL'},
            {title: 'HTML'},
            {title: 'JavaScript'},
            {title: 'AngularJS'},
            {title: 'C'},
            {title: 'Python'},
            {title: 'C#'},
            {title: 'Objective C'}
        ];
        $scope.user = {
            email: "",
            firstName: "",
            lastName: "",
            password: "",
            phone: "",
            role: "",
            performanceIndex: 0,
            previousRoles: ['Developer', 'Tester']
        };

        $scope.selectedRole = {name: 'Available Roles:'};


        $scope.setRole = function (role) {
            console.log("TEST");
            $scope.selectedRole = role;
            $scope.user.role = role.name.toLowerCase();
        };

        $scope.submitUser = function () {

            $scope.errorMessage = [];
            console.log($scope.passwordCheck.password);
            $scope.error = false;
            if ($scope.user.password != $scope.passwordCheck.password){
                $scope.error = true;
                $scope.errorMessage.push({
                    msg: "Passwords do not match!\n"
                });
            }
            if (!$scope.user.firstName) {
                $scope.error = true;
                $scope.errorMessage.push({
                    msg: "first name missing\n"
                });
            }
            if (!$scope.user.lastName) {
                $scope.error = true;
                $scope.errorMessage.push({
                    msg:  "last name missing\n"
                });
            }
            if (!$scope.user.email) {
                $scope.error = true;
                $scope.errorMessage.push({
                    msg: "email missing\n"
                });
            }
            if (!$scope.user.password) {
                $scope.error = true;
                $scope.errorMessage.push({
                    msg: "password missing\n"
                });
            }
            if (!$scope.user.role) {
                $scope.error = true;
                $scope.errorMessage.push({
                    msg: "role missing\n"
                });
            }
            if ($scope.error === true) {
                console.log($scope.errorMessage);
                return;
            }
            console.log("USER: ", $scope.user);
            UserFactory.createUser($scope.user).success(function (err, res) {
                alert($scope.user.email + ' successfully saved in database');
            }).error(function (err, res) {
                var msg = "Create user failed: " + err;
                console.log(err);
                alert(msg);
            })
        }

        $scope.saveUser = function () {
            $scope.user.skills = $('#userSkill').val();
            console.log($scope.user);
        }
    }
]);

myApp.controller("passwordCheck", [ '$scope',
    function($scope){
        $scope.passwordStrength = function(pass){
            console.log("TEST PASSWORD " + pass);
        };
    }
]);
    //check password strength
    /*function () {
        $('#pass').keyup(function (e) {
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
            validate();
            return true;
        });*/



       /* $(document).ready(function () {
            $("#pass2").keyup(validate);
        });
        //checks passwords are the same
        function validate() {
            var password1 = $("#pass").val();
            var password2 = $("#pass2").val();
            if (password1 == password2) {
                $("#validate-status").text("valid");
            }
            else {
                $("#validate-status").text("invalid");
            }
        }
    }
]);*/

//Modify Users Controllers
myApp.controller("userModify", ['$scope','UserFactory',
    function ($scope, UserFactory) {
        $scope.user = [];
        $scope.selectedNames = undefined;
        $scope.activeUser = {};
        UserFactory.getUsers().then(function (results) {
            results.data.forEach(function (user) {
                $scope.user.push({
                    name: user.firstName + ' ' + user.lastName,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone,
                    performanceIndex: user.performanceIndex * 10,
                    role: user.userType,
                    previousRoles: user.previousRoles,
                    active: user.active
                });
            })
        })
        $scope.skills = [
            {title: 'C++'},
            {title: 'Java'},
            {title: 'MySQL'},
            {title: 'HTML'},
            {title: 'JavaScript'},
            {title: 'AngularJS'},
            {title: 'C'},
            {title: 'Python'},
            {title: 'C#'},
            {title: 'Objective C'}
        ];
        $scope.roles = [
            {name: 'Administrator'},
            {name: 'Team Member'}];
        $scope.selectedRole;
        $scope.setRole = function (role) {
            console.log("TEST");
            $scope.selectedRole = role;
            $scope.activeUser.role = role.name.toLowerCase();
        };

        $scope.updateForm = false;
        $scope.findUser = function (name) {
            for (var i = 0; i < $scope.user.length; i++) {
                if (name == $scope.user[i].name) {
                    $scope.activeUser = $scope.user[i];
                    $scope.selectedRole = {name:$scope.activeUser.role}
                };
            };
            console.log($scope.activeUser);
            $scope.updateForm = true;
        };
    }]);