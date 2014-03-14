angular.module('soundMoods.controllers', [])
	.controller('AppCtrl', ['$scope', '$routeParams', '$location', 'Facebook', 'syncData', 'User', AppCtrl])
	.controller('LoginCtrl', ['$scope', '$rootScope', LoginCtrl])
	.controller('MoodCtrl', ['$scope', '$rootScope', '$location','Mood', MoodCtrl])
	.controller('ApiCtrl', ['$scope', '$rootScope', '$location', '$routeParams', 'syncData', 'Mood', ApiCtrl])
	.controller('SingleMoodCtrl', ['$scope', '$routeParams', 'syncData', SingleMoodCtrl]);

function AppCtrl($scope, $routeParams, $location, Facebook, syncData, User){

	$scope.user = User;
	$scope.moods = syncData('moods', 10);
	$scope.current = {
		sound: null,
		playing: false
	};

	$scope.$watch(function(){
		return Facebook.isReady();
	}, function(newVal){
		$scope.facebookReady = true;
	});
	
	// Login through Facebook
	$scope.login = function(user) {
		if(!user.loggedIn){
			Facebook.login(function(response) {
			  	$scope.$apply(function(){
			  		console.log('Logged in to Facebook!!');
			  		$scope.me(user);
			  	});
			});
		} else {
			console.log('already logged in');
		}
	};

	$scope.me = function(user) {
		if(!user.loggedIn){
			Facebook.api('/me', function(response) {
				$scope.$apply(function() {
				  	user.loggedIn = true;
				  	user = response;
				  	$location.url('/moods');
				});
			});
		}
	};

	$scope.getLoginStatus = function(user) {
		Facebook.getLoginStatus(function(response) {
			if(response.status == 'connected') {
				$scope.$apply(function() {
					user.loggedIn = true;
					if($location.path() !== '/login'){
						$location.url($location.path());
					}else if ($location.path() == '/moods'){
					}else {
						$location.url('/moods');
					}
					console.warn('already logged in');
				});
			} else {
				$scope.$apply(function() {
					user.loggedIn = false;
					$location.url('/login');
					console.error('not logged in');
				});
			}
		});
	};

	$scope.getLoginStatus($scope.user);
}

function LoginCtrl($scope, $rootScope){

	var introAnims = {
		greetingText: function(){
			$('.greeting-text').children().each(function(i){
				var $this = $(this);
				setTimeout(function(){
					$this.css({
						transform: 'translateY(0)',
						opacity: 1
					});
				}, 100);
			});
		},
		facebookButton: function(){
			setTimeout(function(){
				$('.facebook-login').css({
					transform: 'translateY(0)',
					opacity: 1
				});
			}, 500);
		}
	};

	// play intro animations
	for(var anim in introAnims){
		introAnims[anim]();
	}

}

function MoodCtrl($scope, $rootScope, $location, Mood){

	var self = this;

	$scope.mood = Mood;
	$scope.mood.name = '';

	$scope.setMoodColor = function(color){
		$scope.mood.color = color;
		$('.mood-color').css({'background-color': color});
	    $('.mood-color-picker h2 > a').css({'background-color': color});
	}

	$scope.setMoodName = function(name){
		$scope.mood.name = name;
	}

	$('.mood-color').css({'color': $scope.mood.color});
	$('head').append('<style>.playing > a {color: ' + $scope.mood.color + ';}</style>');

}

function ApiCtrl($scope, $rootScope, $location, $routeParams, $firebase, Mood){
	var self = this;

	$scope.query = '';
	$scope.mood = Mood;
	$scope.mood.tracks = [];

	$('.mood-color').css({'color': $scope.mood.color});
	$('head').append('<style>.playing > a {color: ' + $scope.mood.color + ';}</style>');

	$scope.search = function($event, query){
		var pageSize = 20;
		var offset = 0;		
		if($event.keyCode == 13){
			$scope.loading = true;
			SC.get('/tracks', { limit: pageSize, offset: offset, q: query }, function(tracks) {
				$scope.$apply(function(){
					$scope.loading = false;
					$scope.tracksList = tracks;
				})
			});
		}
	}

	$scope.toggleTrack = function(track){
		if(!$scope.current.playing){
			SC.stream("/tracks/" + track.id, function(sound){
				$scope.current.sound = sound;
				$scope.current.playing = true;
			  	sound.play();
			});
		}else {
			$scope.current.playing = false;
			$scope.current.sound.stop();
			$scope.current.sound = null;
		}
	}

	$scope.createMood = function(mood){
		$scope.moods.$add(mood);
		$location.url('/moods');
	}

}

function SingleMoodCtrl($scope, $routeParams, syncData){
	
	var self = this;
	$scope.mood = syncData('moods/' + $routeParams.id);

}