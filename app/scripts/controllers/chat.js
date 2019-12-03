'use strict';

angular.module('erpSaarangFrontendApp')
 	
 	.factory('MessageService', ['$rootScope', '$pubnubChannel', 'currentUser', '$localStorage',
	    function MessageServiceFactory($rootScope, $pubnubChannel, currentUser, $localStorage) {
	        var Channel = $pubnubChannel.$extend({
	            sendMessage: function(messageContent) {
	                return this.$publish({
	                    uuid: (Date.now() + currentUser),
	                    username : $localStorage.member.username,
	                    content: messageContent,
	                    sender_uuid: currentUser,
	                    date: Date.now()
	                })
	            }
	        });

	        var chatChannel = "Saarang-2018-" + $localStorage.member.department.name;
	        console.log("You are chatting in the group : " + chatChannel);
	  	       
	        return Channel(chatChannel, {
	            autoload: 20,
	            presence: true
	        });
	    }
	])

 	.controller('CheckChatCtrl', function($scope, $localStorage){

 		$scope.checkChat = function(){
	 		if($localStorage.auth_token && $localStorage.member)
	 			return true;
	 		else
	 			return false;
	 	}
 	})

 	.value('currentUser', _.random(1000000).toString())

 	.run(['Pubnub', 'currentUser', '$localStorage', function(Pubnub, currentUser, $localStorage) {
	  Pubnub.init({
	    publish_key: 'pub-c-7ca14afc-fed3-41de-9b1f-79541a71778b',
	    subscribe_key: 'sub-c-9ffb040e-5b90-11e7-9668-0619f8945a4f',
	    uuid: currentUser
	  });
	}])

 	

 	.directive("repeatComplete", function( $rootScope ) {
		var uuid = 0;
		function compile( tElement, tAttributes ) {
			var id = ++uuid;
			tElement.attr( "repeat-complete-id", id );
			tElement.removeAttr( "repeat-complete" );
			var completeExpression = tAttributes.repeatComplete;
			var parent = tElement.parent();
			var parentScope = ( parent.scope() || $rootScope );
			var unbindWatcher = parentScope.$watch(
				function() {

					var lastItem = parent.children( "*[ repeat-complete-id = '" + id + "' ]:last" );
					if ( ! lastItem.length ) {
						return;
					}
					var itemScope = lastItem.scope();
					if ( itemScope.$last ) {
						
						itemScope.$eval( completeExpression );
					}
				}
			);
		}
		return({
			compile: compile,
			priority: 1001,
			restrict: "A"
		});
	})

	.directive('messageForm', function() {
	    return {
	        restrict: "E",
	        replace: true,
	        templateUrl: 'views/chat/message-form.html',
	        scope: {},
	        controller: function($scope, $localStorage, currentUser, MessageService) {
	            $scope.uuid = currentUser;
	            $scope.messageContent = '';
	            
	            $scope.sendMessage = function() {
	                MessageService.sendMessage($scope.messageContent);
	                $scope.messageContent = '';
	            }
	        }
	    };
	})

	.directive('messageItem', function(MessageService) {
	    return {
	        restrict: "E",
	        templateUrl: 'views/chat/message-item.html',
	        scope: {
	        	senderUuid: "@",
	            content: "@",
	            date: "@",
	            username: "@"
	        }
	    }
	})

	.directive('messageList', function($timeout, $anchorScroll, MessageService, ngNotify, $localStorage) {
	    return {
	        restrict: "E",
	        replace: true,
	        templateUrl: 'views/chat/message-list.html',
	        link: function(scope, element, attrs, ctrl) {
	            var element = angular.element(element);

	            var hasScrollReachedBottom = function() {
				    return element.scrollTop() + element.innerHeight() >= element.prop('scrollHeight')
				};
				var watchScroll = function() {

					if (hasScrollReachedTop()) {
				        if (MessageService.$allLoaded()) {
				        	ngNotify.addType('alldone', 'all-done');
				            ngNotify.set('All the messages have been loaded', 'alldone');
				        } 
				        else {
				            fetchPreviousMessages();
				        }
				    }
				   	scope.autoScrollDown = hasScrollReachedBottom();
				};
	            var init = function() {
	            	element.bind("scroll", _.throttle(watchScroll, 250));
	            };
	            var hasScrollReachedTop = function() {
				    return element.scrollTop() === 0;
				};
				var fetchPreviousMessages = function(){
					ngNotify.addType('previous', 'previous-notify');
				  	ngNotify.set('Loading previous messages...','previous');
				  	var currentMessage = scope.messages[0].uuid.toString();
				  	scope.messages.$load(10).then(function(m){
  				   		_.defer( function(){ $anchorScroll(currentMessage) });
				  	});
				};

	            init();
	        },
	        controller: function($scope, $localStorage) {
	            $scope.messages = MessageService;
	            $scope.autoScrollDown = true;
	            
	            $scope.scrollToBottom = function() {
			        var uuid_last_message = _.last($scope.messages).uuid;
			        $anchorScroll(uuid_last_message);
			    };

			    $scope.listDidRender = function(){
			       	if($scope.autoScrollDown)
          				$scope.scrollToBottom();
			    };

			    $scope.checkUser = function(username){
			    	if (!$localStorage.auth_token) return;
			    	if($localStorage.member.username === username)
			    		return true;
			    	else{
			    		return false;
			    	}
			    }
	        }
	    };
	})

	.controller('ChatCtrl', function($scope, $localStorage){

		$scope.expand = function(){
			$(".message-container").css("display","block");
			$(".chat-bring").css("display","none");
		}
		$scope.closeChat = function(){
			$(".message-container").css("display","none");
			$(".chat-bring").css("display","block");
		}
	});
