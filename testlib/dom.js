define( './testlib/dom', function ( require, exports, module ) {

    module.exports = {

        name: 'dom',

        getById: function ( id ) {
            return document.getElementById( id );
        }
    };

} );
