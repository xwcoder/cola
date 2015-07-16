# cola
一个简单的cmd模块加载器

## 简介
一个简单的cmd模块加载器。遵循"as lazy as possible"的原则。支持加载时的循环依赖, 执行阶段返回空对象。解开循环依赖的[思路](https://github.com/seajs/seajs/issues/1436)。

编译、打包工具[colac](https://github.com/xwcoder/colac) [gulp-colac](https://github.com/xwcoder/gulp-colac)

## api

### [cola.]define()
<pre>
 define( factory );
 define( './lib/dom', factory );
 define( ['./lib/dom'], factory] ); //兼容构建
 define( 'scroll', [ 'dom', 'event' ], factory ); //兼容构建
</pre>
定义一个模块, 后两个api支持使用参数传递依赖, 不推荐使用。这两个api主要用于兼容构建工具优化。    
如果全局空间已经有define的定义, 则将define挂在cola下。

### [cola.]use()
<pre>
 cola.use( callback );
 cola.use( './lib/dom', callback );
 cola.use( ['./lib/dom'], callback] ); 
</pre>
入口函数; 第一个参数为依赖模块, 即callback中要使用的模块; 如果没有通过参数传递依赖, 则通过callback解析依赖, 类似define()。

### [cola.]config
<pre>
 cola.config( {
     path: 'http://js.tv.itcn.com',
     main: 'index.js'
 } );
</pre>
参数配置; 目前只有两个配置参数，
<pre>
  path: 将模块id转换成uri时使用的路径, 默认是当前页面所在的根。如http://localhost/test/base.html -> http://localhost/
  main: 当模块id是目录(即以/结尾)时, 模块的文件名, 默认是index.js。如'./lib/dom' -> './lib/dom/index.js' 
</pre>

### [cola.]alias
<pre>
cola.alias( {
    global: { path: 'http://js.tv.itc.cn/base/core/g_755eb8.js', requires: [ 'jquery' ], exports: 'sohuHD' },
    jquery: { path: 'http://js.tv.itc.cn/base/core/j_1.7.2.js', exports: 'jQuery' },
    winbox: { path : 'http://js.tv.itc.cn/base/plugin/showwin_47c856.js', requires : [ 'jquery', 'global' ], exports: 'sohuHD.showWin' }
} );
</pre>

写这个东西的初衷有两个:    
1、准备写一个stand-alone的html5视频播放器, 所以需要一个stand-alone的模块加载器。这也是不强行占用全局define的原因。    
2、练手
