// 重新配置插件项
config.plugins = [
    // 位于开发环境下
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: '"development"'
        }
    }),
    // 提取css单文件的名字，路径和生产环境下的不同，要与修改后的publickPath相结合
    new ExtractTextPlugin("[name].[contenthash].css"),    
    // 提取入口文件里面的公共模块
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendors',
        filename: 'vendors.js',
    }),    
    // 为组件分配ID，通过这个插件webpack可以分析和优先考虑使用最多的模块，并为它们分配最小的ID
    new webpack.optimize.OccurenceOrderPlugin(),
    // 模块热替换插件
    new webpack.HotModuleReplacementPlugin(),
    // 允许错误不打断程序
    new webpack.NoErrorsPlugin(),
    // 全局挂载插件
    new webpack.ProvidePlugin({
        $:"jquery",
        jQuery:"jquery",
        "window.jQuery":"jquery"
    })        
];
// vue里的css也要单独提取出来
config.vue = {
    loaders: {
        css: ExtractTextPlugin.extract("css")
    }
};
// 启用source-map，开发环境下推荐使用cheap-module-eval-source-map
config.devtool='cheap-module-eval-source-map';
// 为了实现热加载，需要动态向入口配置中注入 webpack-hot-middleware/client ，路径相对于本文件所在的位置
// var devClient = 'webpack-hot-middleware/client';
// 为了修改html文件也能实现热加载，需要修改上面的devClient变量，引入同级目录下的dev-client.js文件
var devClient = './build/dev-client';
// Object.keys()返回对象的可枚举属性和方法的名称
Object.keys(config.entry).forEach(function (name, i) {
    var extras = [devClient];
    config.entry[name] = extras.concat(config.entry[name]);
})
module.exports = config;
//webpack.prod.config.js//（生产环境下的配置文件）
// 引入基本配置
var config = require('./webpack.config');
// 重新配置插件项
config.plugins = [
    // 位于生产环境下
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: '"production"'
        }
    }),
    // 压缩js代码
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        },
        // 排除关键字，不能混淆
        except:['$','exports','require']
    }),

];
// 开启source-map，生产环境下推荐使用cheap-source-map或source-map，后者得到的.map文件体积比较大，但是能够完全还原以前的js代码
config.devtool='source-map';
// 关闭source-map
// config.devtool=false;
module.exports = config;
//.dev-server.js（服务器配置文件）
// 创建一个express实例
var app = express();

// 对网站首页的访问返回 "Hello World!" 字样
app.get('/', function (req, res) {
    res.send('Hello World!');
});
// 调用webpack并把配置传递过去
var compiler = webpack(config);
// 使用 webpack-dev-middleware 中间件，搭建服务器
var devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: config.output.publicPath,
    stats: {
        colors: true,
        chunks: false
    }
})
// 使用 webpack-hot-middleware 中间件，实现热加载
var hotMiddleware = require('webpack-hot-middleware')(compiler);
// 为了修改html文件也能实现热加载，使用webpack插件来监听html源文件改变事件
compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
        // 发布事件
        hotMiddleware.publish({ action: 'reload' });
        cb();
    })
});
// 注册中间件
app.use(devMiddleware);
app.use(hotMiddleware);

// 监听 8888 端口，开启服务器
app.listen(8888, function (err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log('Listening at http://localhost:8888');
})

//.dev-client.js（配合dev-server.js监听html文件改动也能够触发自动刷新）
// 引入 webpack-hot-middleware/client 
var hotClient = require('webpack-hot-middleware/client');
// 订阅事件，当 event.action === 'reload' 时执行页面刷新
hotClient.subscribe(function (event) {
    if (event.action === 'reload') {
        window.location.reload();
    }
})
// 指定构建别名：webpack --display-modules --display-chunks --config build/webpack.config.js这条长命令，我们在package.js文件中修改“scripts”项：
"scripts": {
  "build":"webpack --display-modules --display-chunks --config build/webpack.config.js",
  "dev":"node ./build/dev-server.js"
}

/*
循环换气可分为四步进行：
一是先闭住嘴，将腹腔四周肌肉扩张，使腹内气压小于体外，气流自然就通过鼻腔抽进肺里。
二是我们口腔里存在一个空间，自然也就存在一点气体，把这点气挤出来（而不是吹出来）就能振动葫芦丝的簧片，发出声音。
三是练习抽气和挤气必须同时进行，绝不可一先一后，这是循环换气的关键。先练快换气，再练慢换气，练会换气过程长一点，吸气就可以多一点，深一点。
四是练习让挤气和吹气的力度达到一致。由挤气转换成吹气的衔接处，声音往往会抖一下。这是由于挤的气弱，吹的气强，强气流突然冲动簧片的缘故。
练习时可先控制吹气的力度，使之与挤气的力度一致，声音就平稳了。这是循环换气的第二个关键。

学习循环换气的具体练习步骤：
第一，首先练习'口腔挤腮吐气，同时鼻吸气'。1、扩大口腔可储存一定体积的气，如鼓腮。
但这里不要求过分鼓腮，适当鼓腮就可。要从横向和竖向这两个方面来扩大口腔。
横向扩大口腔可用鼓腮法；竖向扩大口腔可用发'呕'音或'我'音的方法来体会（但不可发出音），也就是口腔下巴向下运动。
2、停止正常呼气，腮向内挤压吐气，实际是将口腔内的气挤压出去。这个动作可单独练习。
3、练习鼻子快速吸气到腹部（腹部要向外膨胀）。这个动作可单独练习。
4、练习'挤腮吐气和鼻吸气同时进行'。这两个动作同时进行，刚开始不习惯，因为一心不能二用。但练几天就习惯了。

总结：
1、鼻吸气完成时间要小于挤腮吐气完成时间，如挤腮吐气时间为4秒，则鼻吸气时间为1至2秒。
2、初学向里挤压腮时，可以不用力挤，习惯后再稍加用力挤压腮。
3、鼻吸气不要过猛过快，也不可太慢，鼻吸气尽量不要发出吸气声音，有一点声音为正常。
第二，练习'嘴正常呼气到扩大口腔储气'。
嘴正常呼气（指平时吹葫芦丝那样的呼气），然后过渡到扩大口腔储气，这个过程嘴正常呼气一直保持着。
第三，以上两个步骤练顺后就可以开始操练循环换气的全过程了。

空嘴来操练循环换气的全过程：
第一步，'嘴正常呼气'（用腹式或胸腹式呼吸法）
第二步，'口腔储存气'（保持第一步的正常呼气，扩大口腔容积，呼气还不能停止）
第三步，'口腔挤腮吐气，同时鼻吸气'（上一步的呼气停止，变为挤腮嘴吐气，同时鼻子快速吸气到腹部，不要吸得过满）
第四步，'接气'（口腔内还剩一半或三分之一多的气未挤完，继续挤腮吐气，同时将上一步吸到腹内的气慢慢呼出，与挤腮产生的气合在一起呼）
（许多人采用吸管对着一杯水吹气，若是气泡可以不间断地产生，则算会了）
在葫芦丝上学练循环换气：
当空嘴学练循环换气稍熟后
注意和要点：
一、'口腔挤腮吐气，同时鼻吸气'是关键，要多加练习，可单独练习。鼻子吸气过程要短于挤腮过程。
二、不要等到上口气快呼完了才开始循环换气。上口气呼出一半或三份之二时就要开始下一个循环换气了。
三、接气是个难点，要平稳过渡（也叫软着陆），音量不要突然增大或减小。当然这需长期练习才能做到。
*/
/*
重要的是要记住，在 webpack 配置中定义 rules 时，要定义在 module.rules 而不是 rules 中。为了使你受益于此，如果没有按照正确方式去做，webpack 会给出警告。
请记住，使用正则表达式匹配文件时，你不要为它添加引号。也就是说，/\.txt$/ 与 '/\.txt$/'/ "/\.txt$/" 不一样。前者指示 webpack 匹配任何以 .txt 结尾的文件，后者指示 webpack 匹配具有绝对路径 '.txt' 的单个文件; 这可能不符合你的意图。
在使用 loader 时，可以阅读 loader 章节 查看更深入的自定义配置。

插件(plugin) 
loader 用于转换某些类型的模块，而插件则可以用于执行范围更广的任务。包括：打包优化，资源管理，注入环境变量。

插件接口(plugin interface) 功能极其强大，可以用来处理各种各样的任务。
想要使用一个插件，你只需要 require() 它，然后把它添加到 plugins 数组中。多数插件可以通过选项(option)自定义。你也可以在一个配置文件中因为不同目的而多次使用同一个插件，这时需要通过使用 new 操作符来创建它的一个实例。

webpack.config.js

const HtmlWebpackPlugin = require('html-webpack-plugin'); // 通过 npm 安装
const webpack = require('webpack'); // 用于访问内置插件

module.exports = {
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({template: './src/index.html'})
  ]
};
在上面的示例中，html-webpack-plugin 为应用程序生成 HTML 一个文件，并自动注入所有生成的 bundle。

webpack 提供许多开箱可用的插件！查阅 插件列表 获取更多。
在 webpack 配置中使用插件是简单直接的，然而也有很多值得我们进一步探讨的用例。查看这里了解更多。

模式(mode) 
通过选择 development, production 或 none 之中的一个，来设置 mode 参数，你可以启用 webpack 内置在相应环境下的优化。其默认值为 production。

module.exports = {
  mode: 'production'
};
查看 模式配置 章节了解其详细内容和每个值所作的优化。

浏览器兼容性(browser compatibility) 
webpack 支持所有符合 ES5 标准 的浏览器（不支持 IE8 及以下版本）。webpack 的 import() 和 require.ensure() 需要 Promise。如果你想要支持旧版本浏览器，在使用这些表达式之前，还需要 提前加载 polyfill。

/**/
/*import Vue from "vue/dist/vue.common.js";//Vue is not defind
动态注册子组件var cn="top"
		import("@/components/"+cn+".vue").then((component) => {
									console.log(component)
									 Vue.component(cn, component)    
    //return Vue.extend(component)
  })
   import('./top.vue').then(cmp => {
    mountCmp.call(this, cmp, {title: 123456}, document.getElementById("test"))
      })

    function mountCmp (cmp, props, parent) {
cmp = Vue.extend(cmp.default)
let node = document.createElement('div')
parent.appendChild(node)
new cmp({ //eslint-disable-line
  el: node,
  propsData: props,
  parent: this
})
}



*/