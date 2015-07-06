define( './testlib/a', function ( require, exports, module ) {
    var b = require( './b' );

    module.exports = {
        name: 'moduleA'
    };
} );
define( './testlib/b', function ( require, exports, module ) {
    var c = require( './c' );

    module.exports = {
        name: 'moduleB'
    };
} );
define( './testlib/c', function ( require, exports, module ) {
    var c = require( './d' );

    module.exports = {
        name: 'moduleC'
    };
} );
define( './testlib/d', function ( require, exports, module ) {
    var a = require( './a' );

    module.exports = {
        name: 'moduleD'
    };
} );
