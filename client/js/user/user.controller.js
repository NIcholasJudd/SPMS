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
    function ($scope) {
        //check password strength
        $scope.password = {};
        $scope.passwordStrength = function (pass) {
            //console.log(pass);
            $scope.specialChars = "!@#$%^&*()+=-[]\';,./{}|:<>?~_1234567890";
            $scope.upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            $scope.lowerCase = "abcdefghijklmnopqrstuvwxyz";
            //console.log(pass.length);
            $scope.specCount = 0;
            $scope.upperCount = 0;
            $scope.lowerCount =0;
            for (var i = 0; i < pass.length; i++) {
                if ($scope.specialChars.indexOf(pass.charAt(i)) != -1) {
                    $scope.specCount++;
                    //console.log("Your string has special characters. : " + $scope.specCount);
                }
                if ($scope.upperCase.indexOf(pass.charAt(i)) != -1) {
                    $scope.upperCount++;
                    //console.log("Your string has upper case characters. : " + $scope.upperCount);
                }
                if ($scope.lowerCase.indexOf(pass.charAt(i)) != -1) {
                    $scope.lowerCount++;
                    //console.log("Your string has lower case characters. : " + $scope.lowerCount);
                }
                var lengthCount = $scope.specCount + $scope.upperCount + $scope.lowerCount;
                if (lengthCount < 4){
                    console.log("Invalid Password");
                    $scope.password.Strength = "Invalid Password";
                }else if (lengthCount >= 4 && $scope.lowerCount > 0 && $scope.specCount == 0 && $scope.upperCount == 0){
                    console.log("Weak Password");
                    $scope.password.Strength = "Weak Password";
                } else if(lengthCount >=8 && $scope.specCount > 2 &&  $scope.upperCount > 2 && $scope.lowerCount > 2){
                    console.log("Strong Password");
                    $scope.password.Strength = "Strong Password";
                } else if(lengthCount >= 4 && $scope.specCount > 0 && $scope.upperCount > 0 && $scope.lowerCount > 0){
                    console.log("Medium Strength Password");
                    $scope.password.Strength = "Medium Strength Password";
                }
            }
            return true;
        };
    }]);

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