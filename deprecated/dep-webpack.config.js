const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { SourceMapDevToolPlugin, ProvidePlugin } = require("webpack");

module.exports = {
    mode: 'none',
    entry: {
        app: path.join(__dirname, 'src', 'index.tsx')
    },
    target: 'web',
    devtool: 'eval-source-map',
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: true,
        https: true,
        port: 8080
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        fallback: {
            util: require.resolve("util/")
        },
        alias: {
            process: "process/browser"
        },
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: '/node_modules/'
            },
            {
                test: /\.(css|scss)$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.js$/,
                enforce: 'pre',
                use: ['source-map-loader'],
            },
        ],
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'public', 'index.html')
        }),
        new SourceMapDevToolPlugin({
            filename: "[file].map"
        }),
        new ProvidePlugin({
            process: 'process/browser',
        }),
    ]
}
