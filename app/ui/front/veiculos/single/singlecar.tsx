import React from "react";
import VehicleGallery from "./veiculoGalery";
import PopularVehicleBlock from "../../PopularVehicleBlock";

interface VehicleImage {
	fullView: { src: string; alt: string }[];
	listView: { src: string; alt: string }[];
}

interface PriceDetail {
	label: string;
	value: string;
}

interface OverviewItem {
	label: string;
	value: string;
}

interface VehicleFeatures {
	internal: string[];
	external: string[];
}

export interface VehicleData {
	title: string;
	rentPerDay: string;
	images: VehicleImage;
	priceDetails: PriceDetail[];
	overview: OverviewItem[];
	features: VehicleFeatures;
}

interface VehicleSingleProps {
	vehicle: VehicleData;
}

const VehicleSingle: React.FC<VehicleSingleProps> = ({ vehicle }) => {
	return (
		<>
			<div className="vehicle-single-block vehicle-padding">
				{" "}
				<div className="container">
					{" "}
					<div className="row">
						{/* Main content */}{" "}
						<div className="col-md-8">
							{" "}
							<VehicleGallery images={vehicle.images.fullView} />
							{/* Vehicle Info */}
							<div className="vehicle-single-content">
								<div className="tb mb-block">
									<div className="tb-cell mb-block">
										<h2 className="vehicle-single-title">{vehicle.title}</h2>
									</div>
									<div className="tb-cell mb-block">
										<h2 className="pull-right rent-price">
											Aluguer/Dia: {vehicle.rentPerDay}
										</h2>
									</div>
								</div>

								{/* Price Details */}
								<div className="price-details">
									<h3 className="details-title">Detalhes do Preço</h3>
									<ul>
										{vehicle.priceDetails.map((item, idx) => (
											<li key={idx}>{`${item.label}: ${item.value}`}</li>
										))}
									</ul>
								</div>

								{/* Overview */}
								<div className="vehicle-overview">
									<h3 className="overview-title">Detalhes do Veículo</h3>
									<ul>
										{vehicle.overview.map((item, idx) => (
											<li key={idx}>
												{item.label}: <span>{item.value}</span>
											</li>
										))}
									</ul>
								</div>

								{/* Features */}
								<div className="vehicle-internal-features">
									<div className="row">
										<div className="col-md-6">
											<h3 className="features-title">Funções Internas</h3>
											<ul className="features-list">
												{vehicle.features.internal.map((feature, idx) => (
													<li key={idx}>{feature}</li>
												))}
											</ul>
										</div>
										<div className="col-md-6">
											<h3 className="features-title">Funções Externas</h3>
											<ul className="features-list">
												{vehicle.features.external.map((feature, idx) => (
													<li key={idx}>{feature}</li>
												))}
											</ul>
										</div>
									</div>
								</div>
							</div>
							<div className="hidden-md hidden-lg text-center extend-btn">
								<span className="extend-icon">
									<i className="fa fa-angle-down"></i>
								</span>
							</div>
						</div>
						{/* Sidebar */}
						<div className="col-md-4">
							<div className="vehicle-sidebar pd-zero">
								<form className="advance-search-query search-query-two">
									<h2 className="form-title">Faça uma Reserva</h2>
									<div className="form-content available-filter">
										<div className="regular-search">
											<div className="form-group">
												<label className="text-uppercase">
													Local de levantamento
												</label>
												<div className="input">
													<i className="fa fa-map-marker"></i>
													<input
														type="text"
														placeholder="Digite o local"
														className="pick-location form-controller"
													/>
												</div>

												<label className="text-uppercase">
													Local de devolução
												</label>
												<div className="input">
													<i className="fa fa-map-marker"></i>
													<input
														type="text"
														placeholder="Digite o local"
														className="pick-location form-controller"
													/>
												</div>

												<label>Data de levantamento</label>
												<div className="input">
													<i className="fa fa-calendar"></i>
													<input
														type="text"
														className="date-start date-selector form-controller"
														placeholder="Data de levantamento"
													/>
												</div>

												<label>Data de devolução</label>
												<div className="input">
													<i className="fa fa-calendar"></i>
													<input
														type="text"
														className="date-end date-selector form-controller"
														placeholder="Data de devolução"
													/>
												</div>

												<label className="text-uppercase">
													Hora de levantamento
												</label>
												<div className="input">
													<i className="fa fa-clock-o"></i>
													<input
														type="text"
														className="time-selector form-controller"
														placeholder="15:00"
													/>
												</div>

												<label className="text-uppercase">
													Hora de devolução
												</label>
												<div className="input">
													<i className="fa fa-clock-o"></i>
													<input
														type="text"
														className="time-selector form-controller"
														placeholder="15:00"
													/>
												</div>

												<label className="text-uppercase">
													Selecionar Classe
												</label>
												<div className="input">
													<select>
														<option value="0">Intermediário</option>
														<option value="1">Compacto</option>
														<option value="2">Station Wagon</option>
														<option value="3">SUV</option>
														<option value="4">Minibus</option>
													</select>
												</div>

												<label className="text-uppercase">
													Selecionar Combustível
												</label>
												<div className="input">
													<select>
														<option value="0">Gasolina</option>
														<option value="1">Diesel</option>
														<option value="2">Gás</option>
													</select>
												</div>
											</div>
										</div>

										<div className="advance-search">
											<div className="form-group">
												<label className="text-uppercase">
													Cadeiras para Crianças
												</label>
												<div className="input">
													<select>
														<option value="0">0</option>
														<option value="1">1</option>
														<option value="2">2</option>
														<option value="3">3</option>
														<option value="4">4</option>
														<option value="5">5</option>
													</select>
												</div>

												<div className="advance-filters">
													<label>Recursos</label>
													<ul className="checkbox-content">
														<li>
															<input
																type="checkbox"
																id="gps-tracker"
																name="check"
																value="check"
															/>
															<label htmlFor="gps-tracker">GPS</label>
														</li>
														<li>
															<input
																type="checkbox"
																id="hand-controls"
																name="check"
																value="check"
															/>
															<label htmlFor="hand-controls">
																Controlo Manual
															</label>
														</li>
														<li>
															<input
																type="checkbox"
																id="electric-windows"
																name="check"
																value="check"
															/>
															<label htmlFor="electric-windows">
																Vidros Elétricos
															</label>
														</li>
														<li>
															<input
																type="checkbox"
																id="air-bags"
																name="check"
																value="check"
															/>
															<label htmlFor="air-bags">Airbags</label>
														</li>
													</ul>
												</div>
											</div>
										</div>

										<div className="check-vehicle-footer">
											<button type="submit" className="button yellow-button">
												Reserve Agora
											</button>
										</div>
									</div>
								</form>

								<div className="ads_area">
									<a href="#">
										<img src="/assets/images/Add-Image.jpg" alt="add" />
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<PopularVehicleBlock />
		</>
	);
};

export default VehicleSingle;
