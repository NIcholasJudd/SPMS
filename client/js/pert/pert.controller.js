/**
 * Created by scottmackenzie on 22/05/2015.
 */

myApp.controller('PERTCtrl', ['$scope', '$window', '$q', 'ProjectFactory',
    function($scope, $window, $q, ProjectFactory) {

        var getTasks = function() {
            var deferred = $q.defer();
            ProjectFactory.getTasks($window.sessionStorage.projectName).then(function (result) {
                return deferred.resolve(result.data);
            })
            return deferred.promise;
        };

        var getLinks = function() {
            var deferred = $q.defer();
            ProjectFactory.getLinks($window.sessionStorage.projectName).then(function (result) {
                return deferred.resolve(result.data);
            })
            return deferred.promise;
        }

        var getProject = function() {
            var deferred = $q.defer();
            ProjectFactory.getProject($window.sessionStorage.projectName).then(function(result) {
                return deferred.resolve(result.data);
            })
            return deferred.promise;
        }

        var calculatePert = function() {
            $q.all([getTasks(), getLinks(), getProject()]).then(function(result) {
                var tasks = result[0];
                if(tasks.length === 0) {
                    $scope.pert = -1;
                    return;
                }
                var links = result[1];
                var project = result[2];
                var projectDuration = (new Date(project.estimated_end_date) - new Date(project.start_date))/86400000;
                tasks = findCriticalPath(tasks, links);
                var expectedDurationArray = calculateExpectedDurationArray(tasks);
                var varianceSquaredArray = calculateVarianceArray(tasks);
                var expectedDuration = expectedDurationArray.reduce(function(a,b) { return a + b}, 0);
                var variance = Math.sqrt(varianceSquaredArray.reduce(function(a,b) { return a + b}, 0));
                var z_value = (projectDuration - expectedDuration) / variance;
                $scope.pert = convertZValue(z_value);

            });
        };

        function convertZValue(zValue) {
            var zValueMap = [
                {z_value: 3.25, percentage: '<0.1'},
                {z_value: 3, percentage: 0.5},
                {z_value: 2.75, percentage: 1},
                {z_value: 2.50, percentage: 2},
                {z_value: 2.25, percentage: 3},
                {z_value: 2, percentage: 4},
                {z_value: 1.75, percentage: 5},
                {z_value: 1.50, percentage: 8},
                {z_value: 1.25, percentage: 12},
                {z_value: 1, percentage: 18},
                {z_value: .75, percentage: 23},
                {z_value: .5, percentage: 30},
                {z_value: .25, percentage: 40},
                {z_value: 0, percentage: 50},
                {z_value: -0.25, percentage: 60},
                {z_value: -0.5, percentage: 69},
                {z_value: -0.75, percentage: 77},
                {z_value: -1, percentage: 85},
                {z_value: -1.25, percentage: 90},
                {z_value: -1.5, percentage: 94},
                {z_value: -1.75, percentage: 95},
                {z_value: -2, percentage: 96},
                {z_value: -2.25, percentage: 97},
                {z_value: -2.50, percentage: 98},
                {z_value: -2.75, percentage: 99},
                {z_value: -3, percentage: '>99'},
                {z_value: -3.25, percentage: '>99'}
            ];
            var index = 0;
            if (zValue <= -3.25)
                return '>99';
            while (zValue < zValueMap[index].z_value) {
                index++;
            }
            return zValueMap[index].percentage;
        }

        function findCriticalPath(tasks, links) {
            var edgelist = [];
            tasks.forEach(function(task) {
                edgelist.push([task.task_id, task.likely_duration.days, [], 0]);
            })
            links.forEach(function(link) {
                var index = -1;
                for(var i = 0; i < edgelist.length; i++) {
                    if(edgelist[i][0] === link.target)
                        index = i;
                }
                if(index === -1) {
                    console.log('LINK ERROR');
                    return;
                }
                edgelist[index][2].push(link.source);
            });

            myTree = new Array(0);
            var treeLevel = 0
            var nodeCount = 0
            var changed = false;

            while (nodeCount < edgelist.length) { // Build tree from edgelist
                myTree[treeLevel] = new Array(0);
                changed = false;

                for (var i = 0; i < edgelist.length; i++) {
                    if (edgelist[i][3] == 0) {
                        var check = true;
                        for (var j = 0; j < edgelist[i][2].length; j++) {
                            if (!inTree(myTree,edgelist[i][2][j])) {
                                check = false;
                            }
                        }
                        if (check) {
                            //               console.log(edgelist[i][0],"marked for inclusion");
                            edgelist[i][3] = 1;
                            changed = true;
                        }
                    }
                }

                for (var i = 0; i < edgelist.length; i++) {
                    if (edgelist[i][3] == 1) {
                        var myNode = new node(edgelist[i][0],edgelist[i][1],edgelist[i][2]);
                        myTree[treeLevel].push(myNode);
//            console.log(edgelist[i][0],"added to myTree");
                        edgelist[i][3] = 2;
                        nodeCount++;
                    }
                }
                treeLevel++;
                if (!changed) {
                    console.log("REKT: Can't continue building tree, check your dependencies");
                    AbortJavaScript();
                }
            }

            var startNode = new node("Start", 0, ' '); // Create start node
            startNode.ls = 0;
            for (var i = 0; i < myTree[0].length; i++) { // Link start node to level 0 of myTree
                startNode.fwdLinks.push(myTree[0][i].label);
                //myTree[0][i].es = 0; // Set earliest start for all level 0 nodes to 0
                //myTree[0][i].ef = myTree[0][i].duration;
            }
            var endNode = new node("endNode", 0, ' '); // Create end node
            endNode.dependency = new Array(0);

// Calculate forward links - This is not as bad as it looks!
            for (var i = 0; i < myTree.length; i++) { // Visits each level in tree
                for (var j = 0; j < myTree[i].length; j++) { // Visits each node in that level - Still at O(n)!
                    for (var k = 0; k < edgelist.length; k++) { // Checks against each edge in edgelist
                        for (var l = 0; l < edgelist[k][2].length; l++) { // Checks against each dependency for that edge - O(n^2)ish
                            if (edgelist[k][2][l] == myTree[i][j].label) {
                                myTree[i][j].fwdLinks.push(edgelist[k][0]);
                            }
                        }
                    }
                    if (myTree[i][j].fwdLinks.length == 0) {
                        myTree[i][j].fwdLinks.push("endNode");
                        endNode.dependency.push(myTree[i][j].label);
                    }
                }
            }

// Calculate Earliest Start and Earliest Finish
            for (var i = 0; i < myTree.length; i++) { // Visits each level in tree starting at 0
                for (var j = 0; j < myTree[i].length; j++) { // Visits each node in that level
                    calcEsEf(myTree, myTree[i][j]);
                }
            }

            calcEsEf(myTree, endNode);
            endNode.ls = endNode.es;

// Calculate Latest Finish, Latest Start and Float
            for (var i = myTree.length-1; i >= 0; i--) { // Visits each level in tree starting at max level
                //console.log("i: ",'i');
                for (var j = 0; j < myTree[i].length; j++) { // Visits each node in that level
                    //console.log("Assessing node",myTree[i][j].label);
                    calcLfLs(myTree, myTree[i][j], endNode);
                }
            }

// Rearrange Nodes (from right to left, move all terminal nodes to the last column) <-- FIX THIS
            for (var i = (myTree.length)-2; i >= 0; i--) {
//    console.log("Checking myTree index:",i);
                for (var j = 0; j < myTree[i].length; j++) {
                    if (myTree[i][j].fwdLinks[0] == "endNode") {
//            console.log(myTree[i][j].label,"is directly connected to the endNode");
                        var temp = myTree[i][j];
                        myTree[myTree.length-1].push(temp);
                        myTree[i].splice(j, 1);
                        j--;
//            console.log("temp looks a little something like this: ", temp);
                    }
                }
            }

// Display Critical Path
            var criticalPath = [];
            for (var i = 0; i < myTree.length; i++) {
                for (var j = 0; j < myTree[i].length; j++) {
                    if (myTree[i][j].float == 0) {
                        for(var k = 0; k < tasks.length; k++) {
                            if(myTree[i][j].label === tasks[k].task_id) {
                                criticalPath.push(tasks[k]);
                            }
                        }
                        //console.log(" ",myTree[i][j].label);
                    }
                }
            }
            return criticalPath;
        }

        function inTree(tree, c) {
//    console.log("Checking to see if '",c,"' is in the tree...");
            if (c == ' ') { // If c has no dependencies
//        console.log("Node has no dependencies");
                return true;
            }
            for (var i = 0; i < tree.length; i++) {
                for (var j = 0; j < tree[i].length; j++) {
                    if (tree[i][j].label == c) { // If dependency c is in the tree
//                console.log("Dependency",c,"is in the tree");
                        return true;
                    }
                }
            }
//    console.log("Dependency",c,"is NOT in the tree");
            return false;
        }

        function node(label, duration, dependency) {
            this.label = label;
            this.duration = duration;
            this.dependency = dependency;
            this.fwdLinks = new Array(0);
            this.es = -1; // Earliest Start
            this.ls = -1; // Latest Start
            this.ef = -1; // Earliest Finish
            this.lf = -1; // Latest Finish
            this.float = -1;
        }

        function calcEsEf(tree, myNode) {
            var myEs = -1;
            var myEf = -1;
            var temp = -1;
            for (var i = 0; i < myNode.dependency.length; i++) { // Step through dependencies of node being calculated
                temp = getEf(tree, myNode.dependency[i]);
                if (temp > myEs) {
                    myEs = temp;
                }
            }
            myNode.es = myEs; // myEs should now contain the greatest EF of the nodes myNode is dependent on
            myNode.ef = myEs + myNode.duration; // EF = ES + Duration
        }

        function calcLfLs(tree, myNode, endNode) {
            //console.log("calcLfLs for node",myNode.label);
            var myLs = -1;
            var myLf = -1;
            var temp = -1;
            for (var i = 0; i < myNode.fwdLinks.length; i++) {
                temp = getLs(tree, myNode.fwdLinks[i], endNode);
                if (myLf == -1 || temp < myLf) {
                    myLf = temp;
                }
            }
            myNode.lf = myLf; // myLf should now contain the lowest LS of all fwdLinks
            myNode.ls = myNode.lf - myNode.duration;
            myNode.float = myNode.ls - myNode.es;
        }


        function getEf(tree, l) {
            if (l == ' ') {
                return 0;
            }
            for (var i = 0; i < tree.length; i++) {
                for (var j = 0; j < tree[i].length; j++) {
                    if (tree[i][j].label == l) {
                        return tree[i][j].ef;
                    }
                }
            }
            console.log("REKT: Function getEf() has failed");
            AbortJavaScript();
        }

        function getLs(tree, l, endNode) {
            if (l == 'endNode') {
                //console.log("That one was attached to endNode");
                return endNode.ls;
            }
            for (var i = 0; i < tree.length; i++) {
                for (var j = 0; j < tree[i].length; j++) {
                    if (tree[i][j].label == l) {
                        return tree[i][j].ls;
                    }
                }
            }
            console.log("REKT: Function getLs() has failed");
            AbortJavaScript();
        }

        var calculateExpectedDurationArray = function(tasks) {
            var expectedTimeArray = [];
            tasks.forEach(function(task) {
                expectedTimeArray.push((task.optimistic_duration.days + 4 * task.likely_duration.days +
                task.pessimistic_duration.days) / 6);
            })
            return expectedTimeArray;
        }

        var calculateVarianceArray = function(tasks) {
            var varianceSquaredArray = [];
            tasks.forEach(function(task) {
                varianceSquaredArray.push(Math.pow((task.pessimistic_duration.days - task.optimistic_duration.days) / 6, 2));
            })
            return varianceSquaredArray;
        }

        $scope.$watch(function() { return $window.sessionStorage.projectName},
        function() {
            calculatePert();
        });


    }
]);
