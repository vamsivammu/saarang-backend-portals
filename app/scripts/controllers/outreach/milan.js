'use strict';

/**
 * @ngdoc function
 * @name erpSaarangFrontendApp.controller:OutreachMilanCtrl
 * @description
 * # OutreachMilanCtrl
 * Controller of the erpSaarangFrontendApp
 */
angular.module('erpSaarangFrontendApp')
.config(function ($stateProvider) {
    $stateProvider
      .state('outreach.milan', {
        url: '/milan',
        templateUrl: 'views/outreach/milan.html',
        controller: 'OutreachMilanCtrl',
        authenticate: true
     });
  })
  .controller('OutreachMilanCtrl',['$scope','$http','Upload','cloudinary','$localStorage','$state', function ($scope, $http, $upload, cloudinary, $localStorage, $state) {

    // table - cities
    //cloudinary url - https://api.cloudinary.com/v1_1/saarang2017/upload
    // upload_preset - "city_images"     
  
    $scope.uploadFiles = function(file){     

      if (!file) alert("Please Upload the file");

        if (file && !file.$error && Object.keys($scope.data).length == 4) { 
          $scope.status = true;
            
          file.upload = $upload.upload({
            url: "https://api.cloudinary.com/v1_1/saarang2017/upload",
            data: {
              upload_preset: "city_images",
              tags: 'city_images',
              context: 'photo=' + $scope.data.name,
              file: file
            }
          }).progress(function (e) {
            file.progress = Math.round((e.loaded * 100.0) / e.total);
            $scope.progress = file.progress + "%";
          }).success(function (data, status, headers, config) {        
            $scope.data.image_link  = data.url;
            
            var img = {
                 "type":"insert",    
                 "args": {
                    "table":"cities",
                    "objects": [{                      
                      "image_link":$scope.data.image_link,
                      "name": $scope.data.name,
                      "description": $scope.data.description,                      
                      "milan_date": $scope.data.milan_date,
                      "milan_time": $scope.data.milan_time
                                          
                  }]
                }
            }
          
           $http.post('https://data.saarang.org/v1/query',img)
            .then(function(response){
              alert('Successfully uploaded details');   
              $state.reload();
             })
            .catch(function(err){
              console.log(err);
             });

          }); //end of success
        }
        
        else {
          alert('Please fill the details');
          $state.reload();
        } 
      };
  }]);
