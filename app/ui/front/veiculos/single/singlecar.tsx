import React from "react";
import VehicleGallery from "./veiculoGalery";
import PopularVehicleBlock from "../../PopularVehicleBlock";
import { Vehicle } from "@/lib/api/types";

interface VehicleSingleProps {
	vehicle: Vehicle;
}

const VehicleSingle: React.FC<VehicleSingleProps> = ({ vehicle }) => {
	const getImageSrc = (url: string) => {
		if (!url) return "";
		if (url.startsWith('/uploads')) {
			return `http://localhost:8090${url}`;
		}
		return url;
	};

	const galleryImages = vehicle.images?.map(img => ({
		src: getImageSrc(img.url),
		alt: `${vehicle.make} ${vehicle.model}`
	})) || [];

	const overview = [
		{ label: "Class", value: vehicle.classType },
		{ label: "Gear box", value: vehicle.gearbox },
		{ label: "Mileage", value: vehicle.mileage },
		{ label: "Max passengers", value: vehicle.maxPassengers },
		{ label: "Fuel", value: vehicle.fuelType },
		{ label: "Max luggage", value: vehicle.maxLuggage },
		{ label: "Fuel usage", value: vehicle.fuelUsage },
		{ label: "Doors", value: vehicle.doors },
		{ label: "Engine capacity", value: vehicle.engineCapacity },
		{ label: "Deposit", value: vehicle.deposit ? `${vehicle.deposit} USD` : "N/A" },
	];

	return (
		<>
			<div className="vehicle-single-block vehicle-padding">
				<div className="container">
					<div className="row">
						{/* Main content */}
						<div className="col-md-8">
							<VehicleGallery images={galleryImages} />
							{/* Vehicle Info */}
							<div className="vehicle-single-content">
								<div className="tb mb-block">
									<div className="tb-cell mb-block">
										<h2 className="vehicle-single-title">{vehicle.make} {vehicle.model} ({vehicle.year})</h2>
									</div>
									<div className="tb-cell mb-block">
										<h2 className="pull-right rent-price">
											Aluguer/Dia: {vehicle.pricePerDay?.toLocaleString('pt-CV', { style: 'currency', currency: 'CVE' })}
										</h2>
									</div>
								</div>

								{/* Overview */}
								<div className="vehicle-overview">
									<h3 className="overview-title">Detalhes do Veículo</h3>
									<ul>
										{overview.map((item, idx) => (
											<li key={idx}>
												{item.label}: <span>{item.value || "N/A"}</span>
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
												{vehicle.internalFeatures?.map((feature, idx) => (
													<li key={idx}>{feature}</li>
												))}
												{(!vehicle.internalFeatures || vehicle.internalFeatures.length === 0) && (
													<li className="text-muted-foreground opacity-50 italic">Nenhuma</li>
												)}
											</ul>
										</div>
										<div className="col-md-6">
											<h3 className="features-title">Funções Externas</h3>
											<ul className="features-list">
												{vehicle.externalFeatures?.map((feature, idx) => (
													<li key={idx}>{feature}</li>
												))}
												{(!vehicle.externalFeatures || vehicle.externalFeatures.length === 0) && (
													<li className="text-muted-foreground opacity-50 italic">Nenhuma</li>
												)}
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
														<option value="0">{vehicle.classType || "Compacto"}</option>
													</select>
												</div>

												<label className="text-uppercase">
													Selecionar Combustível
												</label>
												<div className="input">
													<select>
														<option value="0">{vehicle.fuelType || "Gasolina"}</option>
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
																checked={vehicle.internalFeatures?.includes("Satellite Tracker")}
																readOnly
															/>
															<label htmlFor="gps-tracker">GPS</label>
														</li>
														<li>
															<input
																type="checkbox"
																id="electric-windows"
																name="check"
																value="check"
																checked
																readOnly
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
																checked
																readOnly
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
