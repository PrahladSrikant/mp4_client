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

  $scope.displayText = "";
  $scope.isDisabled = {}; //for disabling delete button

  CommonData.getUsers().success(function(data){
      $scope.users = data.data; //data returns message+data, data.data just returns data component
      //console.log($scope.users);

      $scope.deleteUser = function (userID){

        $scope.isDisabled[userID] = true; //disable this button

        // get all tasks that are assigned to this user 
        CommonData.getAllTasksOfUser(userID).success(function(data) {

            //array of tasks to unassign
            tasksToUnassign = data.data; 

            //unassign each task
            for(var i=0; i<tasksToUnassign.length; i++){
              console.log("task to unassign:" + tasksToUnassign[i].name);
              //reset assignedUser/Name
              tasksToUnassign[i].assignedUser = "";
              tasksToUnassign[i].assignedUserName = "unassigned";

              //update task in database 
              CommonData.putTask(tasksToUnassign[i]._id, tasksToUnassign[i]).success(function(data) {
                console.log('Task unassigned');
              })
              .error(function(err) {
                $scope.displayText = 'Error: ' + err.message;
              }) 
            }

            CommonData.deleteUser(userID).success(function(data) {
              console.log('User deleted');
            })
            .error(function(err) {
              $scope.displayText = 'Error: ' + err.message;
            })

          })
        .error(function(err) {
          $scope.displayText = 'Error: ' + err.message;
        })       

      };

    })
    .error(function(err){ //error getting users
      console.log(err);
      $scope.displayText = 'Error: ' + err.message;
    })


  }]);

//Task List
mp4Controllers.controller('TaskListController', ['$scope', '$http', 'CommonData', '$window' , function($scope, $http, CommonData, $window) {

  var startidx = 0;
  var endidx = 10;
  $scope.displayText = "";
  $scope.disablePrev = true;
  $scope.disableNext = true;

  $scope.isDisabled = {}; //for disabling delete button

  $scope.orderOptions = [ 
  { optionId: "dateCreated", optionName: "Date Created" }, 
  { optionId: "deadline", optionName: "Deadline" },
  { optionId: "name", optionName: "Task Name" },
  { optionId: "assignedUserName", optionName: "User Name" }
  ];
  $scope.selectedOrder = "dateCreated";
  $scope.sortAscending = 1;  //set default
  $scope.filter = "pending";  //set default

  $scope.changeSort = function(){

    CommonData.getTasks($scope.selectedOrder, $scope.sortAscending, $scope.filter).success(function(data){
      var allTasks = data.data; //data returns message+data, data.data just returns data component w/o message
      $scope.tasks = allTasks.slice(startidx, endidx);
      var numTasks = allTasks.length;
      if (numTasks < 10)
        $scope.disableNext = true;
      else
        $scope.disableNext = false;
      console.log("numTasks = " + numTasks);

      $scope.nextClick = function(){
        startidx += 10; 
        endidx += 10;
        $scope.tasks = allTasks.slice( Math.min(startidx, numTasks), Math.min(endidx, numTasks) ); //dont run past end of array

        if (endidx >= numTasks){
          $scope.disableNext = true;
          startidx = Math.max(0, endidx-10);
        }
        if (startidx > 0){
          $scope.disablePrev = false;
        }
      };

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
      };

      $scope.deleteTask = function (task){

        $scope.isDisabled[task._id] = true; //disable delete button for this task

        console.log("task = " + task);
        console.log("assignedUserName = " + task.assignedUserName);
        console.log("completed? = " + task.completed);

        if (task.assignedUser !== "" && task.completed === false){  //remove pending task from user
          //get user's tasks
          CommonData.getUserTasks(task.assignedUser).success(function(user) {
              //modify user's tasks
              console.log('Tasks before: ' + user.pendingTasks);
              user.pendingTasks.splice(indexOf(task._id), 1);
              console.log('Tasks after: ' + modifiedTasks);

              //put user's modified tasks
              CommonData.putUser(user._id, user).success(function(data) {
                console.log('Removed task from user');
              })
              .error(function(err) {
                console.log('Error: ' + err.message);
              })

            })
            .error(function(err) {  //error getting user
              console.log('Error: ' + err.message);
            });
          }

        CommonData.deleteTask(task._id).success(function(data) { //deleted task from task list
          console.log('Task deleted');
          console.log('data returned = ' + data);
        })
          .error(function(err) {  //error deleting task
            console.log('Error: ' + err.message);
          })
        };

      })
    .error(function(err){ //error getting tasks
      $scope.displayText = "Error :" + err.message;
    });

  };

  $scope.changeSort();

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

      if ($scope.newUser.email){  //dont try if the email isnt okay
        CommonData.addUser($scope.newUser).success(function(data){
          $scope.displayText = 'User added';
        })
        .error(function(err) {
          $scope.displayText = 'Error: ' + err.message;
        });
      }
      
    };


  }]);

