
    var liveRecordId = "0";


    function OnAirNow() {
        this.subscribeEvent();
    }


    /**
     * The subscribeEvent function add a listener to receive an event when the
     * data is received from the polling component.
     *
     */
    OnAirNow.prototype.subscribeEvent = function () {

        var _this = this;

        $( document ).on( "ipr-richtracks-updated", function ( event, data ) {
            if ( data[ 0 ].record_id != _this.liveRecordId ) {
                console.log(data[ 0 ].record_id);
                _this.updateTrackNowPlaying( data[ 0 ] );
            } 
        } );
    };



    /**
     * The setTrackPlaying function create the new containers and add the info about the new Episode on Air
     * @data Data about the broadcast schedule
     */

    OnAirNow.prototype.updateTrackNowPlaying = function ( newTrack ) {
        console.log(newTrack);

        $(".artist-div").html("<h1>" + newTrack.title + " - " + newTrack.artist + " </h1><img src='http://" + newTrack.image.pid.replace("$recipe", "96x96") + "'>");

        var _this = this;
        this.liveRecordId = newTrack.record_id;
        this.findNewTrackID(newTrack);

    };

    OnAirNow.prototype.findNewTrackID = function ( newTrack ) {

        var _this = this;
        var query = 'track.search?q_track='+encodeURIComponent(newTrack.title)+'&q_artist='+encodeURIComponent(newTrack.artist)+'&f_has_lyrics=1&apikey=d4781aecd95154f53277337bb66fcb88';
        console.log(query);
        $.ajax( {
            type: 'GET',
            crossDomain: true,
            url: 'http://api.musixmatch.com/ws/1.1/' + query,
            cache: true,
            dataType: 'json',
            context: _this,
            success: function ( data ) {
                console.log(data);
                _this.getLyrics(data.message.body.track_list[0].track.track_id);
            },
            error: function ( error ) {
                console.log(error);
            }

        } );

    };

    OnAirNow.prototype.getLyrics = function ( trackID ) {

        var _this = this;
        var query = 'track.lyrics.get?track_id='+trackID+'&apikey=d4781aecd95154f53277337bb66fcb88';
        $.ajax( {
            type: 'GET',
            crossDomain: true,
            url: 'http://api.musixmatch.com/ws/1.1/' + query,
            cache: true,
            dataType: 'json',
            context: _this,
            success: function ( data ) {
                _this.setLyrics(data.message.body.lyrics.lyrics_body);
            },
            error: function ( error ) {
                console.log(error);
            }

        } );

    };

    OnAirNow.prototype.setLyrics = function (lyrics){
        lyrics = lyrics.replace("...\n\n******* This Lyrics is NOT for Commercial use *******", "").replace(/\n/g, "<br>");
        $(".lyrics-div").html(lyrics);
        console.log(lyrics);
    }



 