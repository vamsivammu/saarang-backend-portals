'use strict';

angular.module('erpSaarangFrontendApp')
  .controller('NavbarCtrl', ['$rootScope', '$scope','$state','$localStorage','$http', function ($rootScope, $scope, $state,$localStorage,$http) {

    $scope.logout = function() {
    	$http({
        method:'POST',
        url:'https://auth.saarang.org/v1/user/logout',
        headers:{
                  'Authorization' :"Bearer " + $localStorage.auth_token
              }
        }).then(function(res){
    		  $localStorage.$reset();
      		$rootScope.loggedIn = false;
      		$state.go('login');
        })
        .catch(function(err){console.log(err)});
    };
         
}]);
   


