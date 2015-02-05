define( './testlib/a', function ( require, exports, module ) {
    var b = require( './testlib/b' );

    module.exports = {
        name: 'moduleA'
    };
} );
