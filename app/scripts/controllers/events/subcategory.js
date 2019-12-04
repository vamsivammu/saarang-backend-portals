'use strict';

/**
 * @ngdoc function
 * @name erpSaarangFrontendApp.controller:EventsCategoryCtrl
 * @description
 * # EventsCategoryCtrl
 * Controller of the erpSaarangFrontendApp
 */
angular.module('erpSaarangFrontendApp')
 .config(function ($stateProvider) {
    $stateProvider
      .state('events.subcategory', {
        url: '/subcategory',
        templateUrl: 'views/events/subcategory.html',
        controller: 'SubCategoryCtrl',
        authenticate: true
      });
  })
 .controller('SubCategoryCtrl',['$rootScope','$scope','$http','$window','$localStorage', function ($rootScope,$scope,$http,$window,$localStorage) {
  	$scope.subcategory={};
    $scope.event_c.subtab = false;
  	$scope.event_c.tabIndex = 2;
    $scope.sortType = 'name';       /*table variables*/
    $scope.sortReverse = false;
    $scope.searchTag = '';
  	$scope.subcategories = $rootScope.subcategories;
  	$scope.edit = false;
    $scope.ind = -1;
    $scope.categories = $rootScope.categories
    console.log($scope.categories)
  	$scope.add = function(){
  		$scope.edit = true;
  	}
  	$scope.cancel = function(){
  		$scope.edit = false;
      $scope.ind = -1;
  		$scope.category = {};
  	}
    $scope.edit_category = function(cat){
      $scope.edit = true;
      $scope.ind = 1;
      console.log($scope.ind);
      $scope.category = cat;
    }
    if($scope.subcategories == undefined){
      $http({
        method:'POST',
        url:'https://data.saarang.org/v1/query',
        data:{
                "type":"select",
                "args":{
                        "table":"event_subcategory",
                        "columns":["*"]
                      }
              },
        headers:{
                  'Authorization' :"Bearer "+$localStorage.auth_token,
                  'X-Hasura-Role' : "core"
               }
        }).then(function(res){
          res = res.data;
        $rootScope.subcategories = res;
        $scope.subcategories = $rootScope.subcategories;
      }).catch(function(err){
        console.log(err.data);
        // console.log($localStorage.auth_token);
      });
    }
    /*add, edit and submit codes*/
    $scope.onSubmit = function(){
      if($scope.ind == -1){
        $http({
          method:'POST',
          url:'https://data.saarang.org/v1/query',
          data:{
                  "type":"insert",
                  "args":{
                          "table":"event_subcategory",
                          "returning": ["id"],
                          "objects":[
                            {"name":$scope.subcategory.name,"info":$scope.subcategory.info,"category_id":$scope.subcategory.category_id}
                          ]
                        }
                },
          headers:{
                    'Authorization' :"Bearer "+$localStorage.auth_token,
                    'X-Hasura-Role' : "core"
                 }
          }).then(function(res){
            // console.log("insertion successful");
            $window.location.reload();
        }).catch(function(err){
          console.log(err.data);
          // console.log($localStorage.auth_token);
        });
        $scope.cancel();
      };
      if($scope.ind == 1){
        $http({
          method:'POST',
          url:'https://data.saarang.org/v1/query',
          data:{
            "type":"update",
            "args":{
                "table":"event_subcategory",
                "$set":{"name":$scope.subcategory.name,"info":$scope.subcategory.info},
                "where":{id:$scope.subcategory.id}
                }
              },
          headers:{
              'Authorization' :"Bearer "+$localStorage.auth_token,
              'X-Hasura-Role' : "core"
          }
          }).then(function(res){
            console.log("update successful");
            $window.location.reload();
          }).catch(function(err){
            console.log(err.data);
            // console.log($localStorage.auth_token);
          });
           $scope.cancel();
      }
    };
    
    $scope.delete = function(cat){
      if (confirm("Are you sure u want to delete "+cat.name) == true) {
        $http({
          method:'POST',
          url:'https://data.saarang.org/v1/query',
          data:{
                  "type":"delete",
                  "args":{
                          "table":"event_category",
                          "where":{
                            "id" : cat.id
                          }
                        }
                },
          headers:{
                    'Authorization' :"Bearer "+$localStorage.auth_token,
                    'X-Hasura-Role' : "core"
                 }
          }).then(function(res){
            // console.log("success");
            $window.location.reload();
        }).catch(function(err){
          console.log(err.data);
          // console.log($localStorage.auth_token);
        });
      }
    };
  }]);