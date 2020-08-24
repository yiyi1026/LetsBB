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
      "is-plain-object": path.resolve(__dirname, 'node_modules/is-plain-object/node_modules/isobject')
    }
  },
  module: {
    rules: [{
      test: /\.js|\.jsx$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
      },
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