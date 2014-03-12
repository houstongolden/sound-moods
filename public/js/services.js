angular.module('apiService', ['ngResource'])
	.factory('Mood', function($resource){
		return $resource('/moods/:id');
	});