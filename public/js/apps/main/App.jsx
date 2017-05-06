// import { BookingEngineRouter } from 'shared-components/booking-engine/components/BookingEngine.jsx';

// import $ from 'jquery';
/* globals $, moment, travelInfo, dateFormat */
import Component from 'inferno-component';
import LodgeBlock from './LodgeBlock.jsx';
import Pager from './Pager.jsx';
import _ from 'lodash';
// import Lodges from './lodges.json';

// require('./styles.css');

class LodgingList extends Component {
	static displayName = 'List';
	
	locals = {
		perPage: 8
	}

	constructor(props) {
		super(props);
		this.baseUrl = this.sharedData('baseUrl', props);
		this.Lodges = props.Lodges;
		this.localizedText = props.localizedText;
		this.state = {
			showMore: {},
			page: parseInt(props.currentPage, 10),
			options: {
				lodgesOnly: true,
				packagePricing: true,
				usePreferred: true
			}
		}
	}

	sharedData(option, props) {
		return (typeof window !== 'undefined' && window.datashared) ? window.datashared.AppData[option] : props[option];
	}

	createPageUrl(options) {
		return '/';
	}

 	currentPage() {
		let page = this.state.page;
		let items = this.Lodges;
		let perPage = this.locals.perPage;
		let offset = (page - 1) * perPage;
		let totalPages = Math.ceil(items.length / perPage);
		let paginatedItems = items.slice(offset, items.length).slice(0, perPage);

		let total = items.length;

		return {
			totalItems: total,
			filtered: items,
			totalPages: totalPages,
			from: page === 1 ? 1 : (page - 1) * perPage + 1,
			to: totalPages === page ? total : page * perPage,
			page: page,
			items: paginatedItems
		};
 	}

	pagerStat() {
		let items = this.Lodges;
		let total = items.length;
		let perPage = this.locals.perPage;
		let totalPages = Math.ceil(items.length / perPage);

		let pageStats = {
			total: total,
			currentPage: this.state.page,
			totalPages: totalPages
		};

		return pageStats;
 	}	

	setUrl(path, method = 'pushState') {
		if (typeof window === 'undefined') return;
		if (window.history && !window.history.pushState) return;
		var params = window.location.search || '';
		window.history[method ? 'replaceState' : method]({}, '', this.baseUrl + path + params);
	}

	on = {
		preventDefault: e => {
			e.preventDefault();
			e.stopPropagation();
		},
		pager: {
			gotoPage: (page) => {
				if (!page) return;
				if (this.state.page !== page ) {
					this.setUrl('/' + page);
					this.setState({
						page: page
					})
				}
			}
		},

		moreClick: lodgeId => e => {
			e.preventDefault();
			e.stopPropagation();
			let showMore = _.extend({}, this.state.showMore);
			showMore[lodgeId] = showMore[lodgeId] ? false : true;
			this.setState({ showMore: showMore });
		}
	}

	componentWillUpdate() {
		console.time('Lodge List Update');
	}

	componentWillMount() {
		console.log('in componentWillMount');
	}

	componentDidUpdate() {
		console.timeEnd('Lodge List Update');
	}

	render() {

		let currentPage = this.currentPage();
		let pagerStat = this.pagerStat();

		console.log('Lodges Component Render');

		return (
			<div class="section-wrap">
				<div>
					<Pager pagerStat={ pagerStat } on={ this.on.pager } createPageUrl={ this.createPageUrl }/>
					<h5 class="top20 pull-right ng-binding"><span>Lodges: </span>
						{ currentPage.from } - { currentPage.to } of <b>{ currentPage.totalItems }</b>
					</h5>
				</div>
				<div id="reservations" style={{ 'margin-top' : '10px' }}>
					<fieldset>
					{
						currentPage.items.map(
							(lodge) => (
								<LodgeBlock 
								lodge={ lodge }
								localizedText={ this.localizedText }
								{...this.state.options}
								on={ this.on }
								showMore={this.state.showMore[lodge.id] ? false : true}
								/>
						))
					}
					</fieldset>
				</div>
				<Pager pagerStat={ pagerStat } on={ this.on.pager } createPageUrl={ this.createPageUrl }/>
			</div>
		)
	}
};

export default LodgingList;

