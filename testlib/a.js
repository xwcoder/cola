define( './testlib/a', function ( require, exports, module ) {
    var b = require( './b' );

    module.exports = {
        name: 'moduleA'
    };
} );
