define( './testlib/e', function ( require, exports, module ) {
    var f = require( './f' );
    var h = require( './h' );

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
define( './testlib/g', function ( require, exports, module ) {
    module.exports = {
        name: 'moduleG'
    };
} );
define( './testlib/h', function ( require, exports, module ) {
    var f = require( './f' );
    var e = require( './e' );

    module.exports = {
        name: 'moduleH'
    };
} );
define( './testlib/i', function ( require, exports, module ) {
    var h = require( './h' );

    module.exports = {
        name: 'moduleI'
    };
} );
