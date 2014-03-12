var API = {

	init: function($apiScope){

		var self = this;
		self.apiScope = $apiScope;
		self.initSoundCloud();

		return this;
	},

	/**
	 * Initialize SoundCloud
	 */
	initSoundCloud: function(){
		SC.initialize({
			client_id: 'ad730ffeb0a4c9dc2dcb52b911509dac'
		});
	},

	/**
	 * Search SoundCloud
	 */
	search: function(query){
		var self = this;
		var pageSize = 20;
		var offset = 0;
		var $trackContainer = $('.tracks-listing-container');

		var showSpinner = function(){
			$trackContainer.html('<div class="loading"><span class="spinner"></span></div>');
		},

		ajaxSounds = function(offset){
			// ajax soundcloud API
			SC.get('/tracks', { limit: pageSize, offset: offset, q: query }, function(tracks) {
				$trackContainer.find('.loading').replaceWith('<ul class="tracks-list"></ul>');
				tracks.forEach(function(track){
					self.addTrack(track);
				});
			});
		};

		// do validations on query
		
		// stop any playing tracks
		self.stopAllPlaying();

		// show spinner
		showSpinner();

		// ajax tracks
		ajaxSounds();
	},

	loadTrack: function(){
		var d = new $.Deferred();

		// var track_url = 'https://soundcloud.com/edxmusic/avicii-wake-me-up-edx-edit';
		// SC.oEmbed(track_url, {auto_play: true}, function(oEmbed) {
		// 	$('.player').html(oEmbed.html);
		// 	d.resolve();
		// });

		return d.promise();
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

	/**
	 * Toggle play/pause
	 */
	toggleTrack: function(e){
		
		e.preventDefault();

		var $this = $(e.currentTarget);
		var $trackItem = $this.parent('.track-item') || $this.find('a');
		var $id = $this.data('track-id') || $this.find('a').data('track-id');
		var track;

		// if we have an id and it's not playing, play it!
		if (!$trackItem.hasClass('playing')){

			SC.stream("/tracks/" + $id, function(sound){
				track = sound;
			  	track.play();
			  	$this.data('track', track);
			});
			$trackItem.addClass('playing');
			$this.find('.mood-circle-sm').addClass('playing');

		} else {

			var track = $trackItem.data('track');
			track.pause();
			$trackItem.removeClass('playing');
			$this.find('.mood-circle-sm').removeClass('playing');

		}

	},

	addTrack: function(track){

		var self = this;
		self.apiScope.tracks.push({id: track.id, title: track.title});

		// create a track
		var $track = $('<li class="track-item">\
							<img width="50" src="' + track.artwork_url + '">\
							<a data-track-id="' + track.id + '" href="#">' + track.title + '</a>\
						</li>');
		
		// bind it's link
		$track.find('a').on('click', function(e){
			self.stopAllPlaying(e);
			self.toggleTrack(e);
		});

		$track.draggable({
			appendTo: 'body',
			containment: "body",
			addClasses: '.draggable-item',
			cursor: "crosshair",
			stack: '.tracks-listing-container',
			zIndex: 100,
			helper: function(){
				return $(this).find('img').clone();
			},
			start: function(){
	            $(this).hide();
	        },
	        stop: function(){
	            $(this).show();
	        }
		});

		// add it to the list
		$('.tracks-list').append($track);
	}


}