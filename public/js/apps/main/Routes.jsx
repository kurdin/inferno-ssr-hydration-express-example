import { Router, Route, IndexRoute } from 'inferno-router';
import { createBrowserHistory } from 'history';
import AppModule from './AppModule.jsx';

const Layout = ({ children }) => (<div>{children}</div>);

const AppRoutes = (props) => {
	// console.log('props', props);
	return (
		<Layout>
			<IndexRoute component={ AppModule } AppData={ props } name="index" />
			<Route path="/:page" component={ AppModule } AppData={ props } name="pages" />
		</Layout>
	);
}

const AppRouter = () => {
	let baseUrl = window.datashared.AppData.baseUrl;
	const history = createBrowserHistory({ basename: baseUrl });
	return (
    <Router history={ history }>
    	{ AppRoutes() }
    </Router>
  );
}

export { AppRouter, AppRoutes };
