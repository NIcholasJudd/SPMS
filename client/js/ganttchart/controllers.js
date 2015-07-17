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
                movable: {allowResizing: false},
                tasks: []
            };
            $scope.task = {
                name: "",
                from: "",
                to: "",
                progress: "",
                movable: false
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