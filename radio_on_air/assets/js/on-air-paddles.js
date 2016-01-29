

    /**
     * Constructor for Paddles navigation on aur stream
     *
     * @constructor
     */
    function Paddles() {
        this.streamContainer = document.querySelector( ".on-air__container" );
        this.showArrows();
    }

    /**
     * This function use the common-assets/feature.js to check if we are on on touch device or
     * not so we can activate the template tag.
     *
     */
    Paddles.prototype.showArrows = function () {

            this.onAirContainer = document.querySelector( ".on-air" );
            this.navigationBtnTemplate = document.querySelector( "#on-air__schedule-controls--template" );
            var navigation = document.createElement( "div" );
            navigation.innerHTML = this.navigationBtnTemplate.innerHTML;

            this.onAirContainer.insertBefore(
                navigation,
                this.streamContainer
            );

            this.initArrows();
    };

    /**
     * Initialize arrows
     *
     */
    Paddles.prototype.initArrows = function () {
        this.streamContainerLi = document.querySelector( ".on-air__container li" );
        this.streamContainerLiS = document.querySelectorAll( ".on-air__container li" );
        this.navigationBtns = document.querySelectorAll( ".on-air__schedule-controls-btn" );
        this.navigationBtnPrev = document.querySelector( ".on-air__schedule-controls-btn.previous" );
        this.navigationBtnNext = document.querySelector( ".on-air__schedule-controls-btn.next" );
        this.streamContainerLiOnAirNow = this.streamContainer.getElementsByClassName( "is-on-now" );

        this.addPaddlesListener();
        this.calculateContainerWidth();

        this.streamContainer.addEventListener( "scroll", this.navigationState.bind( this ) );
        window.addEventListener( "resize", this.navigationState.bind( this ) );

        this.navigationState();
    };

    Paddles.prototype.calculateContainerWidth = function () {
        this.containerWidth = 0;
        this.listPositions = [ 0 ];

        for ( var i = 0; i < this.streamContainerLiS.length; i++ ) {
            this.containerWidth += this.streamContainerLiS[ i ].offsetWidth;
            this.listPositions.push( this.containerWidth );
        }
    };

    /**
     * Add a click event on the navigation buttons and call the move container function;
     *
     */
    Paddles.prototype.addPaddlesListener = function () {
        var _this = this;

        [].forEach.call( this.navigationBtns, moveContainer );

        function moveContainer( navBtn ) {
            navBtn.addEventListener( "click", function () {
                if ( this.classList.contains( "previous" ) ) {
                    _this.movePrevious();
                } else if ( this.classList.contains( "next" ) ) {
                    _this.moveNext();
                }
            } );
        }
    };

    /**
     * It checks if we are at the end or beginning of the stream and disable
     * the nav buttons accordingly.
     *
     */
    Paddles.prototype.navigationState = function () {
        var leftPosition = 0;

        this.calculateContainerWidth();


        if ( ( ( this.streamContainer.scrollLeft + this.streamContainer.clientWidth ) + 1 ) >= this.containerWidth ) {
            this.navigationBtnNext.setAttribute( "disabled", "disabled" );
        } else {
            if ( this.navigationBtnNext.getAttribute( "disabled" ) === "disabled" ) {
                this.navigationBtnNext.removeAttribute( "disabled" );
            }
        }


        if ( this.streamContainer.scrollLeft <= leftPosition ) {
            this.navigationBtnPrev.setAttribute( "disabled", "disabled" );
        } else {
            if ( this.navigationBtnPrev.getAttribute( "disabled" ) === "disabled" ) {
                this.navigationBtnPrev.removeAttribute( "disabled" );
            }
        }
    };

    /**
     * It moves the container to the previous element.
     *
     */
    Paddles.prototype.movePrevious = function () {
        this.calculateContainerWidth();
        this.move( {
            direction: "left"
        } );
    };

    /**
     * It moves the container to the next element.
     *
     */
    Paddles.prototype.moveNext = function () {
        this.calculateContainerWidth();
        this.move( {
            direction: "right"
        } );
    };

    /**
     * It implements the logic for the stream.
     *
     */
    Paddles.prototype.move = function ( obj ) {
        var listPositions = this.listPositions.slice( 0 ),
            closest,
            currentScroll = this.streamContainer.scrollLeft;

        /**
         * Using the reduce function to determine where are we at with the
         * scrolling so we can return the current element
         */
        if ( obj.direction === "right" ) {
            closest = listPositions.reduce( function ( prev, curr ) {
                if ( ( Math.abs( curr - currentScroll ) < Math.abs( prev - currentScroll ) ) || ( prev <= currentScroll ) ) {
                    return curr;
                }

                return prev;
            } );
        }

        if ( obj.direction === "left" ) {
            listPositions = listPositions.reverse();
            closest = listPositions.reduce( function ( prev, curr ) {
                if ( ( Math.abs( curr - currentScroll ) <= Math.abs( prev - currentScroll ) ) || ( prev >= currentScroll ) ) {
                    return curr;
                }

                return prev;
            } );
        }

        this.animateStream( this.streamContainer, closest );
    };

    /**
     * Animate function use.
     */
    Paddles.prototype.animateStream = function ( element, position ) {
        /**
         * It checks to see if an animation has been fired if yes will return false.
         * It will prevent weird behaviour if we click multiple times on the element.
         */
        if ( $( element ).filter( ":animated" ).length > 0 ) {
            return false;
        }

        $( element ).stop().animate( {
            scrollLeft: position
        }, 500, "swing" );
    };

