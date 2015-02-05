define( './testlib/e', function ( require, exports, module ) {
    var f = require( './testlib/f' );
    var g = require( './testlib/g' );

    module.exports = {
        name: 'moduleE'
    };
} );
define( './testlib/f', function ( require, exports, module ) {
    var i = require( './testlib/i' );

    module.exports = {
        name: 'moduleF'
    };
} );
define( './testlib/i', function ( require, exports, module ) {
    var h = require( './testlib/h' );

    module.exports = {
        name: 'moduleI'
    };
} );
