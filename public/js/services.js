angular.module('soundMoods.services', ['ngResource', 'firebase'])
	.factory('firebaseRef', ['Firebase', 'FIREURL', function(Firebase, FIREURL){
		return function(path){
			return new Firebase(pathRef([FIREURL].concat(Array.prototype.slice.call(arguments))));
		}
	}])
	.factory('syncData', ['$firebase', 'firebaseRef', function($firebase, firebaseRef){
		return function(path, limit){
			var ref = firebaseRef(path);
			limit && (ref = ref.limit(limit));
			return $firebase(ref);
		}
	}])
	.factory('User', function(){
		return {
			loggedIn: false
		}
	})
	.factory('Mood', function(){
		return {
			name: 'My Mood',
			color: '#444',
			tracks: [{
				name: 'EDX Track',
				soundCloudId: 'id',
				soundCloudUrl: 'http://soundcloud.com/edx/trackname'
			}]
		}
	})
	.factory('soundCloud', [], function(){
		return {};
	});

function pathRef(args) {
   for(var i=0; i < args.length; i++) {
      if( typeof(args[i]) === 'object' ) {
         args[i] = pathRef(args[i]);
      }
   }
   return args.join('/');
}