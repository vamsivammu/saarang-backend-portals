'use strict';

/**
 * @ngdoc function
 * @name erpSaarangFrontendApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the erpSaarangFrontendApp
 */
angular.module('erpSaarangFrontendApp')
.config(function ($stateProvider) {
    $stateProvider
      .state('profile', {
        url: '/profile',
        templateUrl: 'views/profile.html',
        controller: 'ProfileCtrl',
      });
  })
  .controller('ProfileCtrl',['$scope','$http','$localStorage', function ($scope,$http,$localStorage) {
    //fetching team members

      $http({
        method:'POST',
        url:'https://data.saarang.org/v1/query',
        data:{
                "type":"select",
                "args":{
                        "table":"member",
                        "columns":["*", {"name":"department","columns":["*"]}],
                        "where":{"department_id": $localStorage.member.department.id}
                      }
              },
        headers:{
                  'Authorization' :"Bearer "+$localStorage.auth_token
              }
        }).then(function(res){
          $scope.team_members = res.data;
      }).catch(function(err){
        console.log(err.data);
        alert("error occurred please try again");
      });



// YOU CAN USE THIS FUNCTION TO FIX ANY MASS ISSUE WITH USER TABELE
  // $scope.execute = function(){
  //     $http({
  //       method:'POST',
  //       url:'https://data.saarang.org/v1/query',
  //       data:{
  //               "type":"select",
  //               "args":{
  //                       "table":"member",
  //                       "columns":["id"]
  //             }
  //         }
  //       }).then(function(res){
  //         $scope.hasura_ids = res.data
  //         console.log($scope.hasura_ids)
  //         $scope.members = []
  //         var count = 0; 
  //         for(var i=0;i<$scope.hasura_ids.length;i++){
  //           $http({
  //             method:'GET',
  //             url:"https://auth.saarang.org/admin/user/"+$scope.hasura_ids[i].id,
  //             headers:{
  //                 'Authorization' :"Bearer s45l9fe343bxqz1gyettvg07r85aha7x"
  //             }
  //           }).then(function(res){
  //             $scope.members.push(res.data);
  //             count++;
  //             if(count == $scope.hasura_ids.length){
  //               console.log($scope.members)
  //                 for(var x =0;x<$scope.members.length;x++){
  //                     $http({
  //                       method:'POST',
  //                       url:'https://data.saarang.org/v1/query',
  //                       data:{
  //                               "type":"update",
  //                               "args":{
  //                                       "table":"member",
  //                                       "$set":
  //                                       {
  //                                         "email":$scope.members[x].email
  //                                       },
  //                                       "where":{"id":$scope.members[x].id}
  //                                     }
  //                             },
  //                       headers:{
  //                                 'Authorization' :"Bearer "+$localStorage.auth_token
  //                             }
  //                       }).then(function(res){
  //                         console.log(res.data)
  //                     }).catch(function(err){});
  //                 }
  //             }
  //           })      
  //         }
  //     }).catch(function(err){
  //       console.log(err.data)
  //     });
  // }




}]);
