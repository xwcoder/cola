define( './testlib/dom', function ( require, exports, module ) {
    
    var ajax = require( './ajax' );
    module.exports = {

        name: 'dom',

        getById: function ( id ) {
            return document.getElementById( id );
        }
    };

} );
