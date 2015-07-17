/**
 * Created by scottmackenzie on 8/07/15.
 */

myApp.controller("GanttChartCtrl", ['$scope', '$stateParams', 'PMDashboard',
    function($scope, $stateParams, PMDashboard) {
        $scope.project = $stateParams.projectName;

        $scope.options = {
            mode: 'custom',
            scale: 'day',
            sortMode: undefined,
            sideMode: 'TreeTable',
            daily: true,
            maxHeight: false,
            width: false,
            zoom: 5,
            columns: ['model.name', 'from', 'to'],
            treeTableColumns: ['from', 'to'],
            columnsHeaders: {'model.name': 'Name', 'from': 'From', 'to': 'To'},
            columnsClasses: {'model.name': 'gantt-column-name', 'from': 'gantt-column-from', 'to': 'gantt-column-to'},
            columnsFormatters: {
                'from': function (from) {
                    return from !== undefined ? from.format('lll') : undefined;
                },
                'to': function (to) {
                    return to !== undefined ? to.format('lll') : undefined;
                }
            },
            treeHeaderContent: '<i class="fa fa-align-justify"></i> {{getHeader()}}',
            columnsHeaderContents: {
                'model.name': '<i class="fa fa-align-justify"></i> {{getHeader()}}',
                'from': '<i class="fa fa-calendar"></i> {{getHeader()}}',
                'to': '<i class="fa fa-calendar"></i> {{getHeader()}}'
            },
            autoExpand: 'both',
            taskOutOfRange: 'truncate',
            fromDate: moment(null),
            toDate: undefined,
            rowContent: '<i class="fa fa-align-justify"></i> {{row.model.name}}',
            taskContent: '<i class="fa fa-tasks"></i> {{task.model.name}}',
            allowSideResizing: true,
            labelsEnabled: true,
            currentDate: 'line',
            currentDateValue: new Date(2013, 9, 23, 11, 20, 0),
            draw: true,
            readOnly: false,
            groupDisplayMode: 'group',
            filterTask: '',
            filterRow: ''
        }
        $scope.data = [];
        $scope.taskData = PMDashboard.getProjectTasks();
        console.log($scope.taskData);

        for (var i = 0; i < $scope.taskData.length; i++){
            $scope.row = {
                name: '',
                tasks: []
            };
            $scope.task = {
                name: "",
                from: "",
                to: "",
                progress: ""
            };
            $scope.row.name = $scope.taskData[i].taskName;
            console.log($scope.row.name);
            $scope.task.name = $scope.row.name;
            $scope.task.from = new Date($scope.taskData[i].startDate);
            $scope.task.to = new Date($scope.task.from);
            $scope.task.to.setDate($scope.task.from.getDate()+$scope.taskData[i].likelyDuration.days);
            $scope.task.progress = $scope.taskData[i].progressPercentage;
            $scope.row.tasks.push($scope.task);
            $scope.data.push($scope.row);
        }
        console.log($scope.data);
}
]);

/*
 {
 name: "...", // Name shown on the left side of each row.
 id: "...",  // Unique id of the row (Optional).
 height: "..." // Height of the row (Optional).
 color: "..." , // Color of the task in HEX format (Optional).
 classes: <Array|String> // Array or String of class names which should be applied to the task. See ng-class documentation for details (Optional).
 content: "...", // Content used in labels (Optional).
 tasks: [] // Array containing <Task> tasks to add in this row.
 }
*/

/*
 {
 name: "...", // Name shown on top of each task.
 from: <Date>, // Date can be a String, Timestamp, Date object or moment object.
 to: <Date>, // Date can be a String, Timestamp, Date object or moment object.
 id: "...",  // Unique id of the task (Optional).
 color: "..." , // Color of the task in HEX format (Optional).
 classes: <Array|String> // Array or String of class names which should be applied to the task. See ng-class documentation for details (Optional).
 priority: <Number> // Defines which of an overlapping task is on top (Optional). Tip: Leave property away for default behaviour.
 data: <Any> // Custom object. Use this to attach your own data (Optional).
 content: "...", // Content used in labels (Optional).
 }
 */


