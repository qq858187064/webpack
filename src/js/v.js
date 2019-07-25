一、新建一个项目目录，cd /d 定位进去，然后输入npm init，会提示你填写一些项目的信息，一直回车默认就好了，或者直接执行npm init -y 直接跳过，这样就在项目目录下生成了一个package.json文件。

二、接下来就是通过npm安装项目依赖项，命令行输入：npm install babel-loader babel-core babel-plugin-transform-runtime babel-preset-es2015 babel-preset-stage-0 babel-runtime vue-loader vue-html-loader vue-hot-reload-api css-loader style-loader webpack webpack-dev-server --save-dev ，继续输入npm install vue@^1.0.26 --save 。

这里注意的几个点如下：

1.需要安装的依赖项视具体的项目需求来定，我只是安了几个必需的，后期会再加；

2.输入之后如果一直报错或者光标一直在转动，要么是npm版本太低(需要3+)，要么将npm改成cnpm，如果没有安装淘宝NPM镜像，可以先输入npm install -g cnpm --registry=https://registry.npm.taobao.org，接着输入cnpm -v查看是否安装完成，然后就可以使用cnpm来代替npm；

3.可以先修改package.json文件中的devDependencies和dependencies，然后再输入npm install进行一次性安装（偷懒的做法，嘿嘿）；

4.dependencies中的vue默认安装2+，如果dependencies中的vue选择^1.0.26，那么devDependencies中对应的vue-loader最好选择^7.3.0，vue-hot-reload-api最好选择^1.2.0，否则就会报错；

5.dependencies中的vue-router默认安装2+，无法识别router.map()这个方法，如果想要用回这个方法，最好选择^0.7.13；

6.有时安装一个依赖项，会提示还需要一并安装别的依赖项，例如：如果要安装bootstrap-loader，会提示要求安装node-sass sass-loader resolve-url-loader；要安装less-loader，会提示要求安装less；

完成这一步之后，会在项目目录下生成一个名node_modules的文件，对应的package.json文件中的内容变动如下（我额外添加了几个依赖项）：


  "devDependencies": {
    "autoprefixer-loader": "^3.2.0",
    "babel-core": "^6.18.2",
    "babel-loader": "^6.2.7",
    "babel-plugin-transform-runtime": "^6.15.0",
    "babel-preset-es2015": "^6.18.0",
    "babel-preset-stage-0": "^6.16.0",
    "babel-runtime": "^6.18.0",
    "css-loader": "^0.25.0",
    "debug": "^2.2.0",
    "express": "^4.14.0",
    "extract-text-webpack-plugin": "^1.0.1",
    "file-loader": "^0.9.0",
    "html-webpack-plugin": "^2.24.1",
    "jquery": "^3.1.1",
    "less": "^2.7.1",
    "less-loader": "^2.2.3",
    "style-loader": "^0.13.1",
    "url-loader": "^0.5.7",
    "vue-hot-reload-api": "^1.2.0",
    "vue-html-loader": "^1.2.3",
    "vue-loader": "^7.3.0",
    "webpack": "^1.13.3",
    "webpack-dev-middleware": "^1.8.4",
    "webpack-dev-server": "^1.16.2",
    "webpack-hot-middleware": "^2.13.1"
  },
  "dependencies": {
    "vue": "^1.0.26",
    "vue-router": "^0.7.13"
  }

三、在项目目录下新建一个名为src的目录，里面用于存放入口文件（index.js）、项目源文件（html,css,js,img之类的）、组件（.vue后缀），我的src目录结构大致如下：


src
  -entry
      -index.js
  -pages
      -components
      -css
      -img
      -js
      -index.html
  -public

当然，有输入目录，就有输出目录，即在项目目录下新建一个output目录，用于放置生产出来的各种资源文件。

四、在项目目录下新建一个名为build目录，里面用于存放各种配置文件，涉及到基础配置、开发和生产环境、静态服务器以及热加载，详细的内容请看下面的代码：

1.webpack.config.js（基础配置文件）


