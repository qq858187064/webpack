# webpack
1、生成package.json
npm init
2、生成node_modules，--save-dev会将插件名写入package.json的devDependencies列表中
npm install webpack --save-dev
3、安装依赖
npm install style-loader css-loader --save-dev
npm install extract-text-webpack-plugin –-save-dev
4、创建webpack.config.js写入入口、输出配置
