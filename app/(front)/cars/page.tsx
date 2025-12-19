import React from "react";
import PageHeader from "../../ui/front/PageHeader";
import Carro from "../../ui/front/veiculos/carro";
import { carros } from "../../lib/cars";
import SideSearch from "../../ui/front/veiculos/sideSearch";

export default function CarsPage() {
	return (
		<>
			<PageHeader titulo="Home / Carros" descricao="Todos os Nossos Carros" />

			<div className="available-block vehicle-padding bg-gray-color">
				<div className="container">
					<div className="row">
						<div className="col-md-9">
							<div className="row">
								<div className="col-md-9 col-sm-9 clearfix">
									<h2 className="available-title">Available Vehicles</h2>
								</div>
								<div className="col-md-3 col-sm-3">
									<div className="vehicle-category pull-right">
										<select name="vehicle-category" id="vehicle-cat-list">
											<option value="volvo">filters</option>
											<option value="saab">Saab</option>
											<option value="mercedes">Mercedes</option>
											<option value="audi">Audi</option>
										</select>
									</div>
								</div>
							</div>

							<div className="row">
								{/* <div className="col-md-4 col-sm-6">
									<div className="vehicle-content theme-yellow">
										<div className="vehicle-thumbnail">
											<a href="#">
												<img
													src="/assets/images/popular/popular-01.png"
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
													<span>Rent: $200 / </span> Day, - $12 / Km,
												</div>
											</div>
										</div>
									</div>
								</div> */}

								{carros.map((car) => (
									<div className="col-md-4 col-sm-6" key={car.id}>
										<Carro car={car} />
									</div>
								))}
							</div>

							<div className="row">
								<div className="col-md-12 clearfix">
									<div className="pagination-link">
										<ul className="pagination">
											<li>
												<a href="#">
													<i className="fa fa-angle-left"></i>
												</a>
											</li>
											<li className="active">
												<a href="#">01</a>
											</li>
											<li>
												<a href="#">02</a>
											</li>
											<li>
												<a href="#">03</a>
											</li>
											<li>
												<a href="#">04</a>
											</li>
											<li>
												<a href="#">05</a>
											</li>
											<li>
												<span className="pages-number-dots">...</span>
											</li>
											<li>
												<a href="#">12</a>
											</li>
											<li>
												<a href="#">
													<i className="fa fa-angle-right"></i>
												</a>
											</li>
										</ul>
									</div>
								</div>
							</div>
						</div>

						<div className="col-md-3">
							<SideSearch />
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
