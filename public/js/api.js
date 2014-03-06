$(function(){

	var API = {

		init: function(){

			var self = this;

			self.initSoundCloud();
			
			self.search({query: 'edx'});
			
			// self.loadTrack()
				// .done(self.createWidget);

		},

		initSoundCloud: function(){
			SC.initialize({
				client_id: 'ad730ffeb0a4c9dc2dcb52b911509dac'
			});
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

		createWidget: function(){

			var self = this;
			var widget = SC.Widget($('iframe')[0]);

			widget.bind(SC.Widget.Events.PLAY, function(data){
				// $('.player').html('<h1>Loading...</h1>');
			});

		},

		addTrack: function(track){

			$('.player ul').append('<li><a href="' + track.permalink_url + '">' + track.title + '</a></li>');

		},

		search: function(params){

			var self = this;

			$('.player').html('<div class="loading"><span class="spinner"></span></div>');
			$('.player').append('<ul></ul>');
			SC.get('/tracks', { limit: 20, q: params.query }, function(tracks) {
				$('.player .loading').remove();
				tracks.forEach(self.addTrack);
			});

		}


	}

	API.init();
	
});