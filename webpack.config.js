const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/ui/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      // Add aliases for common import paths
      '@': path.resolve(__dirname, 'src'),
      '@ui': path.resolve(__dirname, 'src/ui'),
      '@core': path.resolve(__dirname, 'src/core'),
      '@extensions': path.resolve(__dirname, 'src/extensions'),
      '@styles': path.resolve(__dirname, 'src/ui/styles'),
      '@screens': path.resolve(__dirname, 'src/ui/screens'),
      '@components': path.resolve(__dirname, 'src/ui/components'),
      '@contexts': path.resolve(__dirname, 'src/ui/contexts')
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/ui/index.html'
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist')
    },
    port: 3000,
    hot: true
  }
};
