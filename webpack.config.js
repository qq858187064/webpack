const path = require('path');
// 引入css 单独打包插件
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const VueLoaderPlugin = require('vue-loader/lib/plugin'); 

module.exports={
	entry:'./src/main.js',
	output:{
		path:path.resolve(__dirname, 'public'),//'E:\\webpackTest\\public',
		filename:'bundle.js'
	},
	mode: 'development', // 设置mode
	　　plugins: [
	// 设置生成css 文件，会将entry入口js文件中引入的CSS抽成单独的文件
　　　　new ExtractTextPlugin('./style.css')
　　],
　　module: {
	 rules: [
	       {
        test: /\.vue$/,
        loader: 'vue-loader'/*,const vueLoaderConfig = require('./vue-loader.conf')
        options: vueLoaderConfig*/
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        },
      }
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
   ] */
};