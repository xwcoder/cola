define( './testlib/css', function ( require, exports, module ) {

    module.exports = {
        addClass: function ( id ) {
            return document.getElementById( id );
        }
    };

} );
define( './testlib/logger', function ( require, exports, module ) {
    
    var dom = require( './dom' );

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
