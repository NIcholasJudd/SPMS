/**
 * Created by scottmackenzie on 20/05/15.
 */

myApp.controller("APNCtrl", ['$scope', '$q', '$window', 'ProjectFactory',
    function($scope, $q, $window, ProjectFactory) {
        var tasks = [], dependencies = [];

        //$scope.projectName = $window.sessionStorage.projectName;
        /*ProjectFactory.getTasks($scope.projectName).then(function(res) {
            res.data.forEach(function(task) {
                tasks.push({
                    number : task.task_number,
                    id : task.task_id,
                    name : task.task_name,
                    duration : task.likely_duration.days
                })
            });
            ProjectFactory.getLinks($scope.projectName).then(function(res) {
                res.data.forEach(function(link) {
                    dependencies.push({
                        id : link.link_id,
                        source : link.source,
                        target : link.target
                    })
                });
            })
        });*/

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

        $q.all([getTasks(), getLinks()]).then(function(result) {
            var tasks = result[0];
            if(tasks.length === 0) {
                //$scope.pert = -1;
                console.log('the fappening');
                return;
            }
            var links = result[1];
            $scope.tasks = tasks;
            $scope.dependencies = links;
            //var project = result[2];
            createAPNChart(tasks, links);
            /*var projectDuration = (new Date(project.estimated_end_date) - new Date(project.start_date))/86400000;
            tasks = findCriticalPath(tasks, links);
            var expectedDurationArray = calculateExpectedDurationArray(tasks);
            var varianceSquaredArray = calculateVarianceArray(tasks);
            var expectedDuration = expectedDurationArray.reduce(function(a,b) { return a + b}, 0);
            var variance = Math.sqrt(varianceSquaredArray.reduce(function(a,b) { return a + b}, 0));
            var z_value = (projectDuration - expectedDuration) / variance;
            $scope.pert = convertZValue(z_value);*/

        });

        createAPNChart = function(tasks, dependencies) {
            /*var graph = new joint.dia.Graph;

            var paper = new joint.dia.Paper({
                el: $('#myholder'),
                width: 1500,
                height: 400,
                model: graph,
                gridSize: 1,
                interactive: true
            });*/

            var graph = new joint.dia.Graph;

            var paper = new joint.dia.Paper({
                el: $('#myholder'),
                width: 3000,
                height: 400,
                model: graph,
                gridSize: 1,
                interactive: true
            });
//////


//////

//  label, duration, dependency, flag

            var edgelist = [];
            tasks.forEach(function (task) {
                edgelist.push([task.task_id, task.likely_duration.days, [], 0, task.comfort_zone.days, "Task " + task.task_number]);
            })
            dependencies.forEach(function (dependency) {
                var index = -1;
                for (var i = 0; i < edgelist.length; i++) {
                    if (edgelist[i][0] === dependency.target)
                        index = i;
                }
                if (index === -1) {
                    console.log('LINK ERROR');
                    return;
                }
                edgelist[index][2].push(dependency.source);
            });
            console.log('edgelist: ', edgelist);



//  label (uniqID), duration, dependency, flag, comfortZone, Name (label)
           /* var edgelist = [['A', 1, 'q', 0, 1, "TestName 1"],
                ['B', 2, 'q', 0, 1, "TestName 2"],
                ['C', 3, 'q', 0, 2, "TestName 3"],
                ['D', 4, 'q', 0, 2, "TestName 4"],
                ['E', 5, 'q', 0, 3, "TestName 5"],
                ['F', 6, 'q', 0, 4, "TestName 6"],
                ['G', 7, 'q', 0, 4, "TestName 7"],
                ['H', 8, 'q', 0, 5, "TestName 8"],
                ['I', 9, 'q', 0, 6, "TestName 9"],
                ['J', 10, 'q', 0, 7, "TestName10"],
                ['K', 11, 'q', 0, 7, "TestName11"]];*/


            //console.log("edgelist is length:",edgelist.length);
            //console.log("edgelist:",edgelist);

            myTree = new Array(0);
            //console.log("Size of myTree: ",myTree.length);
            //console.log("myTree contains: ",myTree);

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
                            if (!inTree(myTree, edgelist[i][2][j])) {
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
                        var myNode = new node(edgelist[i][0], edgelist[i][1], edgelist[i][2], edgelist[i][4], edgelist[i][5]);
                        myTree[treeLevel].push(myNode);
                        //            console.log(edgelist[i][0],"added to myTree");
                        edgelist[i][3] = 2;
                        nodeCount++;
                    }
                }
                treeLevel++;
                if (!changed) {
                    console.log("REKT: Can't continue building tree, check your dependencies");
                    return;//AbortJavaScript();
                }
            }

//console.log("Size of myTree: ",myTree.length);
//console.log("myTree contains: ",myTree);

            var startNode = new node("Start", 0, ' ', -1, "sN"); // Create start node
            startNode.ls = 0;
            for (var i = 0; i < myTree[0].length; i++) { // Link start node to level 0 of myTree
                startNode.fwdLinks.push(myTree[0][i].label);
                //myTree[0][i].es = 0; // Set earliest start for all level 0 nodes to 0
                //myTree[0][i].ef = myTree[0][i].duration;
            }
            var endNode = new node("endNode", 0, ' ', -1, "eN"); // Create end node
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
            for (var i = myTree.length - 1; i >= 0; i--) { // Visits each level in tree starting at max level
                //console.log("i: ",'i');
                for (var j = 0; j < myTree[i].length; j++) { // Visits each node in that level
                    //console.log("Assessing node",myTree[i][j].label);
                    calcLfLs(myTree, myTree[i][j], endNode);
                }
            }

//console.log("startNode:",startNode);
//console.log("  endNode:",endNode);

// Rearrange Nodes (from right to left, move all terminal nodes to the last column)
            for (var i = (myTree.length) - 2; i >= 0; i--) {
                //    console.log("Checking myTree index:",i);
                for (var j = 0; j < myTree[i].length; j++) {
                    if (myTree[i][j].fwdLinks[0] == "endNode") {
                        //            console.log(myTree[i][j].label,"is directly connected to the endNode");
                        var temp = myTree[i][j];
                        myTree[myTree.length - 1].push(temp);
                        myTree[i].splice(j, 1);
                        j--;
                        //            console.log("temp looks a little something like this: ", temp);
                    }
                }
            }

// Display Critical Path, calculate Critical Buffer
//console.log("CRITICAL PATH:");
            var criticalBuffer = 0;
            for (var i = 0; i < myTree.length; i++) {
                for (var j = 0; j < myTree[i].length; j++) {
                    if (myTree[i][j].float == 0) {
                        criticalBuffer += myTree[i][j].cz;
                        //console.log(" ",myTree[i][j].label);
                    }
                }
            }
            criticalBuffer /= 2;
//console.log("Critical Buffer: "+criticalBuffer);


//////

            joint.shapes.basic.myShape = joint.dia.Element.extend({
                markup: '<g class="rotatable"><g class="scalable"><rect class="outer"/><text class="label"/><rect class="es"/><text class="textES"/><rect class="dur"/><text class="textDUR"/><rect class="ls"/><text class="textLS"/><rect class="ef"/><text class="textEF"/><rect class="flt"/><text class="textFLT"/><rect class="lf"/><text class="textLF"/></g></g>',
                defaults: joint.util.deepSupplement({
                    type: "basic",
                    attrs: {
                        ".outer": {
                            stroke: 'black',
                            fill: 'green',
                            'stroke-width': 2,
                            'fill-opacity': 0.5,
                            width: 60,
                            height: 45
                        },
                        ".label": {
                            fill: '#000000',
                            transform: "translate(5, 19)",
                            'font-size': 8
                        },
                        ".es": {
                            transform: "translate(0, 0)",
                            stroke: 'black',
                            'fill-opacity': 0,
                            width: 20,
                            height: 15,
                            fill: "#ff00ff"
                        },
                        ".textES": {
                            fill: '#000000',
                            transform: "translate(5, 4)",
                            'font-size': 8
                        },
                        ".dur": {
                            transform: "translate(20, 0)",
                            stroke: 'black',
                            'fill-opacity': 0,
                            width: 20,
                            height: 15,
                            fill: "#ffff00"
                        },
                        ".textDUR": {
                            fill: '#000000',
                            transform: "translate(23, 4)",
                            'font-size': 8
                        },
                        ".ls": {
                            transform: "translate(40, 0)",
                            stroke: 'black',
                            'fill-opacity': 0,
                            width: 20,
                            height: 15,
                            fill: "#ff8800"
                        },
                        ".textLS": {
                            fill: '#000000',
                            transform: "translate(46, 4)",
                            'font-size': 8
                        },
                        ".ef": {
                            transform: "translate(0, 30)",
                            stroke: 'black',
                            'fill-opacity': 0,
                            width: 20,
                            height: 15,
                            fill: "#33ff33"
                        },
                        ".textEF": {
                            fill: '#000000',
                            transform: "translate(5, 34)",
                            'font-size': 8
                        },
                        ".flt": {
                            transform: "translate(20, 30)",
                            stroke: 'black',
                            'fill-opacity': 0,
                            width: 20,
                            height: 15,
                            fill: "#ff00ff"
                        },
                        ".textFLT": {
                            fill: '#000000',
                            transform: "translate(23, 34)",
                            'font-size': 8
                        },
                        ".lf": {
                            transform: "translate(40, 30)",
                            stroke: 'black',
                            'fill-opacity': 0,
                            width: 20,
                            height: 15,
                            fill: "#ffff00"
                        },
                        ".textLF": {
                            fill: '#000000',
                            transform: "translate(46, 34)",
                            'font-size': 8
                        }
                    }
                }, joint.dia.Element.prototype.defaults)
            });

            var scale = .6; // Scales the size of nodes and their contained text
            var xOffset = 100; // Change these if you want to move offset the entire graph
            var yOffset = 50;

//**
            var critX = myTree.length * (250 * scale) + xOffset;
            var critY = 0;
// Find rightmost node with float = 0
            var critBuffNode = new node("Crit.Buffer", 0, ' ', -1, "C.Buff");
            for (var i = 0; i < myTree[myTree.length - 1].length; i++) {
                if (myTree[myTree.length - 1][i].float == 0) {
                    //console.log("Found the bugger! It's "+myTree[myTree.length-1][i].name);
                    critBuffNode.dependency = myTree[myTree.length - 1][i].label;
                    critBuffNode.fwdLinks[0] = "endNode";
                    myTree[myTree.length - 1][i].fwdLinks[0] = "Crit.Buffer";
                    critY = i * 150 * scale + yOffset;
                    //console.log("yOffset: ",i);
                    //console.log("critY: ",critY);
                }
            }

//console.log("critX: "+critX+", critY: "+critY);
            var critBox = new joint.shapes.basic.Rect({
                position: {x: critX, y: critY},
                size: {width: 150 * scale, height: 100 * scale},
                attrs: {
                    rect: {fill: 'red', 'fill-opacity': 0.5},
                    text: {text: 'Critical\nBuffer: ' + criticalBuffer, fill: 'black'}
                }
            });
            graph.addCells([critBox]);
//**

            for (var i = 0; i < myTree.length; i++) {
                for (var j = 0; j < myTree[i].length; j++) {
                    var tempNode = new joint.shapes.basic.myShape({
                        size: {width: 150 * scale, height: 100 * scale}
                    });
                    tempNode.attr({
                        '.label': {text: myTree[i][j].name},
                        '.textES': {text: myTree[i][j].es},
                        '.textDUR': {text: myTree[i][j].duration},
                        '.textLS': {text: myTree[i][j].ef}, // Swapped ef and ls here to fix display bug
                        '.textEF': {text: myTree[i][j].ls}, // Worst hack ever
                        '.textFLT': {text: myTree[i][j].float},
                        '.textLF': {text: myTree[i][j].lf}
                    });
                    if (myTree[i][j].float == 0) {
                        tempNode.attr({
                            '.outer': {fill: 'red'}
                        });
                    }
                    tempNode.translate((i * 250 * scale) + xOffset, (j * 150 * scale) + yOffset);
                    myTree[i][j].jointID = tempNode.id; // Puts JointJS object ID into myTree for link calc
                    graph.addCells([tempNode]);
                }
            }

            function getJointID(myTree, c) {
                for (var i = 0; i < myTree.length; i++) {
                    for (var j = 0; j < myTree[i].length; j++) {
                        if (myTree[i][j].label == c) {
                            return myTree[i][j].jointID;
                        }
                    }
                }
                console.log("REKT: Can't find id for node" + c);
                return;
                //AbortJavaScript();
            }

// Returns the height (h) of the graph measured in nodes
            function getGraphHeight(myTree) {
                var h = 1;
                for (var i = 0; i < myTree.length; i++) {
                    if (myTree[i].length > h) {
                        h = myTree[i].length;
                    }
                }
                return h;
            }

// Build links
            var mySource;
            var myTarget;
            for (var i = 0; i < myTree.length - 1; i++) { // -1 to avoid linking to endNode (need buffers)
                for (var j = 0; j < myTree[i].length; j++) { // Traverse myTree
                    mySource = myTree[i][j].jointID;
                    for (var k = 0; k < myTree[i][j].fwdLinks.length; k++) { // Iterate through fwdLinks
                        myTarget = getJointID(myTree, myTree[i][j].fwdLinks[k]);
                        var link = new joint.dia.Link({
                            source: {id: mySource},
                            target: {id: myTarget},
                        });
                        link.attr({
                            '.marker-target': {fill: 'black', d: 'M 6 0 L 0 3 L 6 6 z'}
                        });
                        graph.addCells([link]);
                    }
                }
            }

            var terminalY = (getGraphHeight(myTree) * 150 * scale + yOffset) / 2;
            var startCircle = new joint.shapes.basic.Circle({
                position: {x: 10, y: terminalY},
                size: {width: 20, height: 20},
                attrs: {text: {text: 'start', 'font-size': 7}, circle: {fill: '#999999'}}
            });
            graph.addCell(startCircle);
            mySource = startCircle.id;
            for (var i = 0; i < startNode.fwdLinks.length; i++) {
                myTarget = getJointID(myTree, startNode.fwdLinks[i]);
                var link = new joint.dia.Link({
                    source: {id: mySource},
                    target: {id: myTarget}
                });
                link.attr({
                    '.marker-target': {fill: 'black', d: 'M 6 0 L 0 3 L 6 6 z'},
                });
                graph.addCells([link]);
            }

            var endCircle = new joint.shapes.basic.Circle({
                position: {x: ((myTree.length + 1) * 250 * scale) + xOffset, y: terminalY},
                size: {width: 20, height: 20},
                attrs: {text: {text: 'end', 'font-size': 7}, circle: {fill: '#999999'}}
            });
            graph.addCell(endCircle);
            myTarget = endCircle.id;
            for (var i = 0; i < endNode.dependency.length; i++) {
                mySource = getJointID(myTree, endNode.dependency[i]);
                var link = new joint.dia.Link({
                    source: {id: mySource},
                    target: {id: myTarget}
                })
                link.attr({
                    '.marker-target': {fill: 'black', d: 'M 6 0 L 0 3 L 6 6 z'},
                });
                graph.addCells([link]);
            }

//////

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

            function node(label, duration, dependency, comfortZone, name) {
                this.label = label;
                this.cz = comfortZone;
                this.name = name;
                this.duration = duration;
                this.dependency = dependency;
                this.fwdLinks = new Array(0);
                this.es = -1; // Earliest Start
                this.ls = -1; // Latest Start
                this.ef = -1; // Earliest Finish
                this.lf = -1; // Latest Finish
                this.float = -1;
                this.jointID = -1;
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
                //AbortJavaScript();
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
                return;//AbortJavaScript();
            }
        }


    }
]);