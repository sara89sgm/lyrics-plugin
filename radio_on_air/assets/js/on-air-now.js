

    var livePid = "";
    var liveRecordId = "";
    var liveRecordStatus = "";

    function OnAirNow() {
        this.moveToOnAirShow();
        this.subscribeEvent();
        this.livePid = $( ".on-air-now .on-air__episode-link" ).attr( "data-episode-pid" );
        this.liveRecordId = $( ".on-air__track-now-playing" ).attr( "data-istats-record_id" );
        this.liveRecordStatus = "recently_played";
    }

    OnAirNow.prototype.moveToOnAirShow = function () {

        var _this = this;

        this.streamContainer = document.querySelector( ".on-air__container" );
        this.streamContainerLiOnAirNow = document.querySelector( ".on-air-now" );

        if ( this.streamContainerLiOnAirNow ) {
            var onAirNowPosition = this.streamContainerLiOnAirNow.offsetLeft,
                onAirNowWidth = this.streamContainerLiOnAirNow.clientWidth;

            $( document ).ready( function () {
                $( _this.streamContainer ).stop().animate( {
                    scrollLeft: ( ( onAirNowPosition ) + onAirNowWidth )
                }, 0, "swing", function () {
                    $( _this.streamContainer ).stop().animate( {
                        scrollLeft: ( onAirNowPosition )
                    }, 800, "swing" );
                } );
            } );
        }
    };


    /**
     * The subscribeEvent function add a listener to receive an event when the
     * data is received from the polling component.
     *
     */
    OnAirNow.prototype.subscribeEvent = function () {

        var _this = this;

        $( document ).on( "ipr-on-air-updated", function ( event, data ) {
            if ( data.broadcasts[ data.broadcastNowIndex ].pid != _this.livePid ) {
                _this.setOnAirData( data );
            }
        } );

        $( document ).on( "ipr-richtracks-updated", function ( event, data ) {
            if ( data[ 0 ].record_id != _this.liveRecordId ) {
                _this.updateTrackNowPlaying( data[ 0 ] );
            } else if ( _this.liveRecordStatus != data[ 0 ].track_type ) {
                _this.changeTrackNowPlayingStatus( data[ 0 ].track_type );
            }
        } );
    };

    /**
     * The setOnAirData function create the new containers and add the info
     * about the new Episode on Air
     * @data Data about the broadcast schedule
     */

    OnAirNow.prototype.setOnAirData = function ( data ) {

        var newBroadcastData = data.broadcasts[ data.broadcastNowIndex ];
        this.livePid = newBroadcastData.pid;

        var newContainerOnAirNow = $( ".on-air-now" ).clone( true );
        newContainerOnAirNow.find( ".on-air__listen-live__wrap" ).css( "background-image", "url(http://ichef.bbci.co.uk/images/ic/640x360/" + newBroadcastData.imagePID + ".jpg)" );
        newContainerOnAirNow = this.updateEpisode( newBroadcastData, newContainerOnAirNow );

        var oldContainerOnAirNow = $( ".on-air-now" );
        oldContainerOnAirNow.removeClass( "on-air-now" ).addClass( "on-air-now-old" );
        newContainerOnAirNow.insertAfter( ".on-air-now-old" );

        $( ".on-air-now-old" ).remove();

        this.moveToOnAirShow();
        this.updateSchedule( data );

    };

    /**
     * The setTrackPlaying function create the new containers and add the info about the new Episode on Air
     * @data Data about the broadcast schedule
     */

    OnAirNow.prototype.updateTrackNowPlaying = function ( newTrack ) {

        var _this = this;
        this.liveRecordId = newTrack.record_id;

        var trackNowPlayingContainer = $( ".on-air__track-playing__wrap" );
        trackNowPlayingContainer.fadeOut( function () {
            _this.setNewTrackNowPlaying( newTrack );
        } );
    };

    OnAirNow.prototype.setNewTrackNowPlaying = function ( newTrack ) {
        var trackNowPlayingContainer = $( ".on-air__track-playing__wrap" );
        trackNowPlayingContainer.find( ".on-air__track-now-playing__artist" ).text( newTrack.artist );
        trackNowPlayingContainer.find( ".on-air__track-now-playing__title" ).text( newTrack.title );
        trackNowPlayingContainer.find( ".on-air__track-now-playing" ).attr( "data-istats-record_id", newTrack.record_id );

        if ( newTrack.musicbrainz_id !== null ) {
            trackNowPlayingContainer.find( ".on-air__track-now-playing" ).attr( "href", "/music/artists/" + newTrack.musicbrainz_id );
        }
        this.changeTrackNowPlayingStatus( newTrack.track_type );
        trackNowPlayingContainer.fadeIn( "slow" );

        var playlisterContainer = trackNowPlayingContainer.find( ".on-air__track-now-playing__playlister" );
        playlisterContainer.attr( "data-artistname", newTrack.artist );
        playlisterContainer.attr( "data-recordid", newTrack.record_id );
        playlisterContainer.empty();


    };

    OnAirNow.prototype.changeTrackNowPlayingStatus = function ( status ) {
        var trackNowPlayingContainer = $( ".on-air__track-playing__wrap" );
        if ( status === "now_playing" ) {
            trackNowPlayingContainer.find( ".recently_played_message" ).hide();
            trackNowPlayingContainer.find( ".now_playing_message" ).show();
        } else {
            trackNowPlayingContainer.find( ".recently_played_message" ).show();
            trackNowPlayingContainer.find( ".now_playing_message" ).hide();
        }
        this.liveRecordStatus = status;
    };

    OnAirNow.prototype.updateSchedule = function ( data ) {

        var nextMessage = $( ".on-air-now + li" ).find( " .on-air__next" ).clone();
        $( ".on-air-now +li " ).remove();
        $( ".on-air-now +li " ).find( ".on-air__info-top" ).prepend( nextMessage );
        var actualEpisode = $( ".on-air-now +li " );
        for ( var i = data.broadcastNowIndex + 1; i < data.broadcasts.length; i++ ) {

            if ( actualEpisode.next().is( "li" ) ) {
                actualEpisode = actualEpisode.next();
                if ( actualEpisode.find( ".on-air__episode-link" ).attr( "data-istats-episode_id" ) &
                    actualEpisode.find( ".on-air__episode-link" ).attr( "data-istats-episode_id" ) !== data.broadcasts[ i ].pid ) {
                    this.updateEpisode( data.broadcasts[ i ], actualEpisode );
                }
            } else {
                break;
            }
        }

        var prevProgramme = $( ".on-air-now - li" ).clone();
        $( ".on-air-now - li" ).find( " .on-air__previous" ).remove();
        var newEpisodeContainer = this.updateEpisode( data.broadcasts[ data.broadcastNowIndex - 1 ], prevProgramme );
        prevProgramme.insertBefore( ".on-air-now" );

        for ( i = data.broadcastNowIndex - 1; i >= 0; i-- ) {

            if ( actualEpisode.prev().is( "li" ) ) {
                actualEpisode = actualEpisode.prev();
                if ( actualEpisode.find( ".on-air__episode-link" ).attr( "data-istats-episode_id" ) &
                    actualEpisode.find( ".on-air__episode-link" ).attr( "data-istats-episode_id" ) !== data.broadcasts[ i ].pid ) {
                    this.updateEpisode( data.broadcasts[ i ], actualEpisode );
                }
            } else {
                break;
            }
        }

    };

    OnAirNow.prototype.updateEpisode = function ( episodeData, episodeContainer ) {

        episodeContainer.find( ".on-air__time" ).text( "" + episodeData.start_time + "-" + episodeData.end_time );
        episodeContainer.find( ".on-air__episode-link" ).attr( "href", episodeData.url );
        episodeContainer.find( ".on-air__episode-link" ).attr( "data-istats-episode_id", episodeData.pid );
        episodeContainer.find( ".on-air__episode-title" ).text( episodeData.primary_title );
        episodeContainer.find( ".on-air__episode-synopsis" ).text( episodeData.secondary_title );

        return episodeContainer;
    };




