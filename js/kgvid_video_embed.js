var kgvid_video_vars = {};

function kgvid_SetVideo(suffix, site_url, id, width, height) {
	var aspect_ratio = Math.round(height/width*1000)/1000
	if ( width > screen.width ) { 
		width = screen.width-6; 
		height = Math.round(width * aspect_ratio);
	}
	jQuery('#kgvid_GalleryPlayerDiv_'+suffix).html('<iframe id="kgvid_GalleryVideo_'+id+'" src="'+site_url+'?attachment_id='+id+'&kgvid_video_embed[enable]=true&kgvid_video_embed[gallery]=true&kgvid_video_embed[width]='+width+'&kgvid_video_embed[height]='+height+'" scrolling="no" width="'+width+'" height="'+height+'" frameborder="0" webkitallowfullscreen="" allowfullscreen=""></iframe>');
	jQuery('#kgvid_GalleryPlayerDiv_'+suffix).dialog("option", "width", parseInt(width)+6);
	jQuery('#kgvid_GalleryPlayerDiv_'+suffix).dialog('open');
	jQuery('#kgvid_GalleryPlayerDiv_'+suffix).dialog("option", "height", parseInt(height)+10);
	jQuery('.ui-widget-overlay').click(function () { jQuery('#kgvid_GalleryPlayerDiv_'+suffix).dialog('close'); });
}

function kgvid_setup_video(id) {
	var video_vars = kgvid_video_vars[id];
	var iOS = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/i) ? true : false );
	if (iOS) { video_vars.player_type = "Video.js"; }
	
	jQuery('#video_'+id+'_div').prepend(jQuery('#video_'+id+'_watermark'));
	jQuery('#video_'+id+'_watermark').attr('style', ''); //shows the hidden watermark div
	jQuery('#video_'+id+'_div').prepend(jQuery('#video_'+id+'_meta'));
	jQuery('#video_'+id+'_meta').attr('style', ''); //shows the hidden meta div

	if ( video_vars.player_type == "Video.js" ) {
	
		var player = videojs('video_'+id);
	
		if ( video_vars.set_volume != "" ) { player.volume(video_vars.set_volume); }
	
		player.on('play', function(){
			if ( video_vars.meta ) {
				jQuery('#video_'+id+'_div').hover(
					function(){ 
						jQuery('#video_'+id+'_meta').addClass('kgvid_video_meta_hover');
						jQuery('#video_'+id+'_watermark').fadeOut(100);
					},
					function(){ 
						jQuery('#video_'+id+'_meta').removeClass('kgvid_video_meta_hover');
						setTimeout(function(){jQuery('#video_'+id+'_watermark').fadeIn(1000);},2000);
					}
				);
				jQuery('#video_'+id+'_meta').removeClass('kgvid_video_meta_hover');
			}
			if ( video_vars.autoplay == "true" ) { jQuery('#video_'+id+' > .vjs-control-bar').removeClass('vjs-fade-in'); }
			kgvid_video_counter(id, 'play');
		});
		
		player.on('ended', function(){ 
			kgvid_video_counter(id, 'end');
			setTimeout(function() { jQuery('#video_'+id+' > .vjs-loading-spinner').hide(); }, 250);
		});
		
		player.on('fullscreenchange', function(){
				jQuery('#video_'+id).removeClass('vjs-fullscreen');
		});
		
	} //end if Video.js
	
	if ( video_vars.player_type == "Strobe Media Playback" ) {
		
		if ( video_vars.autoplay == "true" ) { jQuery('#video_'+id+'_meta').removeClass('kgvid_video_meta_hover'); }
		jQuery('#video_'+id+'_div').hover(
			function(){ 
				jQuery('#video_'+id+'_meta').addClass('kgvid_video_meta_hover'); 
				jQuery('#video_'+id+'_watermark').fadeOut(100);
			},
			function(){ 
				jQuery('#video_'+id+'_meta').removeClass('kgvid_video_meta_hover');
				setTimeout(function(){jQuery('#video_'+id+'_watermark').fadeIn('slow');},3000);
			}
		);
	} //end if Strobe Media Playback
	
	kgvid_resize_video(id);
	window.addEventListener('resize', kgvid_resize_all_videos, false);
}

