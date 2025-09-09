"use client";

const PopularVehicleBlock = () => {
	return (
		<div className="popular-vehicle-block pd-90 ex-pdt-102 ex-pdtm-72">
			<div className="container">
				<div className="row tb default-margin-bottom yellow-theme">
					<div className="col-md-9 col-sm-8 block-title-area tb-cell">
						<div className="heading-content style-one border">
							<h3 className="subtitle">Popular Rental Servises</h3>
							<h2 className="title">Popular Taxi</h2>
						</div>
					</div>

					<div className="col-md-3 col-sm-4 hidden-xs block-navigation-area tb-cell">
						<div className="pull-right">
							<div className="item-navigation hidden-xs">
								<a href="#" className="previous-item">
									<i className="fa fa-angle-left"></i>
								</a>
								<a href="#" className="next-item">
									<i className="fa fa-angle-right"></i>
								</a>
							</div>

							<div className="view-all-item">
								<a href="#" className="view-all-btn">
									View all
								</a>
							</div>
						</div>
					</div>
				</div>

				<div
					className="vehicle-slider slider-style-two owl-carousel"
					data-item="[4,2,1,1]"
				>
					<div className="item">
						<div className="vehicle-content theme-yellow">
							<div className="vehicle-thumbnail">
								<a href="#">
									<img
										src="assets/images/popular/popular-01.png"
										alt="car-item"
									/>
								</a>
							</div>
							<div className="vehicle-bottom-content">
								<h2 className="vehicle-title">
									<a href="#">Toyota Aygo</a>
								</h2>
								<div className="vehicle-meta">
									<div className="meta-item">
										<span>Rent: $200 / </span> Day. - $12 / Km.
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="item">
						<div className="vehicle-content theme-yellow">
							<div className="vehicle-thumbnail">
								<a href="#">
									<img
										src="assets/images/popular/popular-02.png"
										alt="car-item"
									/>
								</a>
							</div>
							<div className="vehicle-bottom-content">
								<h2 className="vehicle-title">
									<a href="#">Toyota Aygo</a>
								</h2>
								<div className="vehicle-meta">
									<div className="meta-item">
										<span>Rent: $200 /</span> Day. - $12 / Km.
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="item">
						<div className="vehicle-content theme-yellow">
							<div className="vehicle-thumbnail">
								<a href="#">
									<img
										src="assets/images/popular/popular-03.png"
										alt="car-item"
									/>
								</a>
							</div>
							<div className="vehicle-bottom-content">
								<h2 className="vehicle-title">
									<a href="#">Toyota Aygo</a>
								</h2>
								<div className="vehicle-meta">
									<div className="meta-item">
										<span>Rent: $200 /</span> Day. - $12 / Km.
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="item">
						<div className="vehicle-content theme-yellow">
							<div className="vehicle-thumbnail">
								<a href="#">
									<img
										src="assets/images/popular/popular-04.png"
										alt="car-item"
									/>
								</a>
							</div>
							<div className="vehicle-bottom-content">
								<h2 className="vehicle-title">
									<a href="#">Toyota Aygo</a>
								</h2>
								<div className="vehicle-meta">
									<div className="meta-item">
										<span>Rent: $200 /</span> Day. - $12 / Km.
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="block-navigation-area visible-xs-block">
					<div className="view-all-item clearfix">
						<a href="#" className="view-all-btn">
							View all
						</a>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PopularVehicleBlock;
