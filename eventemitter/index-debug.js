define( function ( require, exports, module ) {

    var isObject = isType( 'Object' );
    var isFunction = isType( 'Function' );
    var isArray = Array.isArray || isType( 'Array' );
    var isString = isType( 'String' );

    var extend = function ( o, c ) {

        if ( c && typeof c == 'object' ) {
            for ( var p in c ) {
                o[ p ] = c[ p ];
            }
        }
    };

    function EventEmitter () {
        this.__events = {};
    }
    
    extend( EventEmitter.prototype, {

        addEventListener: function ( type, handler, one ) {

            if ( !type || !handler ) {
                return;
            }

            this.__events[ type ] = this.__events[ type ] || [];
            var handlers = this.__events[ type ];

            var handlerWrap, has;

            for ( var index = handlers.length - 1; index >= 0; index-- ) {

                handlerWrap = handlers[index];
                if ( handlerWrap.h == handler ) {
                    has = true;
                    break;
                }
            }
            
            if ( !has ) {
                handlers.push( { h: handler, one: one } );
            }
        },

        removeEventListener: function ( type, handler ) {

            if ( !type && !handler ) {
                this.__events = {};
                return;
            }

            if ( !handler ) {
                delete this.__events[ type ];
                return;
            }

            var handlers = this.__events[ type ] || [];

            var handlerWrap, index = 0;
            
            while ( index < handlers.length ) {

                handlerWrap = handlers[index];

                if ( handler === handlerWrap.h ) {
                    handlers.splice( index, 1 );
                } else {
                    index++;
                }
            }
        },

        emit: function ( type, msg ) {

            if ( !type ) {
                return;
            }

            var handlers = this.__events[ type ] || [];
            var handlerWrap, h, index = 0;

            while ( index < handlers.length ) {

                handlerWrap = handlers[index];
                h = handlerWrap.h;

                if ( isFunction( h ) ) {
                    h.call( null, msg, type );
                } else if ( isObject( h ) && isFunction( h.handleEvent ) ) {
                    h.handleEvent.call( h, type, msg );
                }

                if ( handlerWrap.one ) {
                    handlers.splice( index, 1 );
                } else {
                    index++;
                }
            }
        },

        one : function ( type, handler ) {
            this.addEventListener( type, handler, true );
        }
    } );

    EventEmitter.prototype.on = EventEmitter.prototype.addEventListener;
    EventEmitter.prototype.off = EventEmitter.prototype.removeEventListener

    function addEventEmitter ( obj ) {

        extend( obj, {

            __emitter: new EventEmitter(),

            on: function ( type, handler, one ) {
                this._emitter.on( type, handler, one );
            },

            off: function ( type, handler ) {
                this.__emitter.off( type, handler );            
            },
            
            one: function ( type, handler ) {
                this.__emitter.one( type, handler );
            },

            emit: function ( type, data ) {
                this.__emitter.emit( type, data );
            }
        } );

        return obj;
    }

    module.exports = {
        EventEmitter: EventEmitter,
        addEventEmitter: addEventEmitter
    };
} );
