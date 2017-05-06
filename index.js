/* globals render */

const express = require('express');
const slash = require('express-slash');
const adaro = require('adaro');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const BUILD = process.env.NODE_ENV === 'production';
const datashared = require('./lib/shared-data');

const app = express();
require('./config/jsx-require');

var router = express.Router({
    caseSensitive: app.get('case sensitive routing'),
    strict : app.get('strict routing')
});

global.appRoot = require('path').resolve(__dirname);
global.render = require('./lib/render');
global.Inferno = require('inferno');
global._ = require('lodash');
global.globalHelper = {
	isDev: isDev()
}

var ViewOptions = {
		cache: BUILD ? true : false,
		whitespace: BUILD ? false : true,
		helpers: [
			require('./lib/dusthelpers/datashared'),
			function (dust) { dust.helpers.myHelper = function (a, b, c, d) {} },
			'dustjs-helpers'
		]
};

app.use(datashared);
app.use(router);
app.use(slash());

app.engine('dust', adaro.dust(ViewOptions));
app.set('view engine', 'dust');
app.set('views', path.resolve(__dirname, './views'));

// Standard express setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

router.get('/', (req, res) => { 
	res.redirect(301, '/test-base/');
});

const InfernoApp = require('./public/js/apps/main/index.server.jsx');
const Lodges = require('./public/js/apps/main/lodges.json');
const localizedText = require('./public/js/apps/main/localizedText');

router.get('/test-base/*', (req, res) => {
	
	let AppData = {
		Lodges: Lodges,
		localizedText:localizedText,
		baseUrl: '/test-base',
		hello: 'world'
	}

	res.locals.InfernoApp = InfernoApp(AppData, req.originalUrl, res);
	
	let view = 'index';
	
	let model = {
		shared: {
			AppData: AppData
		}
	};

	render(view, model, res);
});

/// catch 404 and forward to error handler
app.use((req, res, next) => {
		var err = new Error('Not Found');
		err.status = 404;
		next(err);
});

// development error handler
app.use((err, req, res, next) => {
		res.status(err.status || 500);
		res.render('error', {
				message: err.message,
				error: err
		});
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
		console.log('Express server listening on port ' + server.address().port);
});

function isDev() {
	return (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'testing' && process.env.NODE_ENV !== 'staging') ? true : false;
}