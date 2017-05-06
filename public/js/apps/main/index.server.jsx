import { _extend } from 'util';
import { renderToString } from 'inferno-server';
import { RouterContext, match } from 'inferno-router';
import { AppRoutes } from './Routes.jsx';

module.exports = (props, url, res) => { 
	let html;
	let content;
	url = props.baseUrl ? url.replace(new RegExp('^' + props.baseUrl), '') : url;
	const _props = _extend({isServer: true}, props);
	const renderProps = match(AppRoutes(_props), url);
	if (!renderProps.redirect) {
		content = (<RouterContext {...renderProps} baseUrl={ props.baseUrl } />);	
		html = renderToString(content);
	} else html = '';

	let regex = /redirect="(.*?)"/gi;
	let redirectMatch = regex.exec(html);
	let redirect = (redirectMatch && redirectMatch[1]) || renderProps.redirect;

  if (redirect) {
  	res.redirect(props.baseUrl ? props.baseUrl + redirect : redirect);
    return {redirect: redirect}
  }
	
	return html;
}