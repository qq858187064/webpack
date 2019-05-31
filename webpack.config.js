// 引入css 单独打包插件
var packCSS = new ExtractTextPlugin('./css/[name].min.css'); 
const ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports={
	entry:'./app/main.js',
	output:{
		path:'E:\\webpackTest\\public',
		filename:'bundle.js'
	},
	　　plugins: [
	// 设置生成css 文件，会将entry入口js文件中引入的CSS抽成单独的文件
　　　　new ExtractTextPlugin('./style.css')
　　],
　　module: {
	 rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      }
    ]
　　}
};