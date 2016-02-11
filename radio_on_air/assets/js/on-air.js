        function OnAir() {
            this.onAirNow = new OnAirNow();
        };


        OnAir.prototype.polling = function ( options ) {
            var p  = new PollingV2();
            p.setPollingOptions( options );
            p.poll();
        };
