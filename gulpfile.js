'use strict';

const gulp = require('gulp');
const gutil = require('gulp-util');
const webpack = require('webpack');
const nodemon = require('gulp-nodemon');
const WebpackDevServer = require('webpack-dev-server');
// const webpackConfig = require('./webpack.config.js')('DEV');
const openBrowser = require('inferno-dev-utils/openBrowser');

// The development server (the recommended option for development)
gulp.task('default', ['inferno-webpack-server', 'nodemon-webpack-server']);

const BUILD = process.env.NODE_ENV === 'production'; 

const devHost = 'http://localhost';
const devPort = '3000';

const publicFolder = 'public/';

// Build and watch cycle (another option for development)
// Advantage: No server required, can run app from filesystem
// Disadvantage: Requests are not blocked until bundle is available,
//               can serve an old app on refresh

gulp.task('inferno:build', function (callback) {
	var build = require('./run/build');
	build(callback);
});

gulp.task('inferno-webpack-server', function (callback) {
	var runWebPackInfernoServer = require('./run/webpack');
	runWebPackInfernoServer(8080, function() {
		setTimeout( () => { 
			openBrowser('http://localhost:8080/');
		}, 2000);
		callback();
    });
});

gulp.task('nodemon-webpack-server', function (cb) {
	var started = false;
	nodemon({
		script: 'index.js',
		watch: ['./index.js', 'controllers', 'routes', 'models', 'views'],

		// ignore: [
		//          'apps/src',
		//          'node_modules'
		//      ],
		env: {
			NODE_ENV: 'development'
		},
		ext: 'html dust js'
	})
	.on('change')
	.on('start', function () {
		if (!started) {
			cb();
			started = true; 
		}
  }).on('restart', function () {
     gutil.log('Nodejs app restarted!');
  })
  .on('crash', function() {
     gutil.log('Nodejs app crashed');
	});
});

// Production build
gulp.task('build', ['inferno:build']);
