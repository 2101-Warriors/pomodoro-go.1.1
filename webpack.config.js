const dotenv = require('dotenv');
const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
const currentPath = path.join(__dirname);
const basePath = currentPath + '/.env';
const envPath = basePath + '.' + process.env.NODE_ENV;
const finalPath = fs.existsSync(envPath) ? envPath : basePath;

const fileEnv = dotenv.config({ path: finalPath }).parsed;
console.log(fileEnv);
let envKeys;
if (fileEnv) {
  envKeys = Object.keys(fileEnv).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(fileEnv[next]);
    return prev;
  }, {});
}
console.log('env keys', envKeys);
const webpackConfig = {
  entry: ['./client/index.js'],
  output: {
    path: __dirname,
    filename: './public/bundle.js',
  },
  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-react'],
        },
      },
    ],
  },
};
console.log(process.env);
if (fileEnv) {
  webpackConfig.plugins = [new webpack.DefinePlugin(envKeys)];
} else {
  webpackConfig.plugins = [
    new webpack.DefinePlugin({
      'process.env.API_URL': JSON.stringify(process.env.API_URL),
      'process.env.CLIENT_ID_SPOTIFY': JSON.stringify(
        process.env.CLIENT_ID_SPOTIFY
      ),
      'process.env.CLIENT_SECRET_SPOTIFY': JSON.stringify(
        process.env.CLIENT_SECRET_SPOTIFY
      ),
      'process.env.DATABASE_URL': JSON.stringify(process.env.DATABASE_URL),
    }),
  ];
}

module.exports = webpackConfig;
