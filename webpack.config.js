const path = require('path');

const colors = require('colors/safe');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (options = {}) => {
  options.env = options.env || process.env.NODE_ENV;

  let baseConfig = {
    target: 'node',
    externals: nodeExternals({
      modulesFromFile: true,
      allowlist: [
        /\.(eot|woff|woff2|ttf|otf)$/,
        /\.(svg|png|jpg|jpeg|gif|ico|webm)$/,
        /\.(mp4|mp3|ogg|swf|webp)$/,
        /\.(css|scss|sass|less|styl)$/,
        /\.(html|htm)$/,
      ],
    }),
    performance: {
      hints: false,
    },
    resolve: {
      extensions: ['.js', '.json'],
      alias: {
        '@job-guetter/api-core': path.resolve('./core'),
      },
    },
    node: {
      __filename: true,
      __dirname: true,
    },
    output: {
      path: path.resolve('./build'),
      filename: '[name].js',
      sourceMapFilename: '[name].map',
      publicPath: '/',
      libraryTarget: 'commonjs2',
    },
    module: {
      rules: [{
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
        },
        exclude: [/node_modules/, path.resolve('./build/')],
      }],
    },
    optimization: {
      emitOnErrors: false,
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(options.env),
      }),
    ],
  };

  switch (options.env) {
    case 'development':
      baseConfig = {
        ...baseConfig,
        mode: 'development',
        devtool: 'source-map',
        plugins: [
          ...baseConfig.plugins,
          new webpack.DefinePlugin({
            __DEV__: true,
          }),
          new webpack.BannerPlugin({
            raw: true,
            entryOnly: false,
            banner: 'require(\'source-map-support/register\');',
          }),
          new FriendlyErrorsWebpackPlugin(),
        ],
      };
      break;

    default:
      baseConfig = {
        ...baseConfig,
        mode: 'production',
        plugins: [
          new CleanWebpackPlugin(),
          ...baseConfig.plugins,
          new webpack.DefinePlugin({
            __DEV__: false,
          }),
          new FriendlyErrorsWebpackPlugin({
            clearConsole: false,
            onErrors: (severity, errors) => {
              if (severity !== 'error') {
                return;
              }

              errors.map(e => console.error(colors.red(e.message), '\n'));
              process.exit(1);
            },
          }),
        ],
        optimization: {
          minimizer: [
            new TerserWebpackPlugin({
              parallel: true,
              terserOptions: {
                output: {
                  comments: false,
                },
              },
            }),
          ],
        },
      };
  }

  return baseConfig;
};
