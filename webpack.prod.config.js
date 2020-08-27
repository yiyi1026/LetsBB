const webpack = require('webpack')
const path = require('path')

module.exports = {
  entry: [
    path.resolve(__dirname, 'src', 'index.jsx')
  ],
  resolve: {
    modules: [path.resolve(__dirname, 'node_modules')],
    extensions: ['*', '.js', '.jsx'],
    alias: {
      // temp solution for npm audit fix
      'is-plain-object': path.resolve(__dirname, 'node_modules/is-plain-object/node_modules/isobject'),
      'react-dom': '@hot-loader/react-dom'
    }
  },
  module: {
    rules: [{
      test: /\.js|\.jsx$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env']
      }
    }]
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
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
