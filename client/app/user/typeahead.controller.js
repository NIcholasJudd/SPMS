myApp.controller("TypeaheadCtrl", ['$scope','UserFactory', function ($scope, UserFactory, Roles, Skill) {

    $scope.selectedNames = undefined;
    $scope.selectedRoles = undefined;
    $scope.selectedSkill = undefined;
    $scope.roles = ["Developer", "Tester", "Bug Fixer", "Analyst", "Graphic Designer", "Interface Designer", "Server Designer", "Database Engineer"];
    $scope.skills = ["administrator", "team member", "c++", "java", "html", "javascript", "Databases", "angular", "bootstrap"];
    $scope.user = [];
    UserFactory.getUsers().then(function (results) {
        //console.log('HERE:', results.data);
        results.data.forEach(function (user) {
            $scope.user.push({
                name: user.first_name + ' ' + user.last_name,
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                phone: user.phone,
                performanceIndex: user.performance_index * 10 ,
                role: user.user_type,
                previousRoles: user.previous_roles,
                active: user.active
            });
        })
    })
    $scope.newPassword = "";
    $scope.updateForm = false;
    $scope.activeUser = {};
    $scope.findUser = function(name){
        for(var i=0; i< $scope.user.length; i++){
            if(name == $scope.user[i].name){
                $scope.activeUser = $scope.user[i];
            }
        }
        $scope.updateForm = true;

        $scope.update = function(){
            console.log($scope.activeUser);
            UserFactory.updateUser($scope.activeUser).success(function(err, res) {
                alert($scope.activeUser.email + ' successfully updated in database');
            }).error(function(err, res) {
                var err_msg = "update user failed: ";
                if(err.code == "23505")
                    err_msg += "that user already exists";
                else
                    err_msg += err.detail;
                alert(err_msg);
            })
        }
        $scope.updateRole= function(role){
            $scope.activeUser.role = role.name.toLowerCase();
        };


        $scope.archive = function(){
            $scope.activeUser.active = !$scope.activeUser.active;
            UserFactory.archiveUser($scope.activeUser.email, $scope.activeUser.active)
                .success(function(err, res) {
                    if($scope.activeUser.active === false)
                        alert($scope.activeUser.email + ' has been successfully archived');
                    else
                        alert($scope.activeUser.email + ' has been successfully restored');
                })
                .error(function(err, res) {
                    if($scope.active === false)
                        alert('archive failed');
                    else
                        alert('restore failed');
                });
        };

        $scope.updatePassword = function(email, password) {
            if(password === "") {
                console.log("cannot update with empty password");

            } else {
                console.log(email, password);
                UserFactory.updatePassword(email, password)
                    .success(function(err, res) {
                        alert("Password updated");
                    })
                    .error(function(err, res) {
                        alert("Password update failed: ", err);
                    })
            }
        }
    };

}]);