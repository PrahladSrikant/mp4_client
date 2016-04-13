var app = angular.module('mp4', ['ngRoute', 'mp4Controllers', 'mp4Services']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/settings', {
    templateUrl: 'partials/settings.html',
    controller: 'SettingsController'
  }).  
    when('/users', {
    templateUrl: 'partials/users.html',
    controller: 'UserListController'
  }).
  when('/tasks', {
    templateUrl: 'partials/tasks.html',
    controller: 'TaskListController'
  }).
  when('/user/:_id', {
    templateUrl: 'partials/userdetail.html',
    controller: 'UserDetailController'
  }).
  when('/task/:_id', {
    templateUrl: 'partials/taskdetail.html',
    controller: 'TaskDetailController'
  }).
  when('/adduser', {
    templateUrl: 'partials/adduser.html',
    controller: 'AddUserController'
  }).
  when('/addtask', {
    templateUrl: 'partials/addtask.html',
    controller: 'AddTaskController'
  }).  
  when('/edittask', {
    templateUrl: 'partials/edittask.html',
    controller: 'EditTaskController'
  }).  
  otherwise({
    redirectTo: '/settings'
  });
}]);