import addClass from 'classnames';

const Pager = ({pagerStat, createPageUrl, location, on}) => {

		let PagerStats = pagerStat;
		if (PagerStats.totalPages <= 1) {
			return <ul class="pagination pagination-md links" />;
		}

		let numberOfNextPages = 2;

		if (PagerStats.totalPages < numberOfNextPages * 2 + 1) numberOfNextPages = parseInt(PagerStats.totalPages - 1 / 2, 10);

		let nextPage = (PagerStats.currentPage + 1 >= PagerStats.totalPages) ? PagerStats.totalPages : PagerStats.currentPage + 1;
		let prevPage = (PagerStats.currentPage - 1 <= 0) ? PagerStats.currentPage : PagerStats.currentPage - 1;

		let Pages = cretePagesUrl(PagerStats.currentPage, PagerStats.totalPages, numberOfNextPages, createPageUrl);

		const Pager = {
			nextURL: createPageUrl(nextPage),
			prevURL: createPageUrl(prevPage),
			firstPage: createPageUrl(1),
			lastPage: createPageUrl(PagerStats.totalPages),
			currentPage: PagerStats.currentPage,
			totalPages: PagerStats.totalPages,
			nextPages: Pages.nextPages,
			prevPages: Pages.prevPages.reverse()
		};

		const gotoPage = page => e => {
			e.preventDefault();
			on.gotoPage(page, location);
		};

		const preventDefault = e => {
			e.preventDefault();
			e.stopPropagation();
		};

		return (
		<ul class="pagination pagination-md links">
				<li class={ addClass({ disabled: Pager.currentPage === 1 }, 'pages') }>
		        <a href={ Pager.firstPage } data-sitemap="nofollow" 
		        onClick={ Pager.currentPage === 1 ? preventDefault : gotoPage(1) }>«</a>
		    </li>

		    <li class={ addClass({ disabled: Pager.currentPage === 1}) }>
		    	<a href={ Pager.prevURL } class="prev" data-sitemap="nofollow"
		    	{ ...Pager.currentPage > 1 ? { onClick: gotoPage(Pager.currentPage - 1) } : { onClick: preventDefault } }>Previous</a>
		    </li>

				{ 
					Pager.prevPages.map(
						(page) => (
							<li class="pages" key={ page.pageNumber }><a onClick={ gotoPage(page.pageNumber) } href={ page.pageNumber } data-sitemap="nofollow">{ page.pageNumber }</a></li>
						))
				}
	
				<li class="active" key={ Pager.currentPage }><a onClick={ preventDefault } data-sitemap="nofollow">{ Pager.currentPage }</a></li>

				{ 
					Pager.nextPages.map(
						(page) => (
							<li class="pages" key={ page.pageNumber }><a onClick={ gotoPage(page.pageNumber) } href={ page.pageNumber } data-sitemap="nofollow">{ page.pageNumber }</a></li>
						))		    
				}

		    <li class={ addClass({ disabled: Pager.currentPage === Pager.totalPages}) }>
		        <a href={ Pager.nextURL } class="next" data-sitemap="nofollow" 
		        { ...Pager.currentPage !== Pager.totalPages ? { onClick: gotoPage(Pager.currentPage + 1) } : { onClick: preventDefault } }>Next</a>
		    </li>

		    <li class={ addClass({ disabled: Pager.currentPage === Pager.totalPages }, 'pages') }>
		    	<a href={ Pager.lastPage } data-sitemap="nofollow"
		    	onClick={ Pager.currentPage === Pager.totalPages ? preventDefault : gotoPage(Pager.totalPages) }
		    	>»</a>
		    </li>
		</ul>
		);
};

function cretePagesUrl(currentPage, totalPages, numberOfNextPages, createPageUrl) {
	var nextPages = [];
	var prevPages = [];
	var n;
	var p;

	for (n = currentPage + 1; n <= currentPage + numberOfNextPages; n++) {
		if (n > totalPages) break;
		nextPages.push({
			pageNumber: n,
			pageURL: createPageUrl(n)
		});
	}

	for (p = currentPage - 1; p >= currentPage - numberOfNextPages - (numberOfNextPages - nextPages.length); p--) {
		if (p < 1) break;
		prevPages.push({
			pageNumber: p,
			pageURL: createPageUrl(p)
		});
	}

	if (prevPages.length < numberOfNextPages) {
		var lastNextPage = nextPages[nextPages.length - 1].pageNumber;
		for (n = lastNextPage + 1; n <= lastNextPage + (numberOfNextPages - prevPages.length); n++) {
			if (n > totalPages) break;
			nextPages.push({
				pageNumber: n,
				pageURL: createPageUrl(n)
			});
		}
	}

	return {
		nextPages: nextPages,
		prevPages: prevPages
	};
}

export default Pager;