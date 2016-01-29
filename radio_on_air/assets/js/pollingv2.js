

    var numberOfErrors = 0;
    var maxNumberOfErrors = 3;
    var polling_options = {};
    var pollingTimeout = null;

    /**
     * This the entry point for Polling.
     * @constructor
     */
    function PollingV2() {
        $( '#on-air-polling-hidden' ).on( 'click', this.stop );
    }

    /**
     * This is the poll function that fetch all the real time data.
     */
    PollingV2.prototype.poll = function () {
        var _this = this;

        $.ajax( {
            type: 'GET',
            crossDomain: true,
            url: _this.polling_options.polling_url + '/' + _this.polling_options.sid,
            cache: true,
            dataType: 'json',
            context: _this,
            success: function ( data ) {
                _this.numberOfErrors = 0;
                if ( data.timeouts.polling_timeout >= 1 ) {
                    _this.setNextPolling( data.timeouts.polling_timeout );
                    _this.publishEvents( data );
                }
            },
            error: function ( error ) {
                if ( _this.numberOfErrors < _this.maxNumberOfErrors ) {
                    _this.numberOfErrors++;
                    _this.setNextPolling( 30000 );
                }
            }

        } );

    };

    /**
     * This funciton set the timeout for the next polling
     * @param maxAge time until next polling request
     */
    PollingV2.prototype.setNextPolling = function ( maxAge ) {
        var _this = this;
        pollingTimeout = setTimeout( _this.poll.bind( _this ), maxAge ); //Assuming it's in miliseconds
    };

    /**
     * This is the function that publish event for all the services that have new data.
     * @param real time data
     */
    PollingV2.prototype.publishEvents = function ( realTimeData ) {

        for ( var i = 0; i < realTimeData.providers.length; i++ ) {
            var nameEvent = 'ipr-' + realTimeData.providers[ i ] + '-updated';
            $( document ).trigger( nameEvent, [ realTimeData.packages[ '' + realTimeData.providers[ i ] ] ] );
        }

    };

    /**
     * This function set up the options (url & sid) for polling
     * @param options
     */
    PollingV2.prototype.setPollingOptions = function ( options ) {
        this.polling_options = options;
    };

    /**
     * This function stops polling
     */

    PollingV2.prototype.stop = function () {
        clearTimeout( pollingTimeout );
    };
