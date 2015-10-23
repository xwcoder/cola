(function (global, undefined) {

    'use strict';

    var cola = {
        version: '1.0.0'
    };

    var noop = function () {};

    var extend = function (o, c) {

        if ( c && typeof c == 'object' ) {
            for ( var p in c ) {
                o[p] = c[p];
            }
        }
    };
    
    var isType = function (type) {
        return function (obj) {
            return {}.toString.call(obj) == '[object ' + type + ']';
        };
    };

    var isObject = isType('Object');
    var isFunction = isType('Function');
    var isArray = Array.isArray || isType('Array');
    var isString = isType('String');

    var emiter = {

        events: {},

        on: function (type, handler, one) {

            if ( !type || !handler ) {
                return;
            }

            this.events[type] = this.events[type] || [];
            var handlers = this.events[type];

            var handlerWrap, has;

            for ( var index = handlers.length - 1; index >= 0; index-- ) {

                handlerWrap = handlers[index];
                if ( handlerWrap.h == handler ) {
                    has = true;
                    break;
                }
            }
            
            if ( !has ) {
                handlers.push({ h: handler, one: one });
            }
        },

        emit: function (type, msg) {

            if ( !type ) {
                return;
            }

            var handlers = this.events[type] || [];
            var handlerWrap, h, index = 0;

            while ( index < handlers.length ) {

                handlerWrap = handlers[index];
                h = handlerWrap.h;

                if ( isFunction(h) ) {
                    h.call(null, msg, type);
                } else if ( isObject(h) && isFunction(h.handleEvent) ) {
                    h.handleEvent.call(h, type, msg);
                }

                if ( handlerWrap.one ) {
                    handlers.splice(index, 1);
                } else {
                    index++;
                }
            }
        },

        one : function (type, handler) {
            this.on(type, handler, true);
        }
    };

    //脚本加载
    var loader = {

        currentAddingScript: null,

        interactiveScript: null,

        head: document.head || document.getElementsByTagName('head')[0] || document.documentElement,

        // http://goo.gl/U7ANEY
        load: function (url, callback, charset) {
            callback = callback || noop;

            var self = this;
            var head = this.head;
            var script = document.createElement('script');

            script.setAttribute('type', 'text/javascript');
            script.setAttribute('async', true);

            if ( charset ) {
              script.charset = charset;
            }

            script.src = url;

            function onLoad () {

                script.onerror = script.onload = script.onreadystatechange = null;            

                if ( head && script.parentNode ) {
                    head.removeChild(script);
                }

                script = null;

                callback();
            }

            if ( 'onload' in script ) {
                script.onload = onLoad;
            } else {
                script.onreadystatechange = function () {
                    if ( /loaded|complete/.test(script.readyState) ) {
                        onLoad();
                    }
                };
            }

            script.onerror = function (e) {
                onLoad();
            };

            this.currentAddingScript = script;

            head.insertBefore(script, head.firstChild);

            this.currentAddingScript = null;
        },

        // http://goo.gl/bnu78W
        getCurrentScript: function () {

            if ( this.currentAddingScript ) {
                return this.currentAddingScript;
            }
            
            var interactiveScript = this.interactiveScript;
            if ( interactiveScript && interactiveScript.readyState == 'interactive' ) {
                return interactiveScript;
            }

            var scripts = this.head.getElementsByTagName('script');
            var script;

            for ( var i = scripts.length - 1; i >= 0; i-- ) {
                script = scripts[i];
                if ( script.readyState == 'interactive' ) {
                    this.interactiveScript = script;
                    return this.interactiveScript;
                }
            }
        }
    };

    //缓存模块 { uri: mod }
    var cache = {};

    // 配置项
    var config = {
        path: (function () {
            var nodes = document.getElementsByTagName( 'script' );
            var node = nodes[nodes.length - 1];
            ///^(.+:\/\/.+?)(?:\/|$)/.exec( node.src );
            /^(.+:\/\/.+)(?:\/)/.exec( node.src );
            return RegExp.$1;
        })(),
        main: 'index.js'
    };

    var alias = config.alias = {};

    var anonyMeta;

    var STATUS = {

        META: 10, //生成模块的meta信息

        FETCHING: 20, //正在加载文件

        FETCHED: 30, //文件加载完毕, 即define执行完

        LOADING: 40, //加载依赖

        LOADED: 50, //依赖加载完毕

        EXECUTING: 60, //正在执行

        DONE: 70 //执行完毕
    };

    var gid = 0;
    
    function genAnonyId () {
        return '_cola_anony_mod_' + gid++;
    }

    //function removeComments (code) {

    //    return code.replace(/\/\*.*\*\//g, '')
    //                .replace(/\/\/.*(?=[\n\t])/g, '')
    //                .replace(/^\s*\/\*[\s\S]*?\*\/\s*$/mg, '');
    //}

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

    function unique (deps) {
        var ret = [];
        var map = {};

        for ( var i = 0, len = deps.length; i < len; i++ ) {
            if ( !map[deps[i]] ) {
                map[deps[i]] = 1;
                ret.push(deps[i]);
            }
        }
        return ret;
    }

    var requireReg = /\brequire\(\s*['"](\S*)['"]\s*\)/g;

    function parseDeps (code) {

        code = removeComments(code);

        if ( code.indexOf('require') == '-1' ) {
            return [];
        }
        
        var deps = [], match;

        while ( match = requireReg.exec(code) ) {
            deps.push(match[1]);
        }
        
        return unique(deps);
    }

    function formatUri (uri) {
        return uri = uri.split('?')[0].split('#')[0];
    }

    var REG_DOT_SLASH = /\/\.\//g;
    var REG_MULTI_SLASH = /([^:])\/+\//g;
    var REG_DOUBLE_SLASH = /\/[^\/]+\/\.\.\//;
    var REG_HAS_PROTOCAL = /^[^:\/]+:\/\//;
    var REG_DIR_NAME = /\/[^\/]*\.[^\/]*$/;

    function getAlias (id) {
        return alias[id];
    }

    function id2Uri (id, relativeUri) {

        if ( !isString(id) ) {
            return;
        }

        var _id = id;
        if ( getAlias(id) ) {
            id = getAlias(id).path;
        }
        
        if ( REG_HAS_PROTOCAL.test(id) ) {
            return id;
            //return formatUri(id);
        }

        var path = config.path;

        // if id start with './' or '../' and relativeUri has protocal, 
        // then use id and relativeUri to generate module's uri
        if ( ( id.indexOf('../') == 0 || id.indexOf('./') == 0 )
                && relativeUri
                //&& REG_HAS_PROTOCAL.test(relativeUri)
                ) {
            path = relativeUri.replace(REG_DIR_NAME, '');
        }

        var uri = path + '/' + id;

        uri = uri.replace(REG_DOT_SLASH, '/').replace(REG_MULTI_SLASH, '$1/');

        while ( REG_DOUBLE_SLASH.test(uri) ) {
            uri = uri.replace(REG_DOUBLE_SLASH, '/');
        }

        if ( !getAlias(_id) ) {
            uri = formatUri(uri);

            if ( uri[uri.length-1] == '/' ) {
                uri = uri + config.main;
            } else if ( uri.substring(uri.length - 3) != '.js' ) {
                uri = uri + '.js';
            }
        }

        return uri;
    }

    var fetchingCount = 0;
    var loadingModules = {};

    function Module (uri, deps, factory) {

        this.uri = uri;
        this.deps = deps || [];
        this.factory = factory;

        this.exports = {};
    }

    extend( Module.prototype, {

        onload: function () {
            if ( this.status >= STATUS.LOADED ) {
                return;
            }
            this.status = STATUS.LOADED;
            emiter.emit(this.uri, this);
        },

        fetch: function () {
            
            if ( this.isAlias ) {
                this.aliasFetch();
                return;
            }

            var self = this;

            if ( this.status < STATUS.FETCHING ) { //未获取文件

                this.status = STATUS.FETCHING;

                fetchingCount++;
                loader.load(this.uri, function () {
                    if ( anonyMeta ) {
                        self.factory = anonyMeta.factory;
                        self.deps = anonyMeta.deps;
                    }
                    anonyMeta = null;
                    self.status = STATUS.FETCHED;

                    fetchingCount--;
                    self.load();
                });
            }
        },

        aliasFetch: function () {

            if ( this.status >= STATUS.FETCHING ) {
                return;
            }

            var self = this;
            var depsReady = 0;
            var depReadyhandler = function () {

                depsReady -= 1;

                if ( depsReady <= 0 ) {

                    fetchingCount++;
                    loader.load(self.uri, function () {

                        fetchingCount--;
                        self.onload();

                        Module.release();
                    });
                }
            };

            this.status = STATUS.FETCHING;
            var deps = this.deps || [];
            var mod, uri, id;

            for ( var i = deps.length - 1; i >= 0; i-- ) {
                id = deps[i];
                uri = id2Uri( id );
                mod = Module.get( uri );
                if ( !mod ) {
                    mod = Module.create( { id: id, uri: uri } );
                }
                if ( mod.status < STATUS.LOADED ) {
                    depsReady += 1;
                    emiter.one(uri, depReadyhandler);

                    mod.fetch();
                }
            }

            if ( depsReady == 0 ) {
                depReadyhandler();
            }
        },

        load: function () {

            var self = this;

            if ( this.status < STATUS.FETCHING ) { //未获取文件
                this.fetch();
                return;
            }

            if ( this.status <= STATUS.FETCHING || this.status >= STATUS.LOADING ) {
                return;
            }

            // 加载依赖
            this.status = STATUS.LOADING;
            
            loadingModules[self.uri] = self;
            
            var deps = this.deps;
            var mod, uri, id;

            var depsReady = 0;

            function depReadyhandler () {
                depsReady -= 1;

                if ( depsReady == 0 ) {
                    self.onload();
                }
            }

            var toLoad = [];

            for ( var i = deps.length - 1; i >= 0; i-- ) {

                id = deps[i];
                uri = id2Uri(id, self.uri);
                mod = Module.get(uri);

                if ( !mod ) {
                    mod = Module.create({ id: id, uri: uri });
                }

                if ( mod.status < STATUS.LOADED ) {
                    
                    depsReady += 1;
                    emiter.one(uri, depReadyhandler);

                    if ( mod.status <= STATUS.FETCHED ) {
                        mod.fetch();
                    } else {
                        toLoad.push(mod);
                    }
                }
            }

            if ( depsReady == 0 ) {
                self.onload();
            } else {

                for ( i = toLoad.length - 1; i >= 0; i-- ) {
                    toLoad[i].load();
                }

                Module.release();
            }
        },

        exec: function () {

            if ( this.status == STATUS.DONE ) {
                return;
            }

            var relativeUri = this.uri;

            function require (id) {
                return Module.require(id, relativeUri);
            }

            if ( this.isAlias ) {

                var alias = this.alias || {};
                if ( isString(alias.exports) ) {
                    this.exports = global[alias.exports];
                    var exports = alias.exports.split('.');
                    var sup = global;
                    for ( var i = 0, len = exports.length; i < len; i++ ) {
                        this.exports = sup[exports[i]];
                        sup = this.exports;
                    }
                }

            } else {
                var factory = this.factory;

                this.status = STATUS.EXECUTING;

                factory(require, this.exports, this);
            }

            this.status = STATUS.DONE;

            delete this.factory;
            delete this.deps;
        }
    } );

    extend( Module, {

        //解开循环依赖
        release: function () {

            if ( fetchingCount > 0 ) {
                return;
            }

            var uri, mod;

            for ( uri in loadingModules ) {
                mod = loadingModules[uri];
                if ( mod.status == STATUS.LOADING ) {
                    mod.onload();
                }
            }
            loadingModules = {};
        },

        get: function (uri) {
            return cache[uri];
        },

        create: function (meta) {

            var mod = this.get(meta.uri);
            var alias;

            if ( !mod ) {

                if ( meta.id ) {
                    alias = getAlias(meta.id);
                    if ( alias ) {
                        meta.deps = alias.requires || [];
                    }
                }

                mod = new Module(meta.uri, meta.deps, meta.factory);

                mod.alias = alias;
                mod.isAlias = !!alias;

                if ( mod.factory ) {
                    mod.status = STATUS.FETCHED;
                } else {
                    mod.status = STATUS.META;
                }
                
                cache[mod.uri] = mod;
            } else {
                mod.factory = meta.factory;
                mod.deps = meta.deps;
            }

            return mod;
        },

        require: function (id, relativeUri) {

            var mod = this.get(id2Uri(id, relativeUri));

            if ( mod.status < STATUS.EXECUTING ) {
                mod.exec();
            }

            return mod.exports;
        }
    } );

    /**
     * define( factory );
     * define( './lib/dom', factory );
     * define( ['./lib/dom', factory] );
     * define( 'scroll', [ 'dom', 'event' ], factory ); //兼容构建后
     *
     * define时, 依赖的模块如果是绝对路径(非'./'或者'../'开头), 计算时使用config.path;
     * 依赖的模块如果是相对路径(以'./'或者'../'开头), 计算时使用模块的uri。
     */
    cola.define = function () {

        var id, factory, deps;
        var args = [].slice.call(arguments);

        switch (args.length) {

            case 3:
                id = args[0];
                factory = args[2];
                deps = args[1];
                break;

            case 2:
                factory = args[1];
                if ( isArray(args[0]) ) {
                    deps = args[0];
                } else {
                    id = args[0];
                    deps = parseDeps(factory.toString());
                }
                break;
            case 1:
                factory = args[0];
                deps = parseDeps(factory.toString());
        }

        var meta = {
            uri: id2Uri(id),
            deps: deps,
            factory: factory
        };

        if ( !meta.uri && document.attachEvent  ) {
            var script = loader.getCurrentScript();
            if ( script ) {
                meta.uri = script.src;
            }
        }

        meta.uri ? Module.create(meta) : anonyMeta = meta;
    };
    
    /**
     * just匿名模块
     * cola.use( factory );
     * cola.use( './lib/dom', factory );
     * cola.use( ['./lib/dom', './lib/ajax'], factory );
     * 
     * config.use时, 路径都是相对config.path, 不管是相对路径或是绝对路径
     * 原因: 无法兼容获取当前运行脚本的路径(src)
     *  1. document.currentScript
     *      Firefox 4+, Chrome 29+, Opera 16+, Safari 8+.
     *  2. readyState属性为interative的script元素, 见getCurrentScript
     *      IE5-9
     *  3. document.scripts[document.scripts.length - 1].src
     *      不适用异步加载的情况
     *  4. 制造异常，使用error的属性
     *      IE10+, Safari 7-, Opera 15-.
     *      但是得到的是出错函数所在脚本路径{cola.js}, 而不是使用cola.use的脚本路径
     */
    cola.use = function () {

        var args = [].slice.call( arguments );
        var deps, factory;
        
        switch (args.length) {
            case 2:
                deps = args[0];
                factory = args[1];
                break;
            case 1:
                factory = args[0];
                deps = parseDeps(factory.toString());
        }

        var meta = {
            uri: genAnonyId(),
            deps: isArray(deps) ? deps : [deps],
            factory: factory || noop
        };

        var mod = Module.create(meta);
        emiter.one(mod.uri, function () {
            mod.exec();
        });

        mod.load();

        return cola;
    };

    cola.config = function (_config) {
        extend(config, _config);
        return cola;
    };

    cola.alias = function (_alias) {
        extend(alias, _alias);
    };
    
    cola.cache = cache;
    global.cola = cola;

    if ( !global.define ) {
        global.define = cola.define;
    }

} )(this);
