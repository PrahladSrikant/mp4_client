var mp4Controllers = angular.module('mp4Controllers', []);

//Settings
mp4Controllers.controller('SettingsController', ['$scope' , '$window' , function($scope, $window) {

  $scope.url = $window.sessionStorage.baseurl;

  $scope.setUrl = function(){
    $window.sessionStorage.baseurl = $scope.url;
    $scope.displayText = "URL set";
  };

}]);

//User List
mp4Controllers.controller('UserListController', ['$scope', '$http', 'CommonData', '$window' , function($scope, $http, CommonData, $window) {

  $scope.isDisabled = {}; //for disabling delete button

  CommonData.getUsers()
    .success(function(data){
      $scope.users = data.data; //data returns message+data, data.data just returns data component
      //console.log($scope.users);
    })
    .error(function(err){
          console.log(err);
          $scope.displayError = err;
      });

    $scope.toDelete = "";
    $scope.deleteUser = function (userID){
      CommonData.deleteUser(userID);
      $scope.isDisabled[userID] = true; //disable this button
    }

}]);

//Task List
mp4Controllers.controller('TaskListController', ['$scope', '$http', 'CommonData', '$window' , function($scope, $http, CommonData, $window) {

  var startidx = 0;
  var endidx = 10;
  $scope.disablePrev = true;
  $scope.disableNext = false;

  CommonData.getTasks().success(function(data){

    var allTasks = data.data; //data returns message+data, data.data just returns data component w/o message
    $scope.tasks = allTasks.slice(startidx, endidx);
    var numTasks = allTasks.length;
    if (numTasks < 10)
      $scope.disableNext = true;
    console.log("numTasks = " + numTasks);

    $scope.nextClick = function(){
      startidx += 10; 
      endidx += 10;
      $scope.tasks = allTasks.slice( Math.min(startidx, numTasks), Math.min(endidx, numTasks) ); //dont run past end of array
        console.log("startidx = " + startidx);
        console.log("endidx =" + endidx);
      if (endidx >= numTasks){
        $scope.disableNext = true;
        //endidx = numTasks-1;
        startidx = Math.max(0, endidx-10);
      }
      if (startidx > 0){
        $scope.disablePrev = false;
      }
    }

    $scope.prevClick = function(){
      startidx -= 10; 
      endidx -= 10;
      //$scope.tasks = allTasks.slice( Math.max(startidx, 0), Math.max(endidx, 0));
      
      if (startidx <= 0){
        $scope.disablePrev = true;
        startidx = 0;
        endidx = Math.min(startidx+10, numTasks-1);
      }
      if (endidx < numTasks-1){
        $scope.disableNext = false;
      }

      $scope.tasks = allTasks.slice(startidx, endidx);

      console.log("startidx = " + startidx);
      console.log("endidx = " + endidx);
    }

    //console.log($scope.tasks);
  })
  .error(function(err){
        console.log(err);
        $scope.displayError = err;
    });

}]);

//Add User
mp4Controllers.controller('AddUserController', ['$scope', 'CommonData', function($scope, CommonData) {
  //$scope.name = "";
  //$scope.email = "";
  $scope.displayText = "";

  $scope.newUser = { name: "", email: "" };

  $scope.addUser = function (){

      console.log("name = " + $scope.newUser.name);
      console.log("email = " + $scope.newUser.email);

      if ($scope.newUser.email){
        console.log("gonna try to add a user");
        var returned = CommonData.addUser($scope.newUser);
        console.log(returned);
      }
      
  };


}]);

//Add Task
mp4Controllers.controller('AddTaskController', ['$scope', '$http', 'CommonData', '$window' , function($scope, $http, CommonData, $window){
  //Task inputs:
  $scope.newTask = { name: "", deadline: "", description: "", assignedUserName: "unassigned"};

  $scope.selectedUser = "";
  $scope.displayText = "";

  // dropdown menu to select assignment:
  CommonData.getUsers().success(function(data){
      $scope.users = data.data; //data returns message+data, data.data just returns data component
    })
    .error(function(err){
          console.log(err);
          $scope.displayError = err;
    });  

  $scope.addTask = function(newTask){
    console.log("userid = " + $scope.selectedUser._id);

    if ($scope.newTask.name !== "" && $scope.newTask.deadline ){  //dont let someone submit without a task name or deadline

      if ( $scope.selectedUser !== ""){ //if user has been selected, get the person's name
        $scope.newTask.assignedUserName = $scope.selectedUser.name;

      }

      CommonData.addTask($scope.newTask);
      $scope.displayText = "Task added";

    }
    
    console.log("name = " + $scope.newTask.name);
    console.log("assignedto = " + $scope.newTask.assignedUserName);

  };

}]);


//User Detail
mp4Controllers.controller('UserDetailController', ['$scope', 'CommonData', '$routeParams', function($scope, CommonData, $routeParams) {

  $scope.user = "";
  $scope.pendingTasks = {};

  CommonData.getUserDetail($routeParams._id)
    .success(function(data){

        $scope.user = data.data[0]; //data returns message+data, data.data just returns data component w/o message
        $scope.pendingTasks = $scope.user.pendingTasks;
      })
    .error(function(err){
          console.log(err);
          $scope.displayError = err;
      });

}]);

//Task Detail
mp4Controllers.controller('TaskDetailController', ['$scope', 'CommonData', '$routeParams', function($scope, CommonData, $routeParams) {

  $scope.task = "";

  CommonData.getTaskDetail($routeParams._id)
    .success(function(data){
        $scope.task = data.data[0]; //data returns message+data, data.data just returns data component w/o message
        //$scope.pendingTasks = $scope.user.pendingTasks;
      })
    .error(function(err){
          console.log(err);
          $scope.displayError = err;
      });

}]);