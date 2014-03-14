angular.module('soundMoods.directives', ['soundMoods'])
	.directive('track', ['$rootScope', function($rootScope){
		return {
			restrict: 'E',
			templateUrl: '../directives/track.html',
			link: function(scope, el, attrs){

				el.draggable({
					appendTo: 'body',
					containment: "body",
					addClasses: '.draggable-item',
					cursor: "crosshair",
					stack: '.tracks-listing-container',
					zIndex: 100,
					helper: function(){
						$rootScope.track = scope.track;
						return el.find('img').clone();
					},
					start: function(){
			            el.hide();
			        },
			        stop: function(){
			            el.show();
			        }
				});


			}
		}
	}])
	.directive('droppable', ['$rootScope', function($rootScope){

		var utils = {
			hexToRgb: function(hex) {
			    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
			    return result ? {
			        r: parseInt(result[1], 16),
			        g: parseInt(result[2], 16),
			        b: parseInt(result[3], 16)
			    } : null;
			},
			randColor: function(base){
				var rand = Math.random();
				var randomOffset = function(){
					return (Math.random() * 100) % 255;
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
				
				return 'rgba(' + newColor.r + ',' + newColor.g + ','+ newColor.b + ',1.0)';
			},
			randPosition: function(){
				return {
					x: Math.floor(Math.random() * 500),
					y: Math.floor(Math.random() * 500)
				}
			}
		}

		return {
			restrict: 'A',
			link: function(scope, el, attrs){
				var base = utils.hexToRgb(scope.mood.color);

				el.droppable({
					over: function(e, ui){
						el.css({'background-color': '#ccc'})
					},
					out: function(e, ui){
						el.css({'background-color': '#fff'})
					},
					drop: function(e, ui){
						// add tracks to mood scope
						scope.mood.tracks.push({
							name: $rootScope.track.title,
							soundCloudId: $rootScope.track.id,
							soundCloudUrl: $rootScope.track.permalink_url,
							artwork: $rootScope.track.artwork_url,
							position: utils.randPosition(),
							color: utils.randColor(base)
						});

						var dragged = $(ui.draggable).detach()
						el.find('.tracks-selected-list').append(dragged)
						el.css({'background-color': '#fff'})
					}
				});
			}
		}
	}])
	.directive('moodColor', function(){

		var lastPos = {};

		function checkPosition(pos){
			var margin = 150;
			if (lastPos){
				for( var p in lastPos){
					if(pos > p - 120 || pos < p + 120){
						pos += margin;
					}
				}
			}
			return pos;
		}

		return {
			restrict: 'E',
			replace: true,
			template: '<li class="random-color mood-item"><a data-track-id="{{track.soundCloudId}}" class="mood-circle-sm" ng-class="{playing: track.isPlaying}"></a></li>',
			link: function(scope, el, attrs){
				lastPos = scope.track.position;
				scope.track.isPlaying = false;
				el.find('a').css({
					'background-color'	: scope.track.color
				})
				setTimeout(function(){
					el.css({
						opacity: 1,
						top: checkPosition(scope.track.position.y),
						left: checkPosition(scope.track.position.x)
					})
				}, 500);
				el.click(function(){
					$scope.$apply(function(){
						scope.track.isPlaying = !scope.track.isPlaying;
					})
				});
			}
		}
	});