//Add Task
mp4Controllers.controller('AddTaskController', ['$scope', '$http', 'CommonData', '$window' , function($scope, $http, CommonData, $window){
  //Task inputs:
  $scope.newTask = { name: "", deadline: "", description: "", assignedUserName: "unassigned", assignedUser: ""};

  $scope.selectedUser = "";
  $scope.displayText = "";

  // dropdown menu to select assignment:
  CommonData.getUsers().success(function(data){
      $scope.users = data.data; //data returns message+data, data.data just returns data component
    })
  .error(function(err){
    console.log(err);
    $scope.displayText = 'Error: ' + err.message;
  });  

  $scope.addTask = function(newTask){
    console.log("userid = " + $scope.selectedUser._id);

    if ($scope.newTask.name !== "" && $scope.newTask.deadline ){  //dont let someone submit without a task name or deadline

      if ( $scope.selectedUser !== ""){ //if user has been selected, get the person's name & add to their pending tasks array
        $scope.newTask.assignedUserName = $scope.selectedUser.name;
        $scope.newTask.assignedUser = $scope.selectedUser._id;
    }

    CommonData.addTask($scope.newTask).success(function(data){
      $scope.displayText = "Task added";
      task = data.data;
      console.log("task = " + Object.keys(task));

      //add to user's pending tasks array
      if ( task.assignedUser !== "" ){
        CommonData.getUserDetail(task.assignedUser).success(function(data){
            user = data.data[0];
            user.pendingTasks.push(task._id);
            console.log("got user details");

            CommonData.putUser(user._id, user).success(function(data){
              console.log("Task added to user " + user.name);
            })
            .error(function(data){
              console.log("Error: " + err);
            })
          })
          .error(function(err){
            console.log('Error: ' + err);
          })
      }
    })
    .error(function(err) {
      $scope.displayText = 'Error: ' + err;
    });

  }

  console.log("name = " + $scope.newTask.name);
  console.log("assignedto = " + $scope.newTask.assignedUserName);

};

}]);


//User Detail view
mp4Controllers.controller('UserDetailController', ['$scope', 'CommonData', '$routeParams', function($scope, CommonData, $routeParams) {

  $scope.loaded = false;
  $scope.dataNotLoaded = true;
  $scope.displayText = "";
  $scope.user = "";
  $scope.pendingTasks = {};

 CommonData.getUserDetail($routeParams._id).success(function(data){
    $scope.user = data.data[0]; //data returns message+data, data.data just returns data component w/o message
    $scope.pendingTasks = $scope.user.pendingTasks;
    $scope.dataNotLoaded = false;

    $scope.loadCompletedTasks = function(){

      //get request to get completed tasks
      //CommonData.getCompletedTasks(userID).success(function(data){
        $scope.loaded = true;
        // do some more stuff
      //})
    }


      })
 .error(function(err){
  console.log(err);
  $scope.displayText = 'Error: ' + err.message;
});


 //************ ADD CODE TO GET NAMES & INFO OF PENDING TASKS AND A BUTTON TO SHOW COMPLETED TASKS ************



}]);

