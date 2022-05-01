// const path1 = require("path");
// const HtmlWebpackPlugin = require("html-webpack-plugin");

// module.exports = {
//     entry: "./src/index.tsx",
//     output: { 
//       path: path1.join(__dirname, "dist"), 
//       filename: "index.bundle.js",
//       publicPath: 'auto'
//     },
//     mode: process.env.NODE_ENV || "development",
//     resolve: {
//         extensions: [".tsx", ".ts", ".js"],
//         fallback: {
//           util: require.resolve("util/")
//         }
//     },
//     devServer: {
//       static: path1.join(__dirname, "dist"),
//       port: 4000,
//       https: true
//     },
//     module: {
//         rules: [
//             {
//                 test: /\.(js|jsx)$/,
//                 exclude: /node_modules/,
//                 use: ["babel-loader"],
//             },
//             {
//                 test: /\.(ts|tsx)$/,
//                 exclude: /node_modules/,
//                 use: ["ts-loader"],
//             },
//             {
//                 test: /\.(css|scss)$/,
//                 use: ["style-loader", "css-loader"],
//             },
//             {
//                 test: /\.(jpg|jpeg|png|gif|mp3|svg)$/,
//                 use: ["file-loader"],
//             },
//         ],
//     },
//     plugins: [
//         new HtmlWebpackPlugin({
//             template: path1.join(__dirname, "public", "index.html"),
//         }),
//     ],
// };

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
