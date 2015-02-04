var express = require( 'express' );
var app = express();

app.use( '/', express.static( __dirname ) );
app.listen( 4000 );

try {
    var ip = require( 'os' ).networkInterfaces()[ 'en0' ][ 1 ].address;
    console.log( ip );
} catch ( e ) {}
