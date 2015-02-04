function id2Uri ( id, path ) {

    var uri = path;
    var m = /^([a-zA-Z]+:\/\/)(.*)/.exec( path );
    var uri, protocal;
    if ( m ) {
        protocal = m[1];
        uri = m[2];
    }
    
    uri = uri.split( '/' );
    path = id.split( '/' );
    
    if ( uri[uri.length-1] == '' ) {
        uri = uri.slice(0, -1);
    }

    var i = 0, p;
    while ( i < path.length ) {
        p = path[i];
        i++;
        if ( p == '.' || p == '' ) {
            continue;
        } 

        if ( p == '..' ) {
            uri.pop();
            continue;
        }
        uri.push( p );
    }
    uri = uri.join( '/' )
    return protocal ? protocal + uri : uri;
}

var REG_DOT_SLASH = /\/\.\//g;
var REG_MULTI_SLASH = /([^:])\/+\//g;
var REG_DOUBLE_SLASH = /\/[^\/]+\/\.\.\//;

function id2Uri2 ( id, path ) {
    var uri = path + '/' + id;

    uri = uri.replace( REG_DOT_SLASH, '/' ).replace( REG_MULTI_SLASH, '$1/' );

    while ( REG_DOUBLE_SLASH.test( uri ) ) {
        uri = uri.replace( REG_DOUBLE_SLASH, '/' );
    }

    return uri;
}

var assert = require( 'assert' );

xdescribe( 'id2uri-v1', function () {
    
    it( 'absolute', function () {
        var path, id;

        path = 'http://js.tv.itc.cn';
        id = './lib/dom';
        assert.equal( 'http://js.tv.itc.cn/lib/dom', id2Uri( id, path ) );

        path = 'http://js.tv.itc.cn/base';
        id = './lib/dom';
        assert.equal( 'http://js.tv.itc.cn/base/lib/dom', id2Uri( id, path ) );

        path = 'http://js.tv.itc.cn/base';
        id = '../lib/dom';
        assert.equal( 'http://js.tv.itc.cn/lib/dom', id2Uri( id, path ) );
    } );

    it( 'relative', function () {
        var path, id;

        path = './';
        id = './lib/dom';
        assert.equal( './lib/dom', id2Uri( id, path ) );
    } );

} );

describe( 'id2uri-v2', function () {
    it( 'absolute', function () {
        var path, id; 

        path = 'http://js.tv.itc.cn/base';
        id = './//lib////dom';
        assert.equal( 'http://js.tv.itc.cn/base/lib/dom', id2Uri2( id, path ) );

        path = 'http://js.tv.itc.cn/base';
        id = '..//lib/dom';
        assert.equal( 'http://js.tv.itc.cn/lib/dom', id2Uri2( id, path ) );

        path = 'http://js.tv.itc.cn/base/core/plugin';
        id = '..//lib/../dom';
        assert.equal( 'http://js.tv.itc.cn/base/core/dom', id2Uri2( id, path ) );
    } );
} );
