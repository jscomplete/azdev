/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

require('dotenv').config(); // loads .env variables

module.exports = (env) => {
  const config = {
    devtool: env.dev ? 'inline-source-map' : false,
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json'],
      modules: [path.resolve('./src'), path.resolve('./node_modules')],
      alias: {
        styles: path.resolve('./styles'),
      },
      fallback: {
        module: false,
        fs: false,
        path: false,
        stream: false,
        assert: false,
      },
    },
    entry: {
      main: './src/renderers/browser.tsx',
    },
    output: {
      path: path.resolve('public', 'bundles'),
      filename: env.dev ? '[name].js' : '[name].[chunkhash].js',
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'ts-loader?configFile=tsconfig.json',
          },
        },
        {
          test: /\.css$/,
          exclude: /node_modules/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader?url=false',
              options: {
                importLoaders: 1,
              },
            },
            {
              loader: 'postcss-loader',
            },
          ],
        },
      ],
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all',
          },
        },
      },
    },
    plugins: [
      new webpack.EnvironmentPlugin([
        'NODE_ENV',
        'GRAPHQL_SERVER_URL',
        'GRAPHQL_SUBSCRIPTIONS_URL',
      ]),
      new MiniCssExtractPlugin({
        filename: env.dev ? '[name].css' : '[name].[fullhash].css',
        chunkFilename: env.dev ? '[id].css' : '[id].[fullhash].css',
      }),
      function (compiler) {
        compiler.hooks.done.tap('Reactful', (stats) => {
          fs.writeFileSync(
            path.resolve(
              env.dev ? './src/reactful.json' : './build/reactful.json',
            ),
            JSON.stringify(stats.toJson()['assetsByChunkName'], null, 2),
          );
        });
      },
    ],
  };

  return config;
};
