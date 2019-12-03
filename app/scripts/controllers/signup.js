'use strict';

angular.module('erpSaarangFrontendApp')
.config(function ($stateProvider) {
    $stateProvider
      .state('signup', {
        url: '/signup',
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl'
      });
  })
  .controller('SignupCtrl',['$scope','$window','$http','$localStorage','$rootScope','$state',function ($scope, $window, $http, $localStorage, $rootScope,$state) {
    $scope.user={};
    $scope.catchs = {};

    //Fetching all the departments
    $http({
      method:'POST',
      url:'https://data.saarang.org/v1/query',
      data:{
              "type":"select",
              "args":{
                      "table":"department",
                      "columns":["*"]
                    }
            }
      }).then(function(res){
        $scope.departments = res.data;
    }).catch(function(err){
      console.log(err.data);
    });

    // Fetching all the roles
    $http({
      method:'POST',
      url:'https://data.saarang.org/v1/query',
      data:{
              "type":"select",
              "args":{
                      "table":"enum_role",
                      "columns":["*"]
                    }
            }
      }).then(function(res){
        console.log(res)
        $scope.roles = res.data;
    }).catch(function(err){
      console.log(err.data);
    });

    // Register Function
    $scope.register = function(form) {
      $scope.submitted = true;
      
      const data = {
        "provider": "username",
        "data": {
          'username':$scope.user.email,
          'password':$scope.user.password              
        }      
    }
    console.log(data)
      if(form.$valid){
        $http.post(
          'https://auth.saarang.org/v1/signup',data          
          ).then(function(res) {
             console.log("signup then");
             console.log(res)


            //Populate the member table with new user
            $http({
              method:'POST',
              url:'https://data.saarang.org/v1/query',
              data:{
                      "type":"insert",
                      "args":{
                              "table":"member",
                              "objects":[
                                {
                                  "id":res.data.hasura_id,
                                  "name":$scope.user.username,
                                  "email": $scope.user.email,
                                  "role":$scope.user.role,
                                  "department_id":Number($scope.user.department_id),
                                  "mobile":$scope.user.phone
                                }
                              ]
                            }
                    }
              }).then(function(res){
                console.log("member added");
                console.log(res);
              }).catch(function(err){
                alert(err.data.message);
            });
            alert("Your account will be activated soon");
            $state.go('login');
          }).catch(function(err) {
            alert(err.data.message);
            $state.reload();
          });
      }

      else{
        alert('Please enter valid details');
      }

    };
}]);
