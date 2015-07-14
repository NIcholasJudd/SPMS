/**
 * Created by scottmackenzie on 8/07/15.
 */

myApp.controller("GanttChartCtrl", ['$scope', '$stateParams',
    function($scope, $stateParams) {
        $scope.project = $stateParams.projectName;
        $scope.data = [{name: 'Milestones', height: '3em', sortable: false, classes: 'gantt-row-milestone', color: '#45607D', tasks: [
            // Dates can be specified as string, timestamp or javascript date object. The data attribute can be used to attach a custom object
            {name: 'Kickoff', color: '#93C47D', from: '2013-10-07T09:00:00', to: '2013-10-07T10:00:00', data: 'Can contain any custom data or object'},
            {name: 'Concept approval', color: '#93C47D', from: new Date(2013, 9, 18, 18, 0, 0), to: new Date(2013, 9, 18, 18, 0, 0), est: new Date(2013, 9, 16, 7, 0, 0), lct: new Date(2013, 9, 19, 0, 0, 0)},
            {name: 'Development finished', color: '#93C47D', from: new Date(2013, 10, 15, 18, 0, 0), to: new Date(2013, 10, 15, 18, 0, 0)},
            {name: 'Shop is running', color: '#93C47D', from: new Date(2013, 10, 22, 12, 0, 0), to: new Date(2013, 10, 22, 12, 0, 0)},
            {name: 'Go-live', color: '#93C47D', from: new Date(2013, 10, 29, 16, 0, 0), to: new Date(2013, 10, 29, 16, 0, 0)}
        ]}]
}
]);