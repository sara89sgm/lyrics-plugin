

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
    function show(newTrack) {
      var time = /(..)(:..)/.exec(new Date());     // The prettyprinted time.
      var hour = time[1] % 12 || 12;               // The prettyprinted hour.
      var period = time[1] < 12 ? 'a.m.' : 'p.m.'; // The period of the day.
      new Notification(hour + time[2] + ' ' + period, {
        icon: '48.png',
        body: newTrack.title+' '+newTrack.artist+''
      });
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
                _this.updateTrackNowPlaying( data[ 0 ] );
            } 
        } );
    };



    /**
     * The setTrackPlaying function create the new containers and add the info about the new Episode on Air
     * @data Data about the broadcast schedule
     */

    OnAirNow.prototype.updateTrackNowPlaying = function ( newTrack ) {

        var _this = this;
        this.liveRecordId = newTrack.record_id;

    };

    OnAirNow.prototype.setNewTrackLyrics = function ( newTrack ) {



    };

    OnAirNow.prototype.searchMusixmatchTrack = function ( newTrack ) {



    };



 