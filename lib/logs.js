define( 'lib/log', function ( require, module, exports ) {
    
    var dom = require( 'lib/dom' );
    var event = require( 'lib/event' );

    var el = dom.getById( '#log' );

    module.exports = {

        printf: function ( s ) {
            el.innerHTML = el.innerHTML + '<br>' + s;
        }
    };
} );
