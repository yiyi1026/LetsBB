const webpack = require('webpack')
const path = require('path')

module.exports = {
  entry: [
    path.resolve(__dirname, 'client', 'index.jsx')
  ],
  resolve: {
    modules: [path.resolve(__dirname, 'node_modules')],
    extensions: ['*', '.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    })
  ],
  devServer: {
    port: 8080,
    contentBase: path.resolve(__dirname, 'public'),
    hot: true,
    historyApiFallback: true
  },
  devtool: 'source-map'
};