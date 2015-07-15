var factory = function ( id /** id这是id**/, name ) {
    
    //这是t1
    //这是t1第二行
    var t1 = new Date();
    var t2 = new Date();//这是t2

    /**这是t3**/
    var t3 = new Date(); /**这是t3**/
    
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

    var href = 'http://' + name + '//' + age; //'这是行尾注释'

    var href2 = 'http://' + name + '//' + age; //"这是行//尾注释" 

    var tmpl = 'xxx/**hello world***/' + name +  + age; /**这是行尾注释**/

    var name = 'creep';
};

function removeComments ( code ) {
    //return code.replace( /\/\*.*\*\//g, '' )
                //.replace(/\/\/.*(?=[\n\t])/g, '')
    code = code.replace(/^\s*\/\/.*(?=[\n\t])/mg, '') //单行注释
                .replace( /^\s*\/\*[\s\S]*?\*\/\s*$/mg, '' ); //多行注释

    var char,
        s = '',
        index = 0,
        startQuote,
        isDoubleSlashComment = false,
        isAsteriskComment = false;
    
    while ( char = code[index++] ) {
        
        //匹配单引号或者双引号字符串
        if ( !isDoubleSlashComment && !isAsteriskComment && (char == "'" || char == '"') ) {
            if ( !startQuote ) {
                startQuote = char;
            } else if ( startQuote == char ) {
                startQuote = '';
            }
        }

        if ( startQuote ) {
            s += char;
            continue;
        }

        if ( isDoubleSlashComment || isAsteriskComment ) {
            if ( isDoubleSlashComment ) {
                if ( char == '\n' ) {
                    isDoubleSlashComment = false;
                }
            } else {
                if ( char == '/' && code[index-2] == '*' ) {
                    isAsteriskComment = false;
                }
            }
        } else {
            if ( char == '/' && code[index] == '/' ) { //行尾双斜线注释开始
                isDoubleSlashComment = true;
            } else if ( char == '/' && code[index] == '*' ) { //单行星号注释
                isAsteriskComment = true;
            } else {
                s += char;
            }
        }
    }

    return s;
}

console.log( removeComments( factory.toString() ) );
