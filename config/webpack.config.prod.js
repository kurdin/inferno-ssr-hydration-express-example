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
// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_PATH%/xyz looks better than %PUBLIC_PATH%xyz.
var publicUrl = '';
// Get environment variables to inject into our app.
var env = getClientEnvironment(publicUrl);
// Assert this just to be safe.
// Development builds of Inferno are slow and not intended for production.
if (env['process.env'].NODE_ENV !== '"production"') {
	throw new Error('Production builds must have NODE_ENV=production.');
}

var entryApps = {};
var dirs = [];
var files = fs.readdirSync(paths.appSrc);

files.forEach(function(file) {
	let full = path.join(paths.appSrc, file);
	if (fs.statSync(full).isDirectory() && file.indexOf('_off') === -1) dirs.push(file);
});

dirs.forEach(function(appname) {
	entryApps[appname] = [
		path.join(paths.appSrc, appname)
	];
})

// This is the production configuration.
// It compiles slowly and is focused on producing a fast and minimal bundle.
// The development configuration is different and lives in a separate file.
module.exports = {
	// Don't attempt to continue if there are any errors.
	bail: true,
	// We generate sourcemaps in production. This is slow but gives good results.
	// You can exclude the *.map files from the build during deployment.
	// devtool: 'source-map',
	// In production, we only want to load the polyfills and the app code.
	entry: entryApps,
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
			'shared': path.join(paths.appRoot, '../shared')
		}    
	},  
	module: {
		rules: [
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
			]
	},
	plugins: [
		new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
		new webpack.DefinePlugin({
						__SERVER__: false,
						__CLIENT__: true,
						__DEBUG__: false,
						__DEV__: false,
						__PRODUCTION__: true,
						'process.env': {
							NODE_ENV: JSON.stringify('production')
						}
		}),
		new webpack.optimize.LimitChunkCountPlugin({
			maxChunks: 1
		}),		
		// This helps ensure the builds are consistent if source hasn't changed:
		new webpack.optimize.OccurrenceOrderPlugin(),
		// Try to dedupe duplicated modules, if any:
		// Minify the code.
		new webpack.optimize.UglifyJsPlugin({
			minimize: true,
			compress: {
				screw_ie8: true, // Inferno doesn't support IE8
				warnings: false
			},
			mangle: {
				screw_ie8: true
			},
			output: {
				comments: false,
				screw_ie8: true
			}
		}),
		// Note: this won't work without ExtractTextPlugin.extract(..) in `loaders`.
		// new ExtractTextPlugin('css/[name].css'),
		// Generate a manifest file which contains a mapping of all asset filenames
		// to their corresponding output file so that tools can pick it up without
		// having to parse `index.html`.
		// new ManifestPlugin({
		//   fileName: 'asset-manifest.json'
		// })
	],
	// Some libraries import Node modules but don't use them in the browser.
	// Tell Webpack to provide empty mocks for them so importing them works.
	node: {
		fs: 'empty',
		net: 'empty',
		tls: 'empty'
	}
};