function kgvid_resize_all_videos() {
	for (var id in kgvid_video_vars) {
		kgvid_resize_video(id);
	}
}

function kgvid_resize_video(id) {

	var video_vars = kgvid_video_vars[id];
	var set_width = video_vars.width;
	var set_height = video_vars.height;
	var iOS = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/i) ? true : false );
	if ( iOS ) { video_vars.player_type = "iOS"; }
	var aspect_ratio = Math.round(set_height/set_width*1000)/1000
	var reference_div = jQuery('#kgvid_'+id+'_wrapper').parent().children().first();
	if ( reference_div.attr('id') == 'kgvid_'+id+'_wrapper' ) { reference_div = jQuery('#kgvid_'+id+'_wrapper').parent(); }
	parent_width = reference_div.width();
	if ( parent_width < set_width ) { set_width = parent_width; }
	set_width = parseInt(set_width);

	if ( set_width != 0 ) {

		jQuery('#kgvid_'+id+'_wrapper').width(set_width);
		var set_height = Math.round(set_width * aspect_ratio);
		if (  video_vars.player_type == "Video.js" ) {
			videojs('video_'+id).width(set_width).height(set_height);
			if ( set_width < 500 ) {
				var scale = Math.round(100*set_width/500)/100;
				jQuery('#kgvid_'+id+'_wrapper .vjs-big-play-button').css('-webkit-transform','scale('+scale+')').css('-o-transform','scale('+scale+')').css('-ms-transform','scale('+scale+')').css('transform','scale('+scale+')');
			}
		}
		if ( video_vars.player_type == "Strobe Media Playback" ) {
			jQuery('#video_'+id+'_div').height(set_height);
			jQuery('#video_'+id).attr('width',set_width).attr('height',set_height);
			jQuery('#video_'+id+'_html5_api').attr('width',set_width).attr('height',set_height);
		}
		if ( video_vars.player_type == "iOS" ) {
			jQuery('#video_'+id).attr('width',set_width).attr('height',set_height);
			jQuery('#video_'+id).width(set_width).height(set_height);
		}

	}
	
	var width_remove = 10;
	if ( jQuery('#video_'+id+'_embed').length ) {  width_remove = 180; }
	jQuery('#video_'+id+'_title').width(set_width-width_remove); //truncates long titles
	
	width_remove = 0;
	if ( jQuery('#video_'+id+'_viewcount').length ) { width_remove = jQuery('#video_'+id+'_viewcount').width()+20; }
	jQuery('#video_'+id+'_caption').width(set_width-width_remove); //wraps long captions

}

function kgvid_strobemedia_callback(id) {

	var player = document.getElementById('video_'+id);
	var video_vars = kgvid_video_vars[id];
	if ( player.getState() == 'buffering' || player.getState() == 'playing' ) { 
		kgvid_video_counter(video_vars.id, 'play'); 
	}
	
	if ( player.getState() == 'uninitialized' && video_vars.set_volume != "" ) {
		player.setVolume(video_vars.set_volume);
	}
}

function kgvid_video_counter(id, event) {

	var video_vars = kgvid_video_vars[id];
	var changed = false;	
	
	var played = jQuery('#video_'+id+'_div').data("played") || "not played";
	if ( played == "not played" ) { 
		if (video_vars.countable) { //video is in the db
			changed = true; 
			jQuery('#video_'+id+'_div').data("played", "played");
		}
		if (typeof _gaq != "undefined") { _gaq.push(["_trackEvent", "Videos", "Play Start", video_vars.title]); }
	}
	if ( event == "end" ) {
		if (video_vars.countable) { //video is in the db 
			changed = true; 
		}
		if (typeof _gaq != 'undefined') { _gaq.push(['_trackEvent', 'Videos', 'Complete View', video_vars.title]); }
	}
	if ( changed == true ) {
		jQuery.post(ajax_object.ajaxurl, {
			action: 'kgvid_count_play',
			post_id: id,
			video_event: event
		}, function(data) {
			if ( event == "play" ) { jQuery('#video_'+id+'_viewcount').html(data+' views'); }
		});
	}	
}