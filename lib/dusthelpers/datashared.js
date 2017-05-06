'use strict';

// usage in templates:
// {@AppSharedData /}

var _ = require('lodash');

module.exports = function (dust) {
    //Create a helper called 'AppSharedData'
	dust.helpers.AppSharedData = function (chunk, context) {
		var data = context.get('shared') || {};
		var appshared = context.get('AppShared');
		var globaldata = context.get('globalShared') || null;

		var appdata = (appshared && appshared.data) ? _.merge(data, appshared.data) : data;
		// if (globaldata) appdata = _.merge(appdata, globaldata);
		if (globaldata) appdata = _.merge(globaldata, appdata);

		return chunk.write((appshared && appshared.inject(appdata)) || '');
	};
};
