const ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports={
	entry:'./app/main.js',
	output:{
		path:'E:\\webpackTest\\public',
		filename:'bundle.js'
	},
	　　plugins: [
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