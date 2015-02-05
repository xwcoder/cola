define( './testlib/e', function ( require, exports, module ) {
    var f = require( './testlib/f' );
    var h = require( './testlib/h' );

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
define( './testlib/g', function ( require, exports, module ) {
    module.exports = {
        name: 'moduleG'
    };
} );
define( './testlib/h', function ( require, exports, module ) {
    var f = require( './testlib/f' );
    var e = require( './testlib/e' );

    module.exports = {
        name: 'moduleH'
    };
} );
define( './testlib/i', function ( require, exports, module ) {
    var h = require( './testlib/h' );

    module.exports = {
        name: 'moduleI'
    };
} );
