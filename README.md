# kit
一个简单的cmd模块加载器

## 简介
一个简单的cmd模块加载器。只有[kit.]define、kit.use、kit.config三个方法。暂不支持循环依赖。

## api

### [kit.]define()
<pre>
 define( factory );
 define( './lib/dom', factory );
 define( ['./lib/dom'], factory] ); //兼容构建
 define( 'scroll', [ 'dom', 'event' ], factory ); //兼容构建
</pre>
定义一个模块, 后两个api支持使用参数传递依赖, 不推荐使用。这两个api主要用于兼容构建工具优化。    
如果全局空间已经有define的定义, 则将define挂在kit下。

### kit.use()
<pre>
 kit.use( callback );
 kit.use( './lib/dom', callback );
 kit.use( ['./lib/dom'], callback] ); 
</pre>
入口函数; 第一个参数为依赖模块, 即callback中要使用的模块; 如果没有通过参数传递依赖, 则通过callback解析依赖, 类似define()。

### kit.config
<pre>
 kit.config( {
     path: 'http://js.tv.itcn.com',
     main: 'index.js'
 } );
</pre>
参数配置; 目前只有两个配置参数，
<pre>
  path: 将模块id转换成uri时使用的路径, 默认是当前页面所在的根。如http://localhost/test/base.html -> http://localhost/
  main: 当模块id是目录(即以/结尾)时, 模块的文件名, 默认是index.js。如'./lib/dom' -> './lib/dom/index.js' 
</pre>

重复造这个轮子的初衷有两个:    
1、准备写一个stand-alone的html5视频播放器, 所以需要一个stand-alone的模块加载器。这也是不强行占用全局define的原因。    
2、练手
