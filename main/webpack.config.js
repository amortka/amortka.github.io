var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    context: __dirname,
    entry: './app/app.js',
    output: {
        path: path.join(__dirname, '../'),
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                include: /app/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015'],
                    cacheDirectory: true
                }
            }, {
                test: /\.html$/,
                loader: 'html-loader'
            }, {
                test: /\.json$/,
                loader: 'json'
            }, {
                test: /\.(png|jpg)$/,
                // loader: 'url'
                loader: 'file?name=img/[name].[ext]'
            }, {
                test: /\.css$/,
                loader: 'style!css'
            }, {
                test: /\.scss$/,
                loader: 'style!css!autoprefixer!sass'
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.json', '.scss', '.html'],
        root: [
            path.join(__dirname, 'app'),
            path.join(__dirname, 'node_modules')
        ],
        moduleDirectories: [
            'node_modules'
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'myApp',
            template: './app/index.html',
            inject: true,
            hash: true
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
};
