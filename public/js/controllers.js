angular.module('soundMoods.controllers', ['apiService'])
	.controller('AppCtrl', ['$scope', '$routeParams', '$location', 'Mood', 'Facebook', AppCtrl])
	.controller('MoodCtrl', ['$scope', '$rootScope', '$location', MoodCtrl])
	.controller('ApiCtrl', ['$scope', '$rootScope', '$location', '$routeParams', 'Mood', '$http', ApiCtrl])
	.controller('LoginCtrl', ['$scope', '$rootScope', LoginCtrl])
	.controller('SingleMoodCtrl', ['$scope', '$routeParams', '$http', SingleMoodCtrl]);

function AppCtrl($scope, $routeParams, $location, Mood, Facebook){

	$scope.loggedIn = false;
	$scope.currentUser = '';
	$scope.moods = Mood.query();
	$scope.mood = {};

	$scope.$watch(function(){
		return Facebook.isReady();
	}, function(newVal){
		$scope.facebookReady = true;
	});
	
	// Login through Facebook
	$scope.login = function() {
		if(!$scope.loggedIn){
			Facebook.login(function(response) {
			  	$scope.$apply(function(){
			  		console.log('Logged in to Facebook!!');
			  		$scope.me();
			  	});
			});
		} else {
			console.log('already logged in');
		}
	};

	$scope.me = function() {
		if(!$scope.loggedIn){
			Facebook.api('/me', function(response) {
				$scope.$apply(function() {
				  	$scope.loggedIn = true;
				  	$scope.currentUser = response;
				  	$location.url('/moods');
				});
			});
		}
	};

	$scope.getLoginStatus = function() {
		Facebook.getLoginStatus(function(response) {
			if(response.status == 'connected') {
				$scope.$apply(function() {
					$scope.loggedIn = true;
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
					$scope.loggedIn = false;
					$location.url('/login');
					console.error('not logged in');
				});
			}
		});
	};

	$scope.getLoginStatus();
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

function MoodCtrl($scope, $rootScope, $location){

	var self = this;
	
	$scope.query = '';

	setTimeout(function(){
		$('.mood-circle').css({transform: 'scale(1)'});
	}, 200);

	$('.mood-color-picker > input').on('change', function() {
		$scope.mood.color = this.value;
	    $('.mood-color').css({'background-color': this.value});
	    $('.mood-color-picker h2 > a').css({'background-color': this.value});
	});

	$('.mood-color').css({'color': $scope.mood.color});
	
	$('input[name="mood-name"]').change(function(){
		$scope.mood.name = $(this).val();
	});
	
	this.API = API.init($scope);

	$('head').append('<style>.playing > a {color: ' + $scope.mood.color + ';}</style>');

	$('input[name="mood-track"]').change(function(){
		$scope.query = $(this).val();
	}).on('keydown', function(e){
		if(e.keyCode == 13){
			self.API.search($(this).val());
		}
	});

	$('.big-mood-circle').droppable({
		drag: function(){
			if(!$(this).css({color: "#ccc"})){
				$(this).css({
					color: '#ccc'
				});
			}
		},
		drop: function(e, ui){
			var el = $(ui.draggable).detach();
			$(this).find('.tracks-selected-list').append(el);
		}
	});

	$('#create-mood').click(function(){
		$scope.selectedTracks = [];
		$('.tracks-selected-list li').each(function(){
			$scope.selectedTracks.push({ trackId: $(this).data('track-id') });
		});
	});
}

function ApiCtrl($scope, $rootScope, $location, $routeParams, Mood, $http){
	var self = this;

	$scope.tracks = [];
	$scope.query = '';
	
	this.API = API.init($scope);

	$('.mood-color').css({'color': $scope.mood.color});

	$('head').append('<style>.playing > a {color: ' + $scope.mood.color + ';}</style>');

	$('input[name="mood-track"]').change(function(){
		$scope.query = $(this).val();
	}).on('keydown', function(e){
		if(e.keyCode == 13){
			self.API.search($(this).val());
		}
	});

	$('.big-mood-circle').droppable({
		drag: function(){
			if(!$(this).css({color: "#ccc"})){
				$(this).css({
					color: '#ccc'
				});
			}
		},
		drop: function(e, ui){
			var el = $(ui.draggable).detach();
			$(this).find('.tracks-selected-list').append(el);
		}
	});

	$('#create-mood').click(function(e){
		e.preventDefault();
		console.log($scope.mood);
		$scope.newMood = {
			name: $scope.mood.name,
			color: $scope.mood.color,
			tracks: []
		};

		if($('.tracks-selected-list li').length > 0){

			$('.tracks-selected-list li').each(function(){
				var $track = $(this);
				$scope.newMood.tracks.push({
					name: $track.find('a').text(),
					soundCloudId: $track.find('a').data('track-id'),
					soundCloudUrl: $track.find('a').attr('href'),
					artwork: $track.find('img').attr('src')
				});
			});
			$http.post('/moods', $scope.newMood).success(function(data){
				$location.url('/moods');
			});

		} else {
			alert('Add some tracks to your mood');
		}
	});
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
			return (Math.random() * 10);
		}
		var newColor = {};
		if(rand > 0.5){
			newColor.r = Math.floor(base.r + randomOffset() % 255);
			newColor.g = Math.floor(base.g + randomOffset() % 255);
			newColor.b = Math.floor(base.b + randomOffset() % 255);
		}else {
			newColor.r = Math.floor(base.r - randomOffset() % 255);
			newColor.g = Math.floor(base.g - randomOffset() % 255);
			newColor.b = Math.floor(base.b - randomOffset() % 255);
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
	$http.get('/moods/' + $routeParams.id).success(function(data){
		$scope.mood = data;
		setTimeout(function(){ randomPosition(); }, 1000);
	});
}