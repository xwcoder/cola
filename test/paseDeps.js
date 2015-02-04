function removeComments ( code ) {

    return code.replace( /\/\*.*\*\//g, '' )
                .replace( /\/\/.*(?=[\n\t])/g, '')
                .replace( /^\s*\/\*[\s\S]*?\*\/\s*$/mg, '' );
}

var requireReg = /\brequire\(\s*['"](\S*)['"]\s*\)/g;

function unique ( deps ) {
    var ret = [];
    var map = {};

    for ( var i = 0, len = deps.length; i < len; i++ ) {
        if ( !map[ deps[i] ] ) {
            map[ deps[i] ] = 1;
            ret.push( deps[i] );
        }
    }
    return ret;
}

function parseDeps ( code ) {

    code = removeComments( code );

    if ( code.indexOf( 'require' ) == '-1' ) {
        return [];
    }
    
    var deps = [], match;

    while ( match = requireReg.exec( code ) ) {
        deps.push( match[ 1 ] );
    }
    
    return unique( deps );
}

var assert = require( 'assert' );
describe( 'unique', function () {
    it( 'no duplicate', function () {
        var deps = [ './dom', './css', './event' ];
        assert.deepEqual( [ './dom', './css', './event' ], unique( deps ) );
    } );

    it( 'has duplicate', function () {
        var deps = [ './dom', './dom', './css', './event' ];
        assert.deepEqual( [ './dom', './css', './event' ], unique( deps ) );

        deps = [ './dom', './dom', './css', './event', './event' ];
        assert.deepEqual( [ './dom', './css', './event' ], unique( deps ) );

        deps = [ './dom', './dom', './css', './css', './event', './event' ];
        assert.deepEqual( [ './dom', './css', './event' ], unique( deps ) );
    } );
} );

describe( 'parse deps', function () {

    it( 'parse no duplicate', function () {
        var factory = function () {
            var a = 1;
            var b = 2;
            var c = 3;

            var dom = require( './dom' );
            console.log( '123' );
            var css = require( './css' );
            var event = require( './event' );
        };

        assert.deepEqual( [ './dom', './css', './event' ], unique( parseDeps( factory.toString() ) ) );
    } );

    it( 'parse duplicate', function () {
        var factory = function () {
            var a = 1;
            var b = 2;
            var c = 3;

            var dom = require( './dom' );
            console.log( '123' );
            var dom1 = require( './dom' );

            var css = require( './css' );
            var event = require( './event' );
            var event1 = require( './event' );
        };

        assert.deepEqual( [ './dom', './css', './event' ], unique( parseDeps( factory.toString() ) ) );
    } );

} );