//Task Detail view
mp4Controllers.controller('TaskDetailController', ['$scope', 'CommonData', '$routeParams', function($scope, CommonData, $routeParams) {

  $scope.task = {};
  $scope.displayText = "";
  $scope.disableEdit = true;

  CommonData.getTaskDetail($routeParams._id).success(function(data){
    console.log(data.data[0]);
        $scope.task = data.data[0]; //data returns message+data, data.data just returns data component w/o message  
        $scope.disableEdit = false; //if something is loaded, allow user to edit it

        $scope.completeTask = function(bool){

            if (bool==true){  //task is completed
              $scope.task.completed = true;
            }
            else { // task is pending
              $scope.task.completed = false;
            }

            // Add/remove from user's pending tasks if it's been assigned to someone
            if ($scope.task.assignedUser !== ""){ 

              //Get the pending tasks array of the user this task is assigned to
              CommonData.getUserDetail($scope.task.assignedUser).success(function(data){
                user = data.data[0];
                if ($scope.task.completed === true){  //remove from user's pending tasks array
                  var index = user.pendingTasks.indexOf($scope.task._id);
                  user.pendingTasks.splice(index, 1); 
                  console.log("Task removed from user " + user.name);
                }
                else {  //add to user's pending tasks array
                  var index = user.pendingTasks.indexOf($scope.task._id);
                  if (index === -1){
                    user.pendingTasks.push($scope.task._id);
                    console.log("Task added to user " + user.name);
                  }
                }

                //Now need to put the changes to user's pendingTasks array in database
                CommonData.putUser(user._id, user).success(function(data) {
                  //console.log('Task changed in user\'s pendingTasks in database');
                })
                .error(function(err) {
                  $scope.displayText = 'Error: ' + err;
                  console.log('Error: ' + err.message);
                })                   

              })
                .error(function(err) {
                  console.log('Error: ' + err);
                  $scope.displayText = 'Error: ' + err.message;
                });
            } // End of if statement for assigned tasks only

            // All tasks need to have their completion changed based upon toggle
            CommonData.putTask($scope.task._id, $scope.task).success(function(data){
              console.log("Task completion changed")
            })
            .error(function(err) {
              $scope.displayText = 'Error: ' + err.message;
            });
          };
        })
.error(function(err){
  console.log(err);
  $scope.displayText = 'Error: ' + err.message;
});


}]);

//Edit Task
mp4Controllers.controller('EditTaskController', ['$scope', 'CommonData', '$window', '$routeParams' , function($scope, CommonData, $window, $routeParams){

  $scope.displayText = "";
  //Task inputs:
  $scope.task = { name: "", deadline: "", description: "", assignedUserName: "unassigned"};

  //fill in with previous task details
  CommonData.getTaskDetail($routeParams._id).success(function(data){  
      $scope.task = data.data[0]; //data returns message+data, data.data just returns data component
      $scope.task.deadline = new Date($scope.task.deadline);  // formatting/error prevention
      //console.log("task.assignedUserName = " + $scope.task.assignedUserName);
      //$scope.selectedUser = { name: $scope.task.assignedUserName, _id: $scope.task.assignedUser };  //set default


      // dropdown menu to select assignment:
      CommonData.getUsers().success(function(data){
          $scope.users = data.data; //data returns message+data, data.data just returns data component
          $scope.selectedUser = $scope.users.filter(function (user) { return user._id === $scope.task.assignedUser; })[0];
          console.log("orig selectedUser = " + $scope.selectedUser);
        })
      .error(function(err){
        console.log(err);
        $scope.displayText = 'Error: ' + err.message;
      }); 


    })
  .error(function(err){
    console.log(err);
    $scope.displayText = 'Error: ' + err.message;
  });  

  $scope.editTask = function(){

    $scope.displayText = "";

    console.log("selectedUser = " + $scope.selectedUser._id);

    if ($scope.task.name !== "" && $scope.task.deadline ){  //dont let someone submit without a task name or deadline

      if ( $scope.selectedUser.name === ""){ //if no user has been selected
        $scope.task.assignedUserName = "unassigned";
        $scope.task.assignedUser = "";
      }

      else {
        $scope.task.assignedUser = $scope.selectedUser._id;
        $scope.task.assignedUserName = $scope.selectedUser.name;
      }

      console.log("assigned user: " + $scope.task.assignedUserName);

      CommonData.putTask($scope.task._id, $scope.task).success(function(data){
        console.log("Task edited")
        $scope.displayText = "Task edited";
      })
      .error(function(err) {
        $scope.displayText = 'Error: ' + err.message;
      });


    }
    
    //console.log("name = " + $scope.newTask.name);
    //console.log("assignedto = " + $scope.newTask.assignedUserName);

  };
  

}]);