var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: [
        'babel-polyfill',
        './src/theme/main.less',
        './src/main',
        'webpack-dev-server/client?http://localhost:8080'
    ],
    output: {
        filename: "main.js",
        path: __dirname + "/dist",
    },
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.js$/,
                include: path.join(__dirname, 'src'),
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'stage-0', 'react'],
                    "plugins": ["transform-decorators-legacy"]
                }
            },
            {
                test: /\.less$/,
                loader: "style!css!autoprefixer!less"
            },
        ]
    },
    devServer: {
        contentBase: "./src"
    }
};
