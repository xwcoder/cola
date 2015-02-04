define( './testlib/logger', function ( require, exports, module ) {
    
    var dom = require( './testlib/dom' );

    module.exports = function ( id ) {
        var el = dom.getById( id );
        return { 
            name: 'logger',
            log: function ( s ) {
                el.innerHTML = el.innerHTML + '<br>' + s;
            }
        };
    }
} );
