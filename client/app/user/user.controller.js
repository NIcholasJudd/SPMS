/**
 * Created by Nicholas Judd 2/07/15
 */
//Create User Controllers
myApp.controller("AddUserCtrl", ['$scope', 'UserFactory',
    function ($scope, UserFactory) {
        $scope.users = [{
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            role: "teammember"
        }];
        $scope.newLine = function(){
            console.log($scope.users);
            $scope.users.push({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                role: "teammember"
            });
        }
        $scope.addUser = function () {
            for (var i = 0; i < $scope.users.length; i++) {
                var oneTimePassword = Math.random().toString(36).slice(2);
                $scope.users[i].password = oneTimePassword;
                $scope.errorMessage = {};
                $scope.error = false;
                if (!$scope.users[i].firstName) {
                    $scope.errorMessage.fName = "first name missing\n";
                }
                if (!$scope.users[i].lastName) {
                    $scope.error = true;
                    $scope.errorMessage.lName = "last name missing\n";
                }
                if (!$scope.users[i].email) {
                    $scope.error = true;
                    $scope.errorMessage.email = "email missing\n";
                }
                if ($scope.error === true) {
                    return;
                }
                UserFactory.createUser($scope.users[i]).success(function (err, res) {
                    alert($scope.users[i].email + ' successfully saved in database');
                }).error(function (err, res) {
                    var msg = "Create user failed: " + err;
                    console.log(err);
                    alert(msg);
                })
                //UserFactory.sendEmail($scope.users[i])
            }
        };
    }
])
myApp.controller("CreateUserCtrl", ['$scope', 'UserFactory',
    function ($scope, UserFactory) {
        $scope.roles = [
            {name: 'Administrator'},
            {name: 'Team Member'}];
        $scope.customStyle = {}
        $scope.customStyle.fontStyle = {"color":"orange"};
        $scope.passwordCheck;
        $scope.skills = [ 'C++','Java','MySQL','HTML','JavaScript','AngularJS','C ','Python','C#','Objective C'];
        $scope.selectedSkills =[];
        $scope.user = {
            email: "",
            firstName: "",
            lastName: "",
            password: "",
            phone: "",
            role: "",
            performanceIndex: 0,
            skills: []
        };
        $scope.selectedRole = {name: 'Available Roles:'};
        $scope.tooltip = {password: "Enter Password",
            password2: "Enter Password",
            firstName: "The Users First Name",
            lastName: "The Users Last Name",
            email: "Email Address *****@companyname ",
            phoneNumber: "The Users Phone Number",
            roles: "Select Users Role",
            skills: "Select Skills that the User has",
            selectedSkills: "Select Skills to remove from User"
        };
        $scope.updateSkills = function(info) {
            for (var i = 0; i < $scope.skills.length; i++){
                for(var j = 0; j < info.length; j++) {
                    if ($scope.skills[i] == info[j]) {
                        $scope.skills.splice(i,1);
                        i--;
                        $scope.user.skills.push(info[j]);
                    }
                }
            }
            $scope.selectedSkills = $scope.skills[0];
        };
        $scope.removeSkills = function(info) {
            for (var i = 0; i < $scope.user.skills.length; i++){
                for(var j = 0; j < info.length; j++) {
                    if ($scope.user.skills[i] == info[j]) {
                        $scope.user.skills.splice(i,1);
                        i--;
                        $scope.skills.push(info[j]);
                    }
                }
            }
            $scope.selectedSkills = $scope.user.skills[0];
        };

        $scope.setRole = function (role) {
            $scope.selectedRole = role;
            $scope.user.role = role.name.toLowerCase();
        };

        $scope.submitUser = function () {
            $scope.errorMessage = {};
            $scope.error = false;
            console.log($scope.user.password);
            if ($scope.user.password != $scope.passwordCheck) {
                $scope.error = true;
                $scope.errorMessage.passwordCompare = "Passwords do not match!\n";
            }
            if (!$scope.user.firstName) {
                $scope.errorMessage.fName = "first name missing\n";
            }
            if (!$scope.user.lastName) {
                $scope.error = true;
                $scope.errorMessage.lName = "last name missing\n";
            }
            if (!$scope.user.phone){
                $scope.error = true;
                $scope.errorMessage.phoneNumber = "Phone number missing\n";
            }
            if (!$scope.user.email) {
                $scope.error = true;
                $scope.errorMessage.email = "email missing\n";
            }
            if($scope.user.password.length < 4){
                $scope.error = true;
                $scope.errorMessage.password = "password is invalid\n";
            }
            if (!$scope.user.password) {
                $scope.error = true;
                $scope.errorMessage.password = "password missing\n";
            }
            if (!$scope.user.role) {
                $scope.error = true;
                $scope.errorMessage.roles = "role missing\n";
            }
            if ($scope.error === true) {
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
    }
]);

myApp.controller("PasswordCheckCtrl", [ '$scope',
    function ($scope) {
        $scope.customStyle = {};
        $scope.customStyle.fontStyle = {"color":"orange"};
        //check password strength
        $scope.password = {};
        $scope.compare = {};
        $scope.passwordStrength = function (pass, pass2) {
            $scope.passwordCompare(pass, pass2);
            $scope.specialChars = "!@#$%^&*()+=-[]\';,./{}|:<>?~_1234567890";
            $scope.upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            $scope.lowerCase = "abcdefghijklmnopqrstuvwxyz";
            $scope.specCount = 0;
            $scope.upperCount = 0;
            $scope.lowerCount = 0;
            for (var i = 0; i < pass.length; i++) {
                if ($scope.specialChars.indexOf(pass.charAt(i)) != -1) {
                    $scope.specCount++;
                }

                if (pass[i] == pass[i].toUpperCase()){
                    $scope.upperCount++;
                }
                if ($scope.lowerCase.indexOf(pass.charAt(i)) != -1) {
                    $scope.lowerCount++;
                }
            }
            var lengthCount = $scope.specCount + $scope.upperCount + $scope.lowerCount;
            if (lengthCount < 4){
                $scope.customStyle.strengthStyle = {"color":"red"};
                $scope.password.Strength = "Invalid Password";
            }else if (lengthCount >= 4 && $scope.lowerCount > 0 && $scope.specCount == 0 && $scope.upperCount == 0){
                $scope.customStyle.strengthStyle = {"color":"orange"};
                $scope.password.Strength = "Weak Password";
            } else if(lengthCount >=8 && $scope.specCount >= 1 &&  $scope.upperCount >= 2 && $scope.lowerCount >= 2){
                $scope.customStyle.strengthStyle = {"color":"green"};
                $scope.password.Strength = "Strong Password";
            } else if(lengthCount >= 4 && $scope.specCount > 0 && $scope.upperCount > 0 || $scope.lowerCount > 0){
                $scope.customStyle.strengthStyle = {"color":"blue"};
                $scope.password.Strength = "Medium Strength Password";
            }
            return true;
        };
        $scope.passwordCompare = function(pass1, pass2) {
            if (pass1 == pass2 && pass1.length > 0){
                $scope.customStyle.compareStyle = {"color":"green"};
                $scope.compare.match = "Valid Password";
            } else {
                $scope.customStyle.compareStyle = {"color":"red"};
                $scope.compare.match = "Passwords don't Match";
            }
        }
    }]);

//Modify Users Controllers
myApp.controller("ModifyUserCtrl", ['$scope','UserFactory',
    function ($scope, UserFactory) {
        $scope.user = [];
        $scope.selectedNames = undefined;
        $scope.activeUser = {};
        $scope.selectedSkills =[];
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
                    skills: user.skills,
                    active: user.active
                });
            })
        })
        $scope.skills = [ 'C++','Java','MySQL','HTML','JavaScript','AngularJS','C','Python','C#','Objective C'];
        $scope.roles = [
            {name: 'Administrator'},
            {name: 'Team Member'}];
        $scope.selectedRole;
        $scope.setRole = function (role) {
            console.log("TEST");
            $scope.selectedRole = role;
            $scope.activeUser.role = role.name.toLowerCase();
        };
        $scope.updateSkills = function(info) {
            for (var i = 0; i < $scope.skills.length; i++){
                for(var j = 0; j < info.length; j++) {
                    if ($scope.skills[i] == info[j]) {
                        $scope.skills.splice(i,1);
                        i--;
                        $scope.activeUser.skills.push(info[j]);
                    }
                }
            }
            console.log($scope.skills);
            $scope.selectedSkills = $scope.skills[0];
        };
        $scope.removeSkills = function(info) {
            for (var i = 0; i < $scope.activeUser.skills.length; i++){
                for(var j = 0; j < info.length; j++) {
                    if ($scope.activeUser.skills[i] == info[j]) {
                        $scope.activeUser.skills.splice(i,1);
                        i--;
                        $scope.skills.push(info[j]);
                    }
                }
            }
            $scope.selectedSkills = $scope.activeUser.skills[0];
        };
        $scope.updateForm = false;
        $scope.findUser = function (name) {
            for (var i = 0; i < $scope.user.length; i++) {
                if (name == $scope.user[i].name) {
                    $scope.activeUser = $scope.user[i];
                    $scope.selectedRole = {name:$scope.activeUser.role}
                }
            }
            for (var i = 0; i < $scope.activeUser.skills.length; i++){
                console.log("TEST!");
                for (var x = 0; x < $scope.skills.length; x ++){
                    if ($scope.activeUser.skills[i] == $scope.skills[x]){
                        $scope.skills.splice(x,1);
                        console.log($scope.activeUser.skills[i]);
                        console.log($scope.skills[i]);
                    }
                }
            }
            console.log($scope.skills);
            console.log($scope.activeUser);
            $scope.updateForm = true;
        };
        $scope.tooltip = {password: "Weak: 4 or more Characters\n" +
        "Medium: 4 or more characters \n" +
        "At least 1 lower case, upper case and special character\n" +
        "Strong: 8 or more characters\n" +
        "more than 2 lower case, upper case and special characters.",
            password2: "re-enter password",
            firstName: "The users first Name",
            lastName: "The users Sir name",
            email: "email address *****@companyname ",
            phoneNumber: "The users phone number",
            roles: "Administrator has full access. Team Member has to be assigned tasks",
            skills: "Select Skills that the user has",
            selectedSkills: "Select Skills to remove from user",
            preformance: "Select a number of stars to indicate employees preformance"
        };

        /*$scope.submitUser = function () {
            $scope.errorMessage = {};
            $scope.error = false;
            if ($scope.user.password != $scope.passwordCheck.password) {
                $scope.error = true;
                $scope.errorMessage.passwordCompare = "Passwords do not match!\n";
            }
            if (!$scope.user.firstName) {
                $scope.errorMessage.fName = "first name missing\n";
            }
            if (!$scope.user.lastName) {
                $scope.error = true;
                $scope.errorMessage.lName = "last name missing\n";
            }
            if (!$scope.user.phone){
                $scope.error = true;
                $scope.errorMessage.phoneNumber = "Phone number missing\n";
            }
            if (!$scope.user.email) {
                $scope.error = true;
                $scope.errorMessage.email = "email missing\n";
            }
            if($scope.user.password.length < 4){
                $scope.error = true;
                $scope.errorMessage.password = "password is invalid\n";
            }
            if (!$scope.user.password) {
                $scope.error = true;
                $scope.errorMessage.password = "password missing\n";
            }
            if (!$scope.user.role) {
                $scope.error = true;
                $scope.errorMessage.roles = "role missing\n";
            }
            if ($scope.error === true) {
                return;
            }
            console.log("USER: ", $scope.user);
            UserFactory.updateUser($scope.user).success(function (err, res) {
                alert($scope.user.email + ' successfully saved in database');
            }).error(function (err, res) {
                var msg = "Create user failed: " + err;
                console.log(err);
                alert(msg);
            })
        }*/
    }]);