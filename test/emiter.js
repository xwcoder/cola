var isType = function ( type ) {
    return function ( obj ) {
        return {}.toString.call( obj ) == '[object ' + type + ']';
    }
};

var isObject = isType( 'Object' );
var isFunction = isType( 'Function' );
var isArray = Array.isArray || isType( 'Array' );
var isString = isType( 'String' );

var emiter = {

    events: {},

    addEventListener: function ( type, handler, one ) {

        if ( !type || !handler ) {
            return;
        }

        this.events[ type ] = this.events[ type ] || [];
        var handlers = this.events[ type ];

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

        if ( !type || !handler ) {
            return;
        }

        var handlers = this.events[ type ] || [];

        var handlerWrap, index = 0;
        
        while ( index < handlers.length ) {

            handlerWrap = handlers[index];

            if ( handler == handlerWrap.h ) {
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

        var handlers = this.events[ type ] || [];
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
};

emiter.on = emiter.addEventListener;
emiter.off = emiter.removeEventListener;

var assert = require( 'assert' );

describe( 'isObject', function () {

    it( 'object', function () {
        var a = {};
        assert.equal( true, isObject( a ) );

        a = { name: 'creep' };
        assert.equal( true, isObject( a ) );

        a = [12,34]
        assert.equal( false, isObject( a ) );
    } );

    it( 'not object', function () {
        var a = [12,34]
        assert.equal( false, isObject( a ) );
    } );

} );

describe( 'isArray', function () {
    it( 'array', function () {
        var a = [];
        assert.equal( true, isArray( a ) );

        a = [1,2,3];
        assert.equal( true, isArray( a ) );

        a = new Array();
        assert.equal( true, isArray( a ) );
    } );

    it( 'not array', function () {
        var a = {};
        assert.equal( false, isArray( a ) );

        a = function () {};
        assert.equal( false, isArray( a ) );

        a = 'creep';
        assert.equal( false, isArray( a ) );

    } );
} );

describe( 'isFunction', function () {
    it( 'function', function () {
        var a = function () {};
        assert.equal( true, isFunction( a ) );

        a = new Function();
        assert.equal( true, isFunction( a ) );
    } );

    it( 'not function', function () {
        var a = {};
        assert.equal( false, isFunction( a ) );

        a = [];
        assert.equal( false, isFunction( a ) );
    } );
} );

xdescribe( 'emiter.on', function () {
    xit( 'add one', function () {

        emiter.on( 'load',function () {
            console.log( 134 );
        } );

        assert.equal( 1, emiter.events[ 'load' ].length );

        emiter.on( 'load',function () {
            console.log( 134 );
        } );

        assert.equal( 2, emiter.events[ 'load' ].length );
    } );

    it( 'add more time', function () {

        var onload = function () {};

        emiter.on( 'load', onload );
        assert.equal( 1, emiter.events[ 'load' ].length );

        emiter.on( 'load', onload );
        assert.equal( 1, emiter.events[ 'load' ].length );
    } );
} );

describe( 'emiter.off', function () {
    it( 'off', function () {
        var onload = function () {};

        emiter.on( 'load', onload );
        emiter.off( 'load', onload );
        assert.equal( 0, emiter.events[ 'load' ].length );
    } );
} );

describe( 'emiter.emit', function () {

    it( 'emit with no params', function () {
        var a = 0;

        emiter.on( 'add', function () {
            a = 5;
        } );
        emiter.emit( 'add' );
        assert( 5, a );

        emiter.on( 'add', function () {
            a = 10;
        } )
        emiter.emit( 'add' );
        assert( 10, a );
    } );    

    it( 'emit with params', function () {

        var msg, type;

        emiter.on( 'before', function ( _msg, _type ) {
            msg = _msg;
            type = _type;
        } );

        emiter.emit( 'before', 'creep' );
        assert.equal( msg, 'creep' );
        assert.equal( type, 'before');


        emiter.on( 'after', function ( _msg, _type ) {
            msg = _msg;
            type = _type;
        } );

        var obj = {};

        emiter.emit( 'after', obj );
        assert.equal( msg, obj );
        assert.equal( type, 'after');

    } );

    it( 'on with obj', function () {
        var obj = {
            handleEvent: function ( type, msg ) {
                this.type = type;
                this.msg = msg;
            }
        };

        emiter.on( 'start', obj );
        emiter.emit( 'start', 'creep' );
        assert.equal( obj.type, 'start' );
        assert.equal( obj.msg, 'creep' );
    } );
} );

describe( 'emiter.one', function () {
    
    it( 'one one', function () {
        var a = 0;

        emiter.one( 'insert', function () {
            a = a + 5;
        } );

        emiter.emit( 'insert' );
        emiter.emit( 'insert' );
        assert.equal( a, 5 );
        assert.equal( 0, emiter.events[ 'insert' ].length );
    } );
    
    it( 'one more', function () {
        var a = 0;
        emiter.one( 'end1', function () {
            a = 5;
        } );

        emiter.one( 'end2', function () {
            a = 6;
        } );

        emiter.emit( 'end1' );
        emiter.emit( 'end2' );
        assert.equal( 6, a );
        assert.equal( 0, emiter.events[ 'end1' ].length );
        assert.equal( 0, emiter.events[ 'end2' ].length );
    } );
} );
