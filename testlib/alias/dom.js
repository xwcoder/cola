define( './testlib/alias/dom', function ( require, exports, module ) {
    
    //var ajax = require( './testlib/ajax' );
    var showWin = require( 'winbox' );

    console.log( showWin );
    module.exports = {

        name: 'dom',

        getById: function ( id ) {
            return document.getElementById( id );
        }
    };

} );
