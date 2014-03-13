angular.module('soundMoods.directives', ['soundMoods'])
	.directive('track', function(){
		return {
			restrict: 'A',
			link: function(scope, el, attrs){

				// el.draggable({
				// 	appendTo: 'body',
				// 	containment: "body",
				// 	addClasses: '.draggable-item',
				// 	cursor: "crosshair",
				// 	stack: '.tracks-listing-container',
				// 	zIndex: 100,
				// 	helper: function(){
				// 		return el.find('img').clone();
				// 	},
				// 	start: function(){
			 //            el.hide();
			 //        },
			 //        stop: function(){
			 //            el.show();
			 //        }
				// });

				return el;
			}
		}
	});