/*
 $scope.data = [{name: 'Milestones', height: '3em', sortable: false, classes: 'gantt-row-milestone', color: '#45607D', tasks: [
 // Dates can be specified as string, timestamp or javascript date object. The data attribute can be used to attach a custom object
 {name: 'Kickoff', color: '#93C47D', from: '2013-10-07T09:00:00', to: '2013-10-07T10:00:00', data: 'Can contain any custom data or object'},
 {name: 'Concept approval', color: '#93C47D', from: new Date(2013, 9, 18, 18, 0, 0), to: new Date(2013, 9, 18, 18, 0, 0), est: new Date(2013, 9, 16, 7, 0, 0), lct: new Date(2013, 9, 19, 0, 0, 0)},
 {name: 'Development finished', color: '#93C47D', from: new Date(2013, 10, 15, 18, 0, 0), to: new Date(2013, 10, 15, 18, 0, 0)},
 {name: 'Shop is running', color: '#93C47D', from: new Date(2013, 10, 22, 12, 0, 0), to: new Date(2013, 10, 22, 12, 0, 0)},
 {name: 'Go-live', color: '#93C47D', from: new Date(2013, 10, 29, 16, 0, 0), to: new Date(2013, 10, 29, 16, 0, 0)}
 ], data: 'Can contain any custom data or object'},
 {name: 'Status meetings', tasks: [
 {name: 'Demo #1', color: '#9FC5F8', from: new Date(2013, 9, 25, 15, 0, 0), to: new Date(2013, 9, 25, 18, 30, 0)},
 {name: 'Demo #2', color: '#9FC5F8', from: new Date(2013, 10, 1, 15, 0, 0), to: new Date(2013, 10, 1, 18, 0, 0)},
 {name: 'Demo #3', color: '#9FC5F8', from: new Date(2013, 10, 8, 15, 0, 0), to: new Date(2013, 10, 8, 18, 0, 0)},
 {name: 'Demo #4', color: '#9FC5F8', from: new Date(2013, 10, 15, 15, 0, 0), to: new Date(2013, 10, 15, 18, 0, 0)},
 {name: 'Demo #5', color: '#9FC5F8', from: new Date(2013, 10, 24, 9, 0, 0), to: new Date(2013, 10, 24, 10, 0, 0)}
 ]},
 {name: 'Kickoff', movable: {allowResizing: false}, tasks: [
 {name: 'Day 1', color: '#9FC5F8', from: new Date(2013, 9, 7, 9, 0, 0), to: new Date(2013, 9, 7, 17, 0, 0),
 progress: {percent: 100, color: '#3C8CF8'}, movable: false},
 {name: 'Day 2', color: '#9FC5F8', from: new Date(2013, 9, 8, 9, 0, 0), to: new Date(2013, 9, 8, 17, 0, 0),
 progress: {percent: 100, color: '#3C8CF8'}},
 {name: 'Day 3', color: '#9FC5F8', from: new Date(2013, 9, 9, 8, 30, 0), to: new Date(2013, 9, 9, 12, 0, 0),
 progress: {percent: 100, color: '#3C8CF8'}}
 ]},
 {name: 'Create concept', tasks: [
 {name: 'Create concept', content: '<i class="fa fa-cog" ng-click="scope.handleTaskIconClick(task.model)"></i> {{task.model.name}}', color: '#F1C232', from: new Date(2013, 9, 10, 8, 0, 0), to: new Date(2013, 9, 16, 18, 0, 0), est: new Date(2013, 9, 8, 8, 0, 0), lct: new Date(2013, 9, 18, 20, 0, 0),
 progress: 100}
 ]},
 {name: 'Finalize concept', tasks: [
 {name: 'Finalize concept', color: '#F1C232', from: new Date(2013, 9, 17, 8, 0, 0), to: new Date(2013, 9, 18, 18, 0, 0),
 progress: 100}
 ]},
 {name: 'Development', children: ['Sprint 1', 'Sprint 2', 'Sprint 3', 'Sprint 4'], content: '<i class="fa fa-file-code-o" ng-click="scope.handleRowIconClick(row.model)"></i> {{row.model.name}}'},
 {name: 'Sprint 1', tooltips: false, tasks: [
 {name: 'Product list view', color: '#F1C232', from: new Date(2013, 9, 21, 8, 0, 0), to: new Date(2013, 9, 25, 15, 0, 0),
 progress: 25}
 ]},
 {name: 'Sprint 2', tasks: [
 {name: 'Order basket', color: '#F1C232', from: new Date(2013, 9, 28, 8, 0, 0), to: new Date(2013, 10, 1, 15, 0, 0)}
 ]},
 {name: 'Sprint 3', tasks: [
 {name: 'Checkout', color: '#F1C232', from: new Date(2013, 10, 4, 8, 0, 0), to: new Date(2013, 10, 8, 15, 0, 0)}
 ]},
 {name: 'Sprint 4', tasks: [
 {name: 'Login & Signup & Admin Views', color: '#F1C232', from: new Date(2013, 10, 11, 8, 0, 0), to: new Date(2013, 10, 15, 15, 0, 0)}
 ]},
 {name: 'Hosting'},
 {name: 'Setup', tasks: [
 {name: 'HW', color: '#F1C232', from: new Date(2013, 10, 18, 8, 0, 0), to: new Date(2013, 10, 18, 12, 0, 0)}
 ]},
 {name: 'Config', tasks: [
 {name: 'SW / DNS/ Backups', color: '#F1C232', from: new Date(2013, 10, 18, 12, 0, 0), to: new Date(2013, 10, 21, 18, 0, 0)}
 ]},
 {name: 'Server', parent: 'Hosting', children: ['Setup', 'Config']},
 {name: 'Deployment', parent: 'Hosting', tasks: [
 {name: 'Depl. & Final testing', color: '#F1C232', from: new Date(2013, 10, 21, 8, 0, 0), to: new Date(2013, 10, 22, 12, 0, 0), 'classes': 'gantt-task-deployment'}
 ]},
 {name: 'Workshop', tasks: [
 {name: 'On-side education', color: '#F1C232', from: new Date(2013, 10, 24, 9, 0, 0), to: new Date(2013, 10, 25, 15, 0, 0)}
 ]},
 {name: 'Content', tasks: [
 {name: 'Supervise content creation', color: '#F1C232', from: new Date(2013, 10, 26, 9, 0, 0), to: new Date(2013, 10, 29, 16, 0, 0)}
 ]},
 {name: 'Documentation', tasks: [
 {name: 'Technical/User documentation', color: '#F1C232', from: new Date(2013, 10, 26, 8, 0, 0), to: new Date(2013, 10, 28, 18, 0, 0)}
 ]}];
*/
