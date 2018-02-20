// const config = require('config')
// const fs = require('fs')
// const path = require('path');

module.exports = {
  entry: './ui-src/entry-point.js',
  output: {
    filename: './ui/static/js/bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.coffee$/,
        use: [ 'coffee-loader' ]
      }
    ]
  },
  resolve: {
    extensions: [ '.coffee', '.js' ]
  }
};
