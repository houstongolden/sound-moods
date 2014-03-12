angular.module('soundMoods', [
		'ngRoute',
		'ngAnimate',
		'soundMoods.controllers',
		'facebook'
	]).config(function($routeProvider, $locationProvider, FacebookProvider){

		FacebookProvider.init('787246124637994');
		
		// routes
		$routeProvider
		.when('/', {
			redirectTo: '/login'
		})
		.when('/login', {
			templateUrl: 'partials/login.html',
			controller: 'LoginCtrl'
		})
		.when('/moods', {
			templateUrl: 'partials/moods.html',
			controller: 'MoodCtrl'
		})
		.when('/mood-player/:id', {
			templateUrl: 'partials/mood-player.html',
			controller: 'SingleMoodCtrl'
		})
		.when('/moods/create/color', {
			templateUrl: 'partials/mood-color.html',
			controller: 'MoodCtrl'
		})
		.when('/moods/create/name', {
			templateUrl: 'partials/mood-name.html',
			controller: 'MoodCtrl'
		})
		.when('/moods/create/tracks', {
			templateUrl: 'partials/mood-tracks.html',
			controller: 'ApiCtrl'
		})
		.when('/moods/create/tracks/:trackId', {
			templateUrl: 'partials/mood-tracks.html',
			controller: 'ApiCtrl'
		})
		.when('/moods/create/summary', {
			templateUrl: 'partials/create-mood.html',
			controller: 'MoodCtrl'
		})
		.otherwise({redirectTo: '/login'});

		// $locationProvider.html5Mode(true);
	});
