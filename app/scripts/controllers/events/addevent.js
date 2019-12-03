'use strict';

/**
 * @ngdoc function
 * @name erpSaarangFrontendApp.controller:EventsAddeventCtrl
 * @description
 * # EventsAddeventCtrl
 * Controller of the erpSaarangFrontendApp
 */
angular.module('erpSaarangFrontendApp')
 .config(function ($stateProvider) {
    $stateProvider
      .state('events.addevent', {
        url: '/addevent',
        templateUrl: 'views/events/addevent.html',
        controller: 'AddeventCtrl',
        authenticate: true
      })
      .state('events.editevent',{
        url:'/editevent/:name',
        templateUrl: 'views/events/addevent.html',
        controller: 'AddeventCtrl',
        authenticate: true
      });
  })
 .controller('AddeventCtrl',['$scope', '$mdDialog','$rootScope', '$location','$http', '$window', '$stateParams','Upload','cloudinary','$localStorage', function ($scope, $mdDialog,$rootScope, $location, $http, $window, $stateParams,$upload,cloudinary,$localStorage) {
      $scope.uploader = 'https://res.cloudinary.com/gallerysaarang/image/upload/v1544514415/default_jmaotw.jpg';
      $scope.uploadInprogress = false;
      $scope.uploadSuccess = false;
      $scope.uploadFailed = false;

      //Image upload Cloudinary
      $scope.uploadFiles = function(file, errFiles) {
      var d = new Date();
      $scope.title = "Image (" + d.getDate() + " - " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + ")";
      $scope.errFile = errFiles && errFiles[0];
      if (file) {
          file.upload = $upload.upload({
          url: "https://api.cloudinary.com/v1_1/saarang2017/upload",
          data: {
            upload_preset: 'saarang',
            tags: 'events_album',
            context: 'photo=' + $scope.title,
            file: file
          }
        }).progress(function (e) {
          console.log('progress')
          $scope.uploadInprogress = true;
          $scope.uploadFailed = false;
          $scope.uploadSuccess = false;
          file.progress = Math.round((e.loaded * 100.0) / e.total);
          file.status = "Uploading... " + file.progress + "%";
          $scope.progress = file.progress;
        }).success(function (data, status, headers, config) {
          console.log('success')
          $scope.uploadFailed = false;
          $scope.uploadInprogress = false;
          $scope.uploadComplete = true;
          data.context = {custom: {photo: $scope.title}};
          file.result = data;
          $scope.uploader = file.result.url;
          console.log($scope.uploader);
          console.log(data)
        }).error(function (data, status, headers, config) {
          console.log('failed')
          $scope.uploadComplete = false;
          $scope.uploadInprogress = false;
          $scope.uploadFailed = true;
          console.log(data)
          file.result = data;
        });
      }   
    }
    // 

    
    //Fetching the registration types
    $scope.registration_types = [];
    $http.post("https://data.saarang.org/v1/query",
    {
      "type":"select",
      "args":{
              "table":"enum_registration_type",
              "columns":["name"]
            }
    }).then(function (res) {
      console.log(res)
      $scope.registration_types = res.data;
    }).catch(function (err) {
      console.log(err.data);
    })
    // 
    
    $scope.event_c.subIndex = 0;
    $scope.eventData = {};
    $scope.eventData.registration_starts = new Date();
    $scope.eventData.registration_ends = new Date();
    $scope.ind=-1;
    $scope.title = true;
    $scope.filtersubcategories = function(cat_id){
      $scope.filtered_subcategories = []
      for(var i=0;i<$scope.subcategories.length;i++){
        if(cat_id==$scope.subcategories[i].category_id){
          $scope.filtered_subcategories.push($scope.subcategories[i])
        }
      }
    }
    if($stateParams.name!== undefined){
        $scope.event_c.subtab = true;
        $scope.ind = 1
        $scope.title = false;
        // console.log($stateParams.name);
        $scope.eventData = $rootScope.edit_event;
        if($scope.eventData == undefined){
            $scope.eventData = {};
            $location.path('/events');
        }else{
          $scope.filtersubcategories($scope.eventData.category_id)
        }
        
        $scope.eventData.registration_starts = new Date($scope.eventData.registration_starts);
        $scope.eventData.registration_ends = new Date($scope.eventData.registration_ends);
        $scope.uploader = $scope.eventData.event_image_url;
        if($scope.uploader !== undefined){
          $scope.uploadComplete = true; 
        }
        // console.log($scope.uploader);
    }
    $scope.categories = $rootScope.categories;
    $scope.subcategories = $rootScope.subcategories;
    /*get categories*/
    if($scope.categories == undefined){
      $http({
        method:'POST',
        url:'https://data.saarang.org/v1/query',
        data:{
                "type":"select",
                "args":{
                        "table":"event_category",
                        "columns":["*"]
                      }
              },
        headers:{
                  'Authorization' :"Bearer "+$localStorage.auth_token,
                  'X-Hasura-Role' : "core"
               }
        }).then(function(res){
        $rootScope.categories = res.data;
        $scope.categories = $rootScope.categories;
      }).catch(function(err){
        console.log(err);
      });
      
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
        $rootScope.subcategories = res.data;
        $scope.subcategories = $rootScope.subcategories;
        $scope.filtered_subcategories = $scope.subcategories
       
      }).catch(function(err){
        console.log(err);
      });
      
    }

    $scope.cancel = function(){
        $scope.eventData = {};
        $scope.ind = -1;
        $scope.event_c.subtab = false;
    }

    $scope.onSubmit = function(){
      $scope.eventData.registration_starts = new Date($scope.eventData.registration_starts);
      $scope.eventData.registration_ends = new Date($scope.eventData.registration_ends);
      if(!$scope.eventData.is_team_event){
        $scope.eventData.team_min_size = 0;
        $scope.eventData.team_max_size = 0;
      }
        if($scope.ind == -1){
          $http({
            method:'POST',
            url:'https://data.saarang.org/v1/query',
            data:{
                    "type":"insert",
                    "args":{
                            "table":"event",
                            "returning": ["id"],
                            "objects":[
                            {
                              "name":$scope.eventData.name,
                              "category_id":parseInt($scope.eventData.category_id),
                              "sub_category_id":parseInt($scope.eventData.sub_category_id),
                              "registration_type":$scope.eventData.registration_type,
                              "registration_starts":$scope.eventData.registration_starts,
                              "registration_ends":$scope.eventData.registration_ends,
                              "is_team_event":$scope.eventData.is_team_event,
                              "team_min_size":$scope.eventData.team_min_size,
                              "team_max_size":$scope.eventData.team_max_size,
                              "contact_email":$scope.eventData.contact_email,
                              "contact":$scope.eventData.contact,
                              "short_description":$scope.eventData.short_description,
                              "long_description":$scope.eventData.long_description,
                              "event_image_url": $scope.uploader,
                              "is_extra":$scope.eventData.is_extra,
                              "extra_details":$scope.eventData.extra_details
                            }
                            ]
                          }
                  },
            headers:{
                      'Authorization' :"Bearer "+$localStorage.auth_token,
                      'X-Hasura-Role' : "core"
                   }
            }).then(function(res){
              // console.log("insertion successful");
              $scope.cancel();
              $window.alert("event added");
              $window.location.reload();
          }).catch(function(err){
            console.log(err.data);
            $window.alert("error occurred please try again");
            // console.log($localStorage.auth_token);
          });
        }
        
        else{
          $scope.eventData.registration_starts = new Date($scope.eventData.registration_starts);
          $scope.eventData.registration_ends = new Date($scope.eventData.registration_ends);
          console.log($scope.eventData)
          $http({
            method:'POST',
            url:'https://data.saarang.org/v1/query',
            data:{
                    "type":"update",
                    "args":{
                            "table":"event",
                            "$set":
                            {
                              "name":$scope.eventData.name,
                              "category_id":parseInt($scope.eventData.category_id),
                              "sub_category_id":parseInt($scope.eventData.sub_category_id),
                              "registration_type":$scope.eventData.registration_type,
                              "registration_starts":$scope.eventData.registration_starts,
                              "registration_ends":$scope.eventData.registration_ends,
                              "is_team_event":$scope.eventData.is_team_event,
                              "team_min_size":$scope.eventData.team_min_size,
                              "team_max_size":$scope.eventData.team_max_size,
                              "contact_email":$scope.eventData.contact_email,
                              "contact":$scope.eventData.contact,
                              "short_description":$scope.eventData.short_description,
                              "long_description":$scope.eventData.long_description,
                              "event_image_url": $scope.uploader,
                              "is_extra":$scope.eventData.is_extra,
                              "extra_details":$scope.eventData.extra_details
                            },
                            "where":{"id":$scope.eventData.id}
                          }
                  },
            headers:{
                      'Authorization' :"Bearer "+ $localStorage.auth_token,
                      'X-Hasura-Role' : "core"
                   }
            }).then(function(res){
              $scope.cancel();
              $window.alert("event updated");
              $window.location.reload();
          }).catch(function(err){
            console.log(err.data);
            $window.alert("error occurred please try again");
            console.log($localStorage.auth_token);
          });
        }
        $scope.eventData = {};
        $scope.eventData.startDate = new Date();
        $scope.eventData.endDate = new Date();
        $scope.index = -1;
    }
  }]);
