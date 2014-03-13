angular.module('soundMoods.controllers', [])
	.controller('AppCtrl', ['$scope', '$routeParams', '$location', 'Facebook', 'syncData', 'User', AppCtrl])
	.controller('LoginCtrl', ['$scope', '$rootScope', LoginCtrl])
	.controller('MoodCtrl', ['$scope', '$rootScope', '$location','Mood', MoodCtrl])
	.controller('ApiCtrl', ['$scope', '$rootScope', '$location', '$routeParams', '$http', '$firebase', 'Mood', ApiCtrl])
	.controller('SingleMoodCtrl', ['$scope', '$routeParams', '$http', SingleMoodCtrl]);

function AppCtrl($scope, $routeParams, $location, Facebook, syncData, User){

	$scope.user = User;
	$scope.moods = syncData('moods', 10);

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
	this.API = API.init($scope);

	$scope.mood = Mood;

	$scope.setMoodColor = function(color){
		$scope.mood.color = color;
		$('.mood-color').css({'background-color': color});
	    $('.mood-color-picker h2 > a').css({'background-color': color});
	}

	$scope.setMoodName = function(name){
		$scope.mood.name = name;
	}

	$scope.addMood = function(mood){
		$scope.moods.$add(mood);
		mood = null;
	}

	$scope.searchApi = function(query){
		console.log(query)
		self.API.search(query);
	}

	$('.mood-color').css({'color': $scope.mood.color});
	$('head').append('<style>.playing > a {color: ' + $scope.mood.color + ';}</style>');

	// $('.big-mood-circle').droppable({
	// 	drag: function(){
	// 		if(!$(this).css({color: "#ccc"})){
	// 			$(this).css({
	// 				color: '#ccc'
	// 			});
	// 		}
	// 	},
	// 	drop: function(e, ui){
	// 		var el = $(ui.draggable).detach();
	// 		$(this).find('.tracks-selected-list').append(el);
	// 	}
	// });

	// $('#create-mood').click(function(){
	// 	$scope.selectedTracks = [];
	// 	$('.tracks-selected-list li').each(function(){
	// 		$scope.selectedTracks.push({ trackId: $(this).data('track-id') });
	// 	});
	// });
}

function ApiCtrl($scope, $rootScope, $location, $routeParams, $http, $firebase, Mood){
	var self = this;

	$scope.tracks = [];
	$scope.query = '';
	$scope.mood = Mood;
	$scope.current = {
		sound: null,
		playing: false
	};

	this.API = API.init($scope);

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

	$scope.addTrack = function(track){

	}

	$scope.createMood = function(mood){

	}
	// $('.big-mood-circle').droppable({
	// 	drag: function(){
	// 		if(!$(this).css({color: "#ccc"})){
	// 			$(this).css({
	// 				color: '#ccc'
	// 			});
	// 		}
	// 	},
	// 	drop: function(e, ui){
	// 		var el = $(ui.draggable).detach();
	// 		$(this).find('.tracks-selected-list').append(el);
	// 	}
	// });
}

function SingleMoodCtrl($scope, $routeParams, $http){
	
	var self = this;
	this.API = API.init($scope);

	function hexToRgb(hex) {
	    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	    return result ? {
	        r: parseInt(result[1], 16),
	        g: parseInt(result[2], 16),
	        b: parseInt(result[3], 16)
	    } : null;
	}
	function randColor(base){
		var rand = Math.random();
		var randomOffset = function(){
			return (Math.random() * 10) % 255;
		}
		var newColor = {};
		if(rand > 0.5){
			for(var color in base){
				newColor[color] = Math.floor(base[color] + randomOffset())
			}
		}else {
			for(var color in base){
				newColor[color] = Math.floor(base[color] - randomOffset())
			}
		}
		return newColor;
	}
	function randomPosition(){
		var rgbaBase = hexToRgb($scope.mood.color);

		$('.mood-item').each(function(){
			
			var rand = (Math.random() * 1000);
			var diameter = rand + 120;
			var margin = 50;
			var lastPos = {
				rand: rand,
				diameter: diameter
			};

			var checkPos = function(pos){
				for(var i = 0; i < lastPos.diameter; i++){
					if (lastPos.rand == i){
						// push off that position (artificial intelligence)
						pos += lastPos.margin
					}
				}
				return pos;
			}

			$(this).css({
				opacity: 1,
				top: Math.floor(checkPos(Math.random() * 500)),
				left: Math.floor(checkPos(Math.random() * 500))
			});

			var color = randColor(rgbaBase);
			$(this).find('a').css({
				'background-color': 'rbg(' + color.r + ',' + color.g + ','+ color.b + ')'
			});
		}).on('click', function(e){
			$scope.currentPlaying = $(this).data('name');
			self.API.stopAllPlaying(e);
			self.API.toggleTrack(e);
		});
	}
	// $http.get('/moods/' + $routeParams.id).success(function(data){
	// 	$scope.mood = data;
	// 	setTimeout(function(){ randomPosition(); }, 1000);
	// });
}