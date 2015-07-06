define( './testlib/e', function ( require, exports, module ) {
    var f = require( './f' );
    var g = require( './g' );

    module.exports = {
        name: 'moduleE'
    };
} );
define( './testlib/f', function ( require, exports, module ) {
    var i = require( './i' );

    module.exports = {
        name: 'moduleF'
    };
} );
define( './testlib/i', function ( require, exports, module ) {
    var h = require( './h' );

    module.exports = {
        name: 'moduleI'
    };
} );
