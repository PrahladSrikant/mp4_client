var mp4Services = angular.module('mp4Services', []);

mp4Services.factory('CommonData', function($http, $window){
    //shared data among controllers

    var baseUrl = $window.sessionStorage.baseurl;
    return{
        getUsers : function(){
            return $http.get(baseUrl + '/api/users?select={"name":1, "_id": 1, "email":1}');
        },
        getTasks : function(sortBy, ascend, filter){
            var where = ""; //for all
            if (filter === "completed")
                where = '&where={"completed": true}';
            else if (filter === "pending")
                where = '&where={"completed": false}';
            var itemstoget = '/api/tasks?select={"name":1, "_id": 1, "assignedUserName":1, "assignedUser":1, "deadline":1, "completed":1}';
            var sort = '&sort={"' + sortBy + '": ' + ascend + '}';
            return $http.get(baseUrl + itemstoget + sort + where);    
        }, 
        getTaskNames : function(){
            return $http.get(baseUrl + '/api/tasks?select={"name":1, "_id": 1, "deadline":1, "completed":1}');    
        },         
        getUserDetail: function(id) {
            var where = '/api/users?where={\"_id\": \"';
            var end = '\"}';
            var retval = $http.get(baseUrl + where + id.toString() + end);
            return retval;
        },
        getTaskDetail: function(id) {
            var where = '/api/tasks?where={\"_id\": \"';
            var end = '\"}';
            var retval = $http.get(baseUrl + where + id.toString() + end);
            return retval;
        },        
        addUser : function(newUser) {  
            return $http.post(baseUrl + '/api/users', newUser);
        },
        deleteUser : function(id){
            return $http.delete(baseUrl + '/api/users/' + id);
        },
        addTask : function(newTask) {  
            return $http.post(baseUrl + '/api/tasks', newTask);
        },
        deleteTask : function(id){
            return $http.delete(baseUrl + '/api/tasks/' + id);
        },
        getUserTasks: function(id) {    //get one user to modify their pendingTasks array
            var where = '/api/users?where={\"_id\": \"';
            var end = '\"}';
            //var pendingTasks = '&select={"_id":1, "pendingTasks":1}';
            var pendingTasks = '';
            var retval = $http.get(baseUrl + where + id.toString() + end + pendingTasks);
            return retval;
        },        
        putUser : function(userID, user){
            return $http.put(baseUrl + '/api/users/' + userID, user);  //modify a user
        },
        putTask: function(taskID, task) { 
            return $http.put(baseUrl + '/api/tasks/' + taskID, task)    //modify a task
        },
        getAllTasksOfUser: function(userID) {    //get all the tasks objects that are assigned to a user
            var where = '/api/tasks?where={\"assignedUser\": \"';
            var end = '\"}';
            var retval = $http.get(baseUrl + where + userID.toString() + end);
            return retval;
        },
        getPendingTasks: function(userID){
            //where={"assignedUser": userID, "completed": false}
            var where = '/api/tasks?where={"assignedUser": "' + userID + '","completed":false}';
            var retval = $http.get(baseUrl + where);
            return retval;
        },
        getCompletedTasks: function(userID){
            //where={"assignedUser": userID, "completed": false}
            var where = '/api/tasks?where={"assignedUser": "' + userID + '","completed":true}';
            var retval = $http.get(baseUrl + where);
            return retval;
        }        
    };
});

mp4Services.factory('AddUser', function(){
    var data = "";
    return{
        getData : function(){
            return data;
        },
        setData : function(newData){
            data = newData;
        }
    }
});

mp4Services.factory('AddTask', function(){
    var data = "";
    return{
        getData : function(){
            return data;
        },
        setData : function(newData){
            data = newData;
        }
    }
});