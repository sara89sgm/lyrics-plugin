        function OnAir() {
            this.onAirNow = new OnAirNow();
            this.onAirSchedule = new OnAirSchedule();
            this.onAirSchedule.calculateListElementHeight();
        };

        OnAir.prototype.calculateElementHeight = function () {
            var maxHeight = -1,
                liElements = $( "ul.on-air__container > li" );

            maxHeight = $( "ul.on-air__container" ).height(); //( ( +maxHeight + 16 ) < 120 ) ? 136 : maxHeight;
            liElements.each( function () {
                $( this ).css( "height", maxHeight );
            } );

            /* Logo size */
            if ( screen.width > 900 ) {
                $( ".on-air__logo" ).css( "height", ( +maxHeight + 16 ) );
                $( ".on-air__logo img" ).css( "height", ( +maxHeight + 16 ) );
            }

            /* Viewpoint between (768+1) and 900px */
            if ( screen.width > 768 && screen.width <= 900 ) {
                /* Calculate width of 'On Air Now' slide */
                $( ".on-air__container > li.on-air-now" ).css( "width", screen.width - 60 );

                /* Calculate left padding for 'On Air Now' and 'Track Now Playing */
                var paddingLeft = $( ".on-air__listen-live__wrap" ).width();
                $( "div.on-air__now__wrap" ).css( "padding-left", paddingLeft );
                $( "div.on-air__track-playing__wrap" ).css( "padding-left", paddingLeft );
            }

            /* Viewpoint between (320) and 768px */
            if ( screen.width <= 768 ) {
                $( ".on-air__container > li.on-air-now" ).css( "width", screen.width );
            }
        };


        OnAir.prototype.polling = function ( options ) {
            var p  = new PollingV2();
            p.setPollingOptions( options );
            p.poll();
        };
