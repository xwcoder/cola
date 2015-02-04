define( './testlib/css', function ( require, exports, module ) {

    module.exports = {
        addClass: function ( id ) {
            return document.getElementById( id );
        }
    };

} );
