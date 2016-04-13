var mp4Services = angular.module('mp4Services', []);

mp4Services.factory('CommonData', function($http, $window){
    //shared data among controllers

    var baseUrl = $window.sessionStorage.baseurl;
    return{
        getUsers : function(){
            return $http.get(baseUrl + '/api/users?select={"name":1, "_id": 1, "email":1}');
        },
        getTasks : function(){
            return $http.get(baseUrl + '/api/tasks?select={"name":1, "_id": 1, "assignedUserName":1}');    
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
            $http.post(baseUrl + '/api/users', newUser)
                .success(function(data){
                    console.log('Successfully added user');
                })
                .error(function(err) {
                    console.log('Error: ' + err);
                });
        },
        deleteUser : function(id){
            $http.delete(baseUrl + '/api/users/' + id)
                .success(function(data) {
                    //$scope.todos = data;
                    console.log("data: " + data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
        },
        addTask : function(newTask) {  
            $http.post(baseUrl + '/api/tasks', newTask)
                .success(function(data){
                    console.log('Successfully added task');
                })
                .error(function(err) {
                    console.log('Error: ' + err);
                });
        },
        deleteTask : function(id){
            $http.delete(baseUrl + '/api/tasks/' + id)
                .success(function(data) {
                    //$scope.todos = data;
                    console.log("Deleted task" + data);
                    console.log("Data's keys = " + Object.keys(data));
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
        },                
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