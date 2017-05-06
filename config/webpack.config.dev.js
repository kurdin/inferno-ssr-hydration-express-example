var autoprefixer = require('autoprefixer');
var webpack = require('webpack');
var CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
var InterpolateHtmlPlugin = require('inferno-dev-utils/InterpolateHtmlPlugin');
var WatchMissingNodeModulesPlugin = require('inferno-dev-utils/WatchMissingNodeModulesPlugin');
const fs = require('fs');
const path = require('path');
var getClientEnvironment = require('./env');
var paths = require('./paths');

// Webpack uses `publicPath` to determine where the app is being served from.
// In development, we always serve from the root. This makes config easier.
var publicPath = '/';
// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_PATH%/xyz looks better than %PUBLIC_PATH%xyz.
var publicUrl = '';
// Get environment variables to inject into our app.
var env = getClientEnvironment(publicUrl);

var entryApps = {};
var dirs = [];
var files = fs.readdirSync(paths.appSrc);

files.forEach(function(file) {
  let full = path.join(paths.appSrc, file);
  if (fs.statSync(full).isDirectory() && file.indexOf('_off') === -1) dirs.push(file);
});

dirs.forEach(function(appname) {
  entryApps[appname] = [
    require.resolve('inferno-dev-utils/webpackHotDevClient'),
    // We ship a few polyfills by default:
    require.resolve('./polyfills'),
    // We include the app code last so that if there is a runtime error during
    // initialization, it doesn't blow up the WebpackDevServer client, and
    // changing JS code would still trigger a refresh.
    path.join(paths.appSrc, appname)
  ];
})

// This is the development configuration.
// It is focused on developer experience and fast rebuilds.
// The production configuration is different and lives in a separate file.
module.exports = {
  // You may want 'eval' instead if you prefer to see the compiled output in DevTools.
  // See the discussion in https://github.com/facebookincubator/create-react-app/issues/343.
  devtool: 'cheap-module-source-map',
  // These are the "entry points" to our application.
  // This means they will be the "root" imports that are included in JS bundle.
  // The first two entry points enable "hot" CSS and auto-refreshes for JS.
  entry: entryApps,
  context: __dirname,
  target: 'web',
  output: {
    publicPath: paths.appPublicPath,
    filename: '[name]-bundle.js',
    path: paths.appBuild,
  }, 
  resolve: {
    modules: ['node_modules'],    
    extensions: ['.js', '.json', '.jsx'],
    alias: {
      'libs': path.join(paths.appRoot, '../libs'),
      'jsx-filters': path.join(paths.appRoot, '../shared/jsx/filters'),
      'shared/inferno': path.join(paths.appRoot, '../shared'),
      'css/main': path.join(paths.appRoot, '../../css'),
      'shared': path.join(paths.appRoot, '../shared')
    }    
  },  

  module: {
    rules: [
       {
         test: /\.(js|jsx)$/,
         enforce: 'pre',
         loader: 'eslint-loader',
         include: paths.appRoot,
      },
      {
        test: /\.css/,
        use: [
          'style-loader',
          {
          loader: 'css-loader',
              options: {
                  url: false,
                  modules: true,
                  sourceMap: true,
                  importLoaders: 1,
                  localIdentName: '[folder]__[local]',
              },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: function () {
                return [
                  require('postcss-import'),
                  require('precss'),
                  require('autoprefixer')
                ];
              }
            }
          }
        ]
      },      
      {
        test: /\.(js|jsx|json)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'stage-2'],
          plugins: [
          'transform-decorators-legacy',
          'transform-async-to-generator',
          'inline-json-import',
          [ 'inferno', { imports: true }],
          'syntax-jsx'
          ],
          // This is a feature of `babel-loader` for webpack (not Babel itself).
          // It enables caching results in ./node_modules/.cache/babel-loader/
          // directory for faster rebuilds.
          cacheDirectory: true
        }
      }, 
      { 
        test: /\.(png|jpg)$/, loader: 'url?limit=25000' 
      },
      {
        test: /\.json/,
        loader: 'json-loader'
      }
      // , 
      // {
      //   test: /\.svg$/,
      //   loader: 'raw-loader'
      // }
      ]
  },
    
  // We use PostCSS for autoprefixing only.
  // postcss: function() {
  //   return [
  //     autoprefixer({
  //       browsers: [
  //         '>1%',
  //         'last 4 versions',
  //         'Firefox ESR',
  //         'not ie < 9', // Inferno doesn't support IE8 anyway
  //       ]
  //     }),
  //   ];
  // },
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.DefinePlugin({
            __SERVER__: false,
            __CLIENT__: true,
            __DEBUG__: true,
            __DEV__: true,
            __PRODUCTION__: false,
            'NODE_ENV': JSON.stringify(
                process.env.NODE_ENV || 'development'
            ),            
            'process.env': {
              NODE_ENV: JSON.stringify('development')
            }
    }),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    }),
    new webpack.ProvidePlugin({
      // Automtically detect jQuery and $ as free var in modules
      // and inject the jquery library
      // This is required by many jquery plugins
      jQuery: 'jquery',
      $: 'jquery',
      dust: 'dust'
    }),
    // This is necessary to emit hot updates (currently CSS only):
    new webpack.HotModuleReplacementPlugin(),
    // Watcher doesn't work well if you mistype casing in a path so we use
    // a plugin that prints an error when you attempt to do this.
    // See https://github.com/facebookincubator/create-react-app/issues/240
    new CaseSensitivePathsPlugin(),
    // If you require a missing module and then `npm install` it, you still have
    // to restart the development server for Webpack to discover it. This plugin
    // makes the discovery automatic so you don't have to restart.
    // See https://github.com/facebookincubator/create-react-app/issues/186
    new WatchMissingNodeModulesPlugin(paths.appNodeModules)
  ],
  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
};
