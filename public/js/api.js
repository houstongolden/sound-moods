var API = {

	init: function($apiScope){

		var self = this;
		self.apiScope = $apiScope;

		return this;
	},

	stopAllPlaying: function(e){

		if (!!e){
			e.preventDefault();
		}
		

		// stop all tracks
		var tracksStopped = $('.tracks-list').find('.playing').each(function(){
			var playing = $(this).find('a').data('track');
			playing.stop();
			$(this).removeClass('playing');
		});
		
		$('.mood-player-container').find('.mood-item').each(function(){
			var track = $(this).data('track');
			if (track){
				track.stop();
				$(this).removeClass('playing');
			}
		});

		return tracksStopped;
	},

	addTrack: function(track){

		var self = this;
		
		// bind it's link
		$track.find('a').on('click', function(e){
			self.stopAllPlaying(e);
			self.toggleTrack(e);
		});

	}


}