// 引入依赖模块
var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    // 入口文件，路径相对于本文件所在的位置，可以写成字符串、数组、对象
    entry: {
        // path.resolve([from ...], to) 将to参数解析为绝对路径
        index:path.resolve(__dirname, '../src/entry/index.js'),
        // 需要被提取为公共模块的群组
        vendors:['vue','vue-router','jquery'],
    },

    // 输出配置
    output: {
        // 输出文件，路径相对于本文件所在的位置
        path: path.resolve(__dirname, '../output/static/js/'),

        // 设置publicPath这个属性会出现很多问题：
        // 1.可以看成输出文件的另一种路径，差别路径是相对于生成的html文件；
        // 2.也可以看成网站运行时的访问路径；
        // 3.该属性的好处在于当你配置了图片CDN的地址，本地开发时引用本地的图片资源，上线打包时就将资源全部指向CDN了，如果没有确定的发布地址不建议配置该属性，特别是在打包图片时，路径很容易出现混乱，如果没有设置，则默认从站点根目录加载
        // publicPath: '../static/js/',

        // 基于文件的md5生成Hash名称的script来防止缓存
        filename: '[name].[hash].js',
        // 非主入口的文件名，即未被列在entry中，却又需要被打包出来的文件命名配置
        chunkFilename: '[id].[chunkhash].js'
    },

    // 其他解决方案
    resolve: {
        // require时省略的扩展名，遇到.vue结尾的也要去加载
        extensions: ['','.js', '.vue'],
        // 模块别名地址，方便后续直接引用别名，无须写长长的地址，注意如果后续不能识别该别名，需要先设置root
        alias:{}
    },    

    // 不进行打包的模块
    externals:{},

    // 模块加载器
    module: {
        // loader相当于gulp里的task，用来处理在入口文件中require的和其他方式引用进来的文件，test是正则表达式，匹配要处理的文件；loader匹配要使用的loader，"-loader"可以省略；include把要处理的目录包括进来，exclude排除不处理的目录       
        loaders: [
            //  使用vue-loader 加载 .vue 结尾的文件
            {
                test: /\.vue$/, 
                loader: 'vue-loader',
                exclude: /node_modules/    
            },
            // 使用babel 加载 .js 结尾的文件
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/,
                query:{
                    presets: ['es2015', 'stage-0'],  
                    plugins: ['transform-runtime']                      
                }
            }, 
            // 使用css-loader和style-loader 加载 .css 结尾的文件
            {  
                test: /\.css$/,                  
                // 将样式抽取出来为独立的文件
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!autoprefixer-loader"),
                exclude: /node_modules/
            },
            // 使用less-loader、css-loader和style-loade 加载 .less 结尾的文件
            {  
                test: /\.less$/,                  
                // 将样式抽取出来为独立的文件
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!autoprefixer-loader!less-loader"),
                exclude: /node_modules/
            },           
            // 加载图片
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'url-loader',
                query: {
                    // 把较小的图片转换成base64的字符串内嵌在生成的js文件里
                    limit: 10000,
                    // 路径要与当前配置文件下的publicPath相结合
                    name:'../img/[name].[ext]?[hash:7]'
                }
            },
            // 加载图标
            {
                test: /\.(eot|woff|woff2|svg|ttf)([\?]?.*)$/,
                loader: 'file-loader',
                query: {               
                    // 把较小的图标转换成base64的字符串内嵌在生成的js文件里    
                    limit: 10000,
                    name:'../fonts/[name].[ext]?[hash:7]',
                    prefix:'font'
                }
            },              
        ]         
    },

    // 配置插件项
    plugins: []  
}

2.webpack.dev.config.js（开发环境下的配置文件）


// 引入依赖模块
var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

// 引入基本配置
var config = require('./webpack.config.js');

// 必须修改原配置中网站运行时的访问路径，相当于绝对路径，修改完之后，当前配置文件下的很多相对路径都是相对于这个来设定；
// 注意：webpack-dev-server会实时的编译，但是最后的编译的文件并没有输出到目标文件夹，而是保存到了内存当中
config.output.publicPath = '/';

// 重新配置模块加载器
config.module= {
    // test是正则表达式，匹配要处理的文件；loader匹配要使用的loader，"-loader"可以省略；include把要处理的目录包括进来，exclude排除不处理的目录       
    loaders: [
        //  使用vue-loader 加载 .vue 结尾的文件
        {
            test: /\.vue$/, 
            loader: 'vue-loader',
            exclude: /node_modules/    
        },
        // 使用babel 加载 .js 结尾的文件
        {
            test: /\.js$/,
            loader: 'babel',
            exclude: /node_modules/,
            query:{
                presets: ['es2015', 'stage-0'],  
                plugins: ['transform-runtime']                      
            }
        }, 
        // 使用css-loader、autoprefixer-loader和style-loader 加载 .css 结尾的文件
        {  
            test: /\.css$/,                  
            // 将样式抽取出来为独立的文件
            loader: ExtractTextPlugin.extract("style-loader", "css-loader!autoprefixer-loader"),
            exclude: /node_modules/
        },
        // 使用less-loader、autoprefixer-loader、css-loader和style-loade 加载 .less 结尾的文件
        {  
            test: /\.less$/,                  
            // 将样式抽取出来为独立的文件
            loader: ExtractTextPlugin.extract("style-loader", "css-loader!autoprefixer-loader!less-loader"),
            exclude: /node_modules/
        },           
        // 加载图片
        {
            test: /\.(png|jpg|gif)$/,
            loader: 'url-loader',
            query: {
                // 把较小的图片转换成base64的字符串内嵌在生成的js文件里
                limit: 10000,
                // 路径和生产环境下的不同，要与修改后的publickPath相结合
                name: 'img/[name].[ext]?[hash:7]'
            }
        },
        // 加载图标
        {
            test: /\.(eot|woff|woff2|svg|ttf)([\?]?.*)$/,
            loader: 'file-loader',
            query: {                   
                limit: 10000,
                // 路径和生产环境下的不同，要与修改后的publickPath相结合
                name:'fonts/[name].[ext]?[hash:7]',
                prefix:'font'
            }
        },              
    ]         
};

