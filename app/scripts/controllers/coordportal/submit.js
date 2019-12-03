'use strict';

/**
 * @ngdoc function
 * @name erpSaarangFrontendApp.controller:CoordportalSubmitCtrl
 * @description
 * # CoordportalSubmitCtrl
 * Controller of the erpSaarangFrontendApp
 */
angular.module('erpSaarangFrontendApp')
.config(function ($stateProvider) {
    $stateProvider
      .state('coordPortal.submit', {
        url: '/submit',
        templateUrl: 'views/coordportal/submit.html',
        controller: 'CoordportalSubmitCtrl'
      });
  })
  .controller('CoordportalSubmitCtrl',['$scope','$http','Upload','cloudinary', function ($scope,$http,$upload,cloudinary) {
    //fetch departments
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

    $scope.proceed = function(res){
        if(res){
             $scope.verify = true;
          }  
      };
                                    
    $scope.uploadFiles = function(file){     

      if (!file) alert("Please Upload the file");

        if (file && !file.$error && Object.keys($scope.data).length == 5) { 
          $scope.verify = false;
          $scope.status = true;
            
          file.upload = $upload.upload({
            url: "https://api.cloudinary.com/v1_1/saarang2017/upload",
            data: {
              upload_preset: "submitted_apps",
              tags: 'applicants-data',
              context: 'application=' + $scope.data.name,
              file: file
            }
          }).progress(function (e) {
            file.progress = Math.round((e.loaded * 100.0) / e.total);
            $scope.progress = file.progress + "%";
          }).success(function (data, status, headers, config) {
            $scope.status = false;
            $scope.validating = true;
            $scope.data.url  = data.url;

            var d = new Date();

            var app_info = {
                 "type":"insert",
                 "args": {
                    "table": "applicants",
                    "objects": [{
                      "name": $scope.data.name,
                      "roll_number": $scope.data.roll_number,
                      "department": $scope.data.department,
                      "email" : $scope.data.email,
                      "app_link":$scope.data.url,
                      "position": $scope.data.position,
                      "uploaded_at": d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear() + " - " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds()
                      
                    }]
                }
            }
            
            $http.post('https://data.saarang.org/v1/query', app_info).then(function(response){
                alert('Successfully uploaded the Application! Good luck for your interviews ;)');
                location.reload();
                $scope.data = false;
                location.reload();
             }).catch(function(err){
                console.log(err);
            });
         });
       }

        else {
          alert('Please fill the details');
        } 
      };
    
  }]);
