const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const InlineChunkHtmlPlugin = require("react-dev-utils/InlineChunkHtmlPlugin");

const PRODUCTION = true;

const defines = new webpack.DefinePlugin({
  DEBUG: JSON.stringify(!PRODUCTION),
  VERSION: JSON.stringify("5fa3b9"),
});

module.exports = {
  mode: PRODUCTION?'production':'development',
  entry: {
    index: "./js/custom_receiver.js",
  },
  plugins: [
    new CleanWebpackPlugin(),
    defines,
    new HtmlWebpackPlugin({
      title: "Joymo",
      inject: "body",
      template: "index.html",
    }),
    new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/\.js/]),
  ],
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/inline",
      },
    ],
  },
};
