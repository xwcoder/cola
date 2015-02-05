define( './testlib/b', function ( require, exports, module ) {
    var c = require( './testlib/c' );

    module.exports = {
        name: 'moduleB'
    };
} );
