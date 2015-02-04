define( './lib/dom', function ( require, exports, module ) {

    var event = require( './lib/event' );

    module.exports = {
        getById: function ( id ) {
            return document.getElementById( id );
        }
    };

} );

define( './lib/dom2', function ( require, exports, module ) {
    //var css = require( './lib/css' );

    module.exports = {
        getByClassName: function () {
        
        }
    };
} );
