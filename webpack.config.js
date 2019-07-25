const path = require('path');
// 引入css 单独打包插件
const ExtractTextPlugin = require("extract-text-webpack-plugin");
/*
   ExtractTextPlugin属性1.id:此为插件的唯一标识，默认为自动生成。2.filename:定义文件的名称。如果有多个入口文件时，应该定义为：[name].css。3.allChunks:当使用 `CommonsChunkPlugin` 并且在公共 chunk 中有提取的 chunk（来自`ExtractTextPlugin.extract`）时，`allChunks` **必须设置为 `true`。4.ignoreOrder:禁用顺序检查 (这对 CSS 模块很有用！)，默认 `false`。5.disable:禁用插件
*/
const VueLoaderPlugin = require('vue-loader/lib/plugin'); 

module.exports={
  
  entry:'./src/main.js',// 入口文件，相对于本文的路径相对，可以是字符串、数组、对象
/*对象形式
    entry: {
        index:path.resolve(__dirname, './src/main.js'),
        vendors:['vue','vue-router','jquery'],// 需要被提取为公共模块的群组
    },
*/
	output:{
		path:path.resolve(__dirname, 'public'),//path.resolve将指定路径public，解析为绝对路径'E:\\webpackTest\\public'
    filename:'bundle.js',//'[name].[hash].js'可以基于文件的md5生成Hash名称的script来防止缓存
    // publicPath: '../static/js/',避免使用
    //chunkFilename: '[id].[chunkhash].js'// 未列入entry中，但要求打包后的文件命名配置
  },
    /*
      resolve: {
        // require时可略去指定扩展名
        extensions: ['','.js', '.vue'],
        // 先设置root，再设模块路径别名，便于更简短的引用
        alias:{}
      },  */
    //externals:{},// 指定不打包的模块
	mode: 'development', // 设置mode
	　　plugins: [
	// 设置生成css 文件，会将entry入口js文件中引入的CSS抽成单独的文件
　　　　new ExtractTextPlugin('./style.css')
　　],
　module: {
	 rules: [
	       {//用vue-loader 加载 .vue 文件
        test: /\.vue$/,
        loader: 'vue-loader'/*,const vueLoaderConfig = require('./vue-loader.conf')
        options: vueLoaderConfig*/
      },
      {
        test: /\.css$/,//把样式抽取为单独的文件
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",//用哪个loade提取css
          use: "css-loader"//用哪个loader去编译
          //publicfile:用指定文件覆盖项目路径,生成该css文件的文件路径
        })
      },
      {//用babel 加载 .js 文件
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        },
        /*
                    query:{
                    presets: ['es2015', 'stage-0'],  
                    plugins: ['transform-runtime']                      
                }
        */
      },
      /*
      //图片
            {
              test: /\.(png|jpg|gif)$/,
              loader: 'url-loader',
              query: {
                  // 指定大小阈值的图片转base64嵌入生成的js文件里，会导致js文件增大
                  limit: 10000,//bit
                  // 路径当前配置文件下的publicPath相结合
                  name:'../img/[name].[ext]?[hash:7]'
              }
          },
          // 图标
          {
              test: /\.(eot|woff|woff2|svg|ttf)([\?]?.*)$/,
              loader: 'file-loader',
              query: {               
                  limit: 10000,
                  name:'../fonts/[name].[ext]?[hash:7]',
                  prefix:'font'
              }
          },  
          */
    ]
　　},
/*配置webpack-dev-server*/
devServer:{
	contentBase:'./public'
}
//防止重复
/*
  optimization: {
     splitChunks: {
       chunks: 'all'
     }
  },
   plugins:[new VueLoaderPlugin(),
       new ExtractTextPlugin("style.css"),
   ] 
   */
};