// 重新配置插件项
config.plugins = [
    // 位于开发环境下
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: '"development"'
        }
    }),

    // 自动生成html插件，如果创建多个HtmlWebpackPlugin的实例，就会生成多个页面
    new HtmlWebpackPlugin({
        // 生成html文件的名字，路径和生产环境下的不同，要与修改后的publickPath相结合，否则开启服务器后页面空白
        filename: 'src/pages/index.html',
        // 源文件，路径相对于本文件所在的位置
        template: path.resolve(__dirname, '../src/pages/index.html'),
        // 需要引入entry里面的哪几个入口，如果entry里有公共模块，记住一定要引入
        chunks: ['vendors','index'],
        // 要把<script>标签插入到页面哪个标签里(body|true|head|false)
        inject: 'body',
        // 生成html文件的标题
        title:''
        // hash如果为true，将添加hash到所有包含的脚本和css文件，对于解除cache很有用
        // minify用于压缩html文件，其中的removeComments:true用于移除html中的注释，collapseWhitespace:true用于删除空白符与换行符
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

3.webpack.prod.config.js（生产环境下的配置文件）


// 引入依赖模块
var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

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

    // 自动生成html插件，如果创建多个HtmlWebpackPlugin的实例，就会生成多个页面
    new HtmlWebpackPlugin({
        // 生成html文件的名字，路径相对于输出文件所在的位置
        filename: '../../html/index.html',
        // 源文件，路径相对于本文件所在的位置
        template: path.resolve(__dirname, '../src/pages/index.html'),
        // 需要引入entry里面的哪几个入口，如果entry里有公共模块，记住一定要引入
        chunks: ['vendors','special','index'],
        // 要把<script>标签插入到页面哪个标签里(body|true|head|false)
        inject: 'body',
        // 生成html文件的标题
        title:'',
        // hash如果为true，将添加hash到所有包含的脚本和css文件，对于解除cache很有用
        // minify用于压缩html文件，其中的removeComments:true用于移除html中的注释，collapseWhitespace:true用于删除空白符与换行符
    }),      

    // 提取css单文件的名字，路径相对于输出文件所在的位置
    new ExtractTextPlugin("../css/[name].[contenthash].css"),    

    // 提取入口文件里面的公共模块
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendors',
        filename: 'vendors.js',
    }),   
    
    // 压缩js代码
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        },
        // 排除关键字，不能混淆
        except:['$','exports','require']
    }),

    // 为组件分配ID，通过这个插件webpack可以分析和优先考虑使用最多的模块，并为它们分配最小的ID
    new webpack.optimize.OccurenceOrderPlugin(),

    // 全局挂载插件，当模块使用这些变量的时候，wepback会自动加载，区别于window挂载
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

// 开启source-map，生产环境下推荐使用cheap-source-map或source-map，后者得到的.map文件体积比较大，但是能够完全还原以前的js代码
config.devtool='source-map';
// 关闭source-map
// config.devtool=false;

module.exports = config;

4.dev-server.js（服务器配置文件）


// 引入依赖模块
var express = require('express');
var webpack = require('webpack');
var config = require('./webpack.dev.config.js');

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

5.dev-client.js（配合dev-server.js监听html文件改动也能够触发自动刷新）


// 引入 webpack-hot-middleware/client 
var hotClient = require('webpack-hot-middleware/client');

// 订阅事件，当 event.action === 'reload' 时执行页面刷新
hotClient.subscribe(function (event) {
    if (event.action === 'reload') {
        window.location.reload();
    }
})

五、为了不必每次构建项目都要输入webpack --display-modules --display-chunks --config build/webpack.config.js这条长命令，我们在package.js文件中修改“scripts”项：

"scripts": {
  "build":"webpack --display-modules --display-chunks --config build/webpack.config.js",
  "dev":"node ./build/dev-server.js"
}
注意：package.js中不能有注释。

这样，我们就可以通过执行 npm run build 来进行构建，同时还增加了一条开启开发服务器的命令 npm run dev。