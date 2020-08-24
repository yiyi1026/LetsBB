const webpack = require("webpack")
const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  entry: [
    "react-hot-loader/patch",
    "webpack-dev-server/client?http://localhost:3000",
    "webpack/hot/only-dev-server",
    path.resolve(__dirname, "src", "index.jsx"),
  ],
  mode: "development",
  resolve: {
    modules: [path.resolve(__dirname, "node_modules")],
    extensions: ["*", ".js", ".jsx"],
    alias: {
      // temp solution for npm audit fix
      "is-plain-object": path.resolve(
        __dirname,
        "node_modules/is-plain-object/node_modules/isobject"
      ),
    },
  },
  module: {
    rules: [
      {
        test: /\.js|\.jsx$/,
        exclude: /node_modules/,
        loader: ["babel-loader"],
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, "public"),
    publicPath: "/",
    filename: "bundle.js",
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: '"development"',
      },
    }),
  ],
  devServer: {
    port: 8080,
    contentBase: path.resolve(__dirname, "public"),
    hot: true,
    historyApiFallback: true,
  },
  devtool: "source-map",
}
