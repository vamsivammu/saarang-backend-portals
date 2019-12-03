'use strict';

angular.module('erpSaarangFrontendApp')
.config(function ($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      }); 
  })

  .controller('LoginCtrl',['$window','$rootScope', '$http', '$scope', '$location','$localStorage','$state',function ($window, $rootScope, $http, $scope, $location,$localStorage,$state) {
    $scope.user = {};
    $scope.errors = {};
    
    // Restricting access to login page for loggedIn user
    if ($localStorage.auth_token) {
      console.log("Redirecting to home as yor are already loggedIn");
      $location.path('/');
    }

    $scope.login = function(form){
      if(form.$valid){

        $http.post('https://auth.saarang.org/v1/login',
        {
          "provider": "username",
          "data": {
              "username": $scope.user.email,
              "password": $scope.user.password
          }
        }).then(function(res_login){
          console.log(res_login)
          res_login = res_login.data;
          $localStorage.auth_token = res_login.auth_token;
          // Restricting the portal for cores and coord
          for (var i=0;i<res_login.hasura_roles.length;i++) {
            if (res_login.hasura_roles[i] === "admin" || res_login.hasura_roles[i] ===  "core" ||res_login.hasura_roles[i]=== "coord") {
              // Fetching all the data of the member
                var data =  
                  {
                  "type":"select",
                  "args": {
                    "table":"member",
                    "columns": [
                    "*",
                      {"name": "department", "columns": ["*"]}
                    ],
                    "where": {"id": res_login.hasura_id} 
                    }
                  };
                  var config = {
                    headers:{
                      "Authorization" : "Bearer " + $localStorage.auth_token
                    }
                  };  
                $http.post('https://data.saarang.org/v1/query',data,config).then(function (res_member) {
                  res_member = res_member.data;
                  $localStorage.member = {};
                  $localStorage._id = res_login.hasura_id;
                  $localStorage.auth_token = res_login.auth_token;
                  $localStorage.member.username = res_member[0].name;
                  $localStorage.member.role = res_member[0].role;
                  $localStorage.member.department = res_member[0].department;
                  $localStorage.member.mobile = res_member[0].mobile;
                  $rootScope.loggedIn = true;
                  $location.path('/');
                }).catch(function (err) {console.log(err.data);});
              // Department end
            }

            else if( i === res_login.hasura_roles.length-1){
              $http({
                method:'GET',
                url:'https://auth.saarang.org/user/v1/logout',
                headers:{
                  'Authorization' :"Bearer " + $localStorage.auth_token
                }
                }).then(function(res){
                    alert("Your account hasn't been activated yet");
                    $localStorage.$reset();
                    $state.reload();
              }).catch(function(err){console.log(err)});
              alert("Your account hasn't been activated yet");
              $localStorage.$reset();
              $state.reload();
            }
          }
          // Restricting end
        }).catch(function(err){
          alert(err.data.message);
          $state.reload();
        });
        // Login request end
      }

     else{
      alert("Please enter valid credentials");
     } 
      // From end
    };
    // Login function end
  }]);
