import { JSXFilters } from './libs/jsx-filters.jsx';
import Animate from 'inferno-animate-css';

let filter = new JSXFilters();

const LodgeBlock = ({lodge, localizedText, usePreferred = true, lodgesOnly = true, packagePricing = true, on, showMore, debug = true}) => (
<section class="results-listing">
	<div class="row">
		{ usePreferred && lodge.isPreferred && 
			<div class="best-seller"> { localizedText.Widgets.LodgeAmenity.LocalizedText.BestSeller }</div>
		}
		<div class="col-sm-9 right-separator">
			<div class="row">
					<div class="col-sm-5">
					</div>
					<div class="col-sm-7 prop-description">
						<h4>
							<a href="#" target="_blank" class="" itemprop="name">{ lodge.name }
														{ debug && <span> id: { lodge.id }</span> }</a>

						</h4>
						<div class="top5 bottom10">
							<div class="stars-back">
							</div>
						</div>
					</div>
			</div>
			<div class="separator">
				<div class="col-sm-12 prop-content">
						{ showMore ? ( 
						<p>
						<span dangerouslySetInnerHTML={ { __html: filter.str(lodge.description).cut250().removeDoubleLine().removeBR().val } } /> 
						<a href="#" onClick={ on.moreClick(lodge.id) } class="moreless">{ localizedText.More } &rarr;</a>
						</p>
						) : ( 
						<Animate appear="fadeIn">
							<p key={ lodge.id + '-less' }>
							<span dangerouslySetInnerHTML={ { __html: filter.str(lodge.description).removeDoubleLine().removeBR().val } } /> 
							<a href="#" onClick={ on.moreClick(lodge.id) } class="moreless">&larr; { localizedText.Less  }</a>
							</p>
						</Animate>
						)}
					<div class="top10 bottom10">
					{ lodge.hasPool && 
						<a class="icon-big-pool" data-toggle="tooltip" title={ localizedText.Widgets.LodgeAmenity.LocalizedText.Pool }></a> 
					}
					{ lodge.hasHotTub && 
						<a class="icon-big-hot-tub" data-toggle="tooltip" title={ localizedText.Widgets.LodgeAmenity.LocalizedText.HotTub }></a> 
					}
					{ lodge.hasSpa && 
						<a class="icon-big-spa" data-toggle="tooltip" title={ localizedText.Widgets.LodgeAmenity.LocalizedText.Spa }></a> 
					}
					{ lodge.hasKitchen && 
						<a class="icon-big-kitchen" data-toggle="tooltip" title={ localizedText.Widgets.LodgeAmenity.LocalizedText.Kitchen }></a> 
					}
					{ lodge.hasBreakfast && 
						<a class="icon-big-breakfast" data-toggle="tooltip" title={ localizedText.Widgets.LodgeAmenity.LocalizedText.Breakfast }></a> 
					}
					{ lodge.hasRestaurant && 
						<a class="icon-big-restaurant-bar" data-toggle="tooltip" title={ localizedText.Widgets.LodgeAmenity.LocalizedText.RestaurantBar }></a> 
					}
					{ lodge.isPetFriendly && 
						<a class="icon-big-pet-friendly" data-toggle="tooltip" title={ localizedText.Widgets.LodgeAmenity.LocalizedText.PetFriendly }></a> 
					}
					</div>
					<div id={"Modal" + lodge.id} class="modal fade" aria-hidden="true" style={{ display: 'none' }}>
						<div class="modal-dialog">
							<div class="modal-content">
								<div class="modal-header">
										<button class="close" aria-hidden="true" data-dismiss="modal" type="button">×</button>
										<h3><a href="/book/lodging-details-list?lodgeId=70">{ lodge.name }</a></h3>
								</div>
								<div class="modal-body">
									<p dangerouslySetInnerHTML={ { __html: filter.str(lodge.description).removeDoubleLine().val } } />
									<p>
										{ lodge.hasPool && 
											<span> { localizedText.Widgets.LodgeAmenity.LocalizedText.Pool } </span>
										}																
										{ lodge.isSkiInSkiOut && 
											<span> { localizedText.Widgets.LodgeAmenity.LocalizedText.SkiInSkiOut } </span>
										}
										{ lodge.hasHotTub && 
											<span> { localizedText.Widgets.LodgeAmenity.LocalizedText.HotTub } </span>
										}
										{ lodge.hasSpa && 
											<span> { localizedText.Widgets.LodgeAmenity.LocalizedText.Spa } </span>
										}
										{ lodge.hasKitchen && 
											<span> { localizedText.Widgets.LodgeAmenity.LocalizedText.Kitchen } </span>
										}
										{ lodge.hasBreakfast && 
											<span> { localizedText.Widgets.LodgeAmenity.LocalizedText.Breakfast } </span>
										}
										{ lodge.hasRestaurant && 
											<span> { localizedText.Widgets.LodgeAmenity.LocalizedText.RestaurantBar } </span>
										}
										{ lodge.isPetFriendly && 
											<span> { localizedText.Widgets.LodgeAmenity.LocalizedText.PetFriendly } </span>
										}
									</p>
								</div>
								<div class="modal-footer">
									<button class="btn btn-default" aria-hidden="true" data-dismiss="modal">{ localizedText.Close }</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="col-sm-3">
			<div class="price" style={{ 'padding-bottom': '10px' }}>
					{ lodge.hasInventory &&
					<div class="justwrap">
							<div class="top20">
									<small>{ !lodgesOnly && 
										<span>{ localizedText.Flight } </span> 
									}
									<span> { localizedText.HotelPrice } </span>
									</small>
							</div>
							{ packagePricing ? ( 
								<div>
									<div><small>{ localizedText.From } </small></div>
									<span>
										<span class="money">{/* Total(lodge.Total, true) | currency:CurrencyId:CurrencySymbol */}</span>
										<small>{ localizedText.PerPerson }</small>
									</span>
									<div class="small"><strong>{/* Total(lodge.Total, false) | currency:CurrencyId:CurrencySymbol } { localizedText.Total */}</strong></div>
								</div>									
							) : (
								<div>
										<div><small>{ localizedText.From } </small></div>
										<span>
											<span class="money">Price HERE</span>
										<small>{ localizedText.PerNight }</small>
										</span>
								</div>
							)}
					</div>
					}
			</div>
		</div>
	</div>
</section>
);

export default LodgeBlock;