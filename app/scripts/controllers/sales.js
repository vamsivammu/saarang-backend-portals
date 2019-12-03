'use strict';

/**
 * @ngdoc function
 * @name erpSaarangFrontendApp.controller:OutreachCtrl
 * @description
 * # SalesCtrl
 * Controller of the erpSaarangFrontendApp
 */
angular.module('erpSaarangFrontendApp')
.config(function ($stateProvider,$urlRouterProvider) {
  
    $stateProvider
      .state('sales', {
        url: '/sales',
        templateUrl: 'views/sales.html',
        controller: 'SalesCtrl',
        authenticate: true,
        department: "Marketing and Sales"
    });
  })
  .controller('SalesCtrl',['$scope', '$http', '$localStorage' ,function ($scope,$http,$localStorage) {

    $scope.sortReverse = false;
    
  $http({
      method:'POST',
      url:'https://data.saarang.org/v1/query',
      data:{
              "type":"select",
              "args":{
                      "table":"sales",
                      "columns":["*"]
                    }
            },
      headers:{
                'Authorization' :"Bearer " + $localStorage.auth_token
             }
      }).then(function(res){
      $scope.sales = res.data;
      $scope.choreo_chair = 0;
      $scope.choreo_gal= 0;
      $scope.rock_fan = 0;
      $scope.rock_gal = 0;
      $scope.rock_bowl = 0;
      $scope.pop_plat = 0;
      $scope.pop_silv = 0;
      $scope.pop_gal = 0;
      $scope.EDM_fan = 0;
      $scope.EDM_gal = 0;
      $scope.EDM_bowl = 0;
      $scope.polo_S = 0;
      $scope.polo_M = 0;
      $scope.polo_L = 0;
      $scope.polo_XL = 0;
      var i=0;
      while($scope.sales[i]){

        if($scope.sales[i].category=="Choreo Night"){
          if($scope.sales[i].sub_category=="Chair")
                        $scope.choreo_chair = $scope.choreo_chair + $scope.sales[i].total;
          else if($scope.sales[i].sub_category=="Gallery")
                        $scope.choreo_gal = $scope.choreo_gal + $scope.sales[i].total;
        }  
        
        else if($scope.sales[i].category=="Rock Night"){
          if($scope.sales[i].sub_category=="Gallery")
                $scope.rock_gal += $scope.sales[i].total;
          else if($scope.sales[i].sub_category=="Bowl")
                $scope.rock_bowl += $scope.sales[i].total;          
          else if($scope.sales[i].sub_category=="Fan Pass")
                $scope.rock_fan += $scope.sales[i].total;
         }

        else if($scope.sales[i].category=="EDM Night"){
          if($scope.sales[i].sub_category=="Gallery")
                $scope.EDM_gal += $scope.sales[i].total;
          else if($scope.sales[i].sub_category=="Bowl")
                $scope.EDM_bowl += $scope.sales[i].total;
          else if($scope.sales[i].sub_category=="Fan Pass")
                $scope.EDM_fan += $scope.sales[i].total;
        }

        else if($scope.sales[i].category=="Polo"){
          if($scope.sales[i].sub_category=="S")
                $scope.polo_S += $scope.sales[i].total;
          else if($scope.sales[i].sub_category=="M")
                $scope.polo_M += $scope.sales[i].total;
          else if($scope.sales[i].sub_category=="L")
            $scope.polo_L += $scope.sales[i].total;
          else if($scope.sales[i].sub_category=="XL")
            $scope.polo_XL += $scope.sales[i].total;
        }
        
       else if($scope.sales[i].category=="Popular Night"){
          if($scope.sales[i].sub_category=="Gallery")
                $scope.pop_gal += $scope.sales[i].total;
          else if($scope.sales[i].sub_category=="Platinum Chair")
              $scope.pop_plat += $scope.sales[i].total;
          else if($scope.sales[i].sub_category=="Silver Chair")
            $scope.pop_silv += $scope.sales[i].total;
        }

        i++;
      }
    }).catch(function(err){
      console.log(err.data);
  });

   
}]);
