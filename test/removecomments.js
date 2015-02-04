var factory = function ( id /** id这是id**/ ) {
    
    //这是t1
    //这是t1第二行
    var t1 = new Date();
    var t2 = new Date();//这是t2

    /**这是t3**/
    var t3 = new Date();
    
    /**
     * 这是第一个block注释
     *
     */
    var f1 = function () {
    
    };
    
    /**
     * 这是第二个block注释
     *
     */
    var t3 = f1();
};

function removeComments ( code ) {

    return code.replace( /\/\*.*\*\//g, '' )
                .replace( /\/\/.*(?=[\n\t])/g, '')
                .replace( /^\s*\/\*[\s\S]*?\*\/\s*$/mg, '' );
}

console.log( removeComments( factory.toString() ) );
