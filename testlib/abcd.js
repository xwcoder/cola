define( './testlib/a', function ( require, exports, module ) {
    var b = require( './testlib/b' );

    module.exports = {
        name: 'moduleA'
    };
} );
define( './testlib/b', function ( require, exports, module ) {
    var c = require( './testlib/c' );

    module.exports = {
        name: 'moduleB'
    };
} );
define( './testlib/c', function ( require, exports, module ) {
    var c = require( './testlib/d' );

    module.exports = {
        name: 'moduleC'
    };
} );
define( './testlib/d', function ( require, exports, module ) {
    var a = require( './testlib/a' );

    module.exports = {
        name: 'moduleD'
    };
} );
