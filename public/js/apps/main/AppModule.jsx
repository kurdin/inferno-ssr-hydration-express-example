import { isArray, isBrowser } from './libs/utils.jsx';
import App from './App.jsx';
import Component from 'inferno-component';
import localizedText from './localizedText';

const Lodges = require('./lodges.json');

class AppModule extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			isLoaded: true
		};
		this.data = this.verifyModuleData();
		if (!this.data) {
			this.state = {
				isLoaded: false
			};
		}
	}

	verifyModuleData() {
		let AppData = (isBrowser && window.datashared && window.datashared.AppData) || this.props.AppData || {};
		AppData.currentPage = this.props.params.page || 1;
		if (!isArray(AppData.Lodges)) {
				// let emulate fetch call if no data available from server
				setTimeout(() => {
					AppData.Lodges = Lodges;
					AppData.localizedText = localizedText;
					this.data = AppData;
					this.setState({ isLoaded: true });
				}, 2000);
			return null;
		} else {
			return AppData;
		}
	}

	render() {
		return (
		<div>
		{ this.state.isLoaded ? (
			<App {...this.data} {...this.props} />
			) : (
			<div>Loading List Module</div>
			)}
		</div>
		)
	}
}

export default (props) => <AppModule {...props} />