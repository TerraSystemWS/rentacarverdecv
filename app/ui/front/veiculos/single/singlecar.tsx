"use client";

import React, { useState } from "react";
import Swal from 'sweetalert2';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { ptBR } from 'date-fns/locale';
import VehicleGallery from "./veiculoGalery";
import PopularVehicleBlock from "../../PopularVehicleBlock";
import { Vehicle } from "@/lib/api/types";
import { useAuth } from "@/app/auth/AuthContext";
import { API_BASE_URL } from "@/lib/api/endpoints";

interface VehicleSingleProps {
	vehicle: Vehicle;
}

const VehicleSingle: React.FC<VehicleSingleProps> = ({ vehicle }) => {
	const { user, isAuthenticated, authFetch } = useAuth();
	const [formData, setFormData] = useState({
		pickupLocation: "",
		returnLocation: "",
		startDate: "",
		endDate: "",
		startTime: "10:00",
		endTime: "10:00",
		hasExtraDriver: false,
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

	const getImageSrc = (url: string) => {
		if (!url) return "";
		if (url.startsWith('/uploads')) {
			return `${API_BASE_URL}${url} `;
		}
		return url;
	};

	const galleryImages = vehicle.images?.map(img => ({
		src: getImageSrc(img.url),
		alt: `${vehicle.make} ${vehicle.model} `
	})) || [];

	const overview = [
		{ label: "Classe", value: vehicle.classType },
		{ label: "Câmbio", value: vehicle.gearbox },
		{ label: "Quilometragem", value: vehicle.mileage },
		{ label: "Max passageiros", value: vehicle.maxPassengers },
		{ label: "Combustível", value: vehicle.fuelType },
		{ label: "Max bagagem", value: vehicle.maxLuggage },
		{ label: "Consumo", value: vehicle.fuelUsage },
		{ label: "Portas", value: vehicle.doors },
		{ label: "Cilindrada", value: vehicle.engineCapacity },
		{ label: "Depósito", value: vehicle.deposit ? `${vehicle.deposit} CVE` : "N/A" },
	];

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value, type } = e.target;
		if (type === 'checkbox') {
			const checked = (e.target as HTMLInputElement).checked;
			setFormData(prev => ({ ...prev, [name]: checked }));
		} else {
			setFormData(prev => ({ ...prev, [name]: value }));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!isAuthenticated || !user?.id) {
			setMessage({ type: 'error', text: "Apenas utilizadores logados podem fazer reservas." });
			return;
		}

		if (!formData.startDate || !formData.endDate || !formData.pickupLocation || !formData.returnLocation) {
			setMessage({ type: 'error', text: "Por favor preencha todos os campos obrigatórios." });
			return;
		}

		const start = new Date(`${formData.startDate}T${formData.startTime}:00Z`);
		const end = new Date(`${formData.endDate}T${formData.endTime}:00Z`);

		if (start >= end) {
			setMessage({ type: 'error', text: "A data de devolução deve ser posterior à data de levantamento." });
			return;
		}

		setIsSubmitting(true);
		setMessage(null);

		try {
			const res = await authFetch("/public/bookings", {
				method: "POST",
				body: JSON.stringify({
					vehicleId: vehicle.id,
					userId: user.id,
					startDate: start.toISOString(),
					endDate: end.toISOString(),
					hasExtraDriver: formData.hasExtraDriver
				})
			});

			if (res.ok) {
				const bookingData = await res.json();
				setMessage({ type: 'success', text: "Reserva efetuada! Redirecionando para o pagamento..." });

				// Redirect to payment page after a short delay
				setTimeout(() => {
					window.location.href = `/payment/${bookingData.id}`;
				}, 1500);
			} else {
				const errorData = await res.json().catch(() => ({ message: "Erro ao processar reserva." }));
				setMessage({ type: 'error', text: errorData.message || "Ocorreu um erro ao processar a reserva." });
			}
		} catch (error) {
			console.error("Booking error:", error);
			setMessage({ type: 'error', text: "Erro de conexão com o servidor." });
		} finally {
			setIsSubmitting(false);
		}
	};

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
								<form className="advance-search-query search-query-two" onSubmit={handleSubmit}>
									<h2 className="form-title">Faça uma Reserva</h2>
									<div className="form-content available-filter">

										{message && (
											<div className={`p - 4 mb - 4 text - sm rounded - lg ${message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'} `}>
												{message.text}
											</div>
										)}

										{!isAuthenticated && (
											<div className="p-4 mb-6 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
												<i className="fa fa-info-circle mr-2"></i>
												Deverá fazer <strong>Login</strong> para realizar uma reserva.
											</div>
										)}

										<div className="regular-search">
											<div className="form-group">
												<label className="text-uppercase">Local de levantamento</label>
												<div className="input">
													<i className="fa fa-map-marker"></i>
													<input
														type="text"
														name="pickupLocation"
														value={formData.pickupLocation}
														onChange={handleInputChange}
														placeholder="Digite o local"
														className="pick-location form-controller"
														required
														disabled={!isAuthenticated}
													/>
												</div>

												<label className="text-uppercase">Local de devolução</label>
												<div className="input">
													<i className="fa fa-map-marker"></i>
													<input
														type="text"
														name="returnLocation"
														value={formData.returnLocation}
														onChange={handleInputChange}
														placeholder="Digite o local"
														className="pick-location form-controller"
														required
														disabled={!isAuthenticated}
													/>
												</div>

												<label>Data de levantamento</label>
												<div className="input relative">
													<i className="fa fa-calendar absolute right-3 top-3 text-gray-400 z-10 pointer-events-none"></i>
													<DatePicker
														selected={formData.startDate ? new Date(formData.startDate) : null}
														onChange={(date: Date | null) => {
															setFormData(prev => ({
																...prev,
																startDate: date ? date.toISOString().split('T')[0] : ""
															}));
														}}
														dateFormat="dd/MM/yyyy"
														locale={ptBR}
														minDate={new Date()}
														className="form-controller w-full bg-transparent"
														placeholderText="dd/mm/aaaa"
														required
														disabled={!isAuthenticated}
													/>
												</div>

												<label>Data de devolução</label>
												<div className="input relative">
													<i className="fa fa-calendar absolute right-3 top-3 text-gray-400 z-10 pointer-events-none"></i>
													<DatePicker
														selected={formData.endDate ? new Date(formData.endDate) : null}
														onChange={(date: Date | null) => {
															setFormData(prev => ({
																...prev,
																endDate: date ? date.toISOString().split('T')[0] : ""
															}));
														}}
														dateFormat="dd/MM/yyyy"
														locale={ptBR}
														minDate={formData.startDate ? new Date(formData.startDate) : new Date()}
														className="form-controller w-full bg-transparent"
														placeholderText="dd/mm/aaaa"
														required
														disabled={!isAuthenticated}
													/>
												</div>

												<div className="row">
													<div className="col-xs-6">
														<label>Hora Levantamento</label>
														<div className="input">
															<i className="fa fa-clock-o"></i>
															<input
																type="time"
																name="startTime"
																value={formData.startTime}
																onChange={handleInputChange}
																className="form-controller"
																required
																disabled={!isAuthenticated}
															/>
														</div>
													</div>
													<div className="col-xs-6">
														<label>Hora Devolução</label>
														<div className="input">
															<i className="fa fa-clock-o"></i>
															<input
																type="time"
																name="endTime"
																value={formData.endTime}
																onChange={handleInputChange}
																className="form-controller"
																required
																disabled={!isAuthenticated}
															/>
														</div>
													</div>
												</div>
											</div>

											<div className="mt-4 mb-2 flex items-center">
												<input
													type="checkbox"
													id="hasExtraDriver"
													name="hasExtraDriver"
													checked={formData.hasExtraDriver}
													onChange={handleInputChange}
													disabled={!isAuthenticated}
													className="w-5 h-5 mr-3 text-yellow-600 rounded focus:ring-yellow-500 cursor-pointer"
												/>
												<label htmlFor="hasExtraDriver" className="text-gray-700 m-0 cursor-pointer select-none">
													Adicionar condutor extra <span className="text-yellow-600 font-bold">(+3300 CVE / dia)</span>
												</label>
											</div>
										</div>

										<div className="check-vehicle-footer">
											<button
												type="submit"
												className="button yellow-button w-full disabled:opacity-50"
												disabled={isSubmitting || !isAuthenticated}
											>
												{isSubmitting ? "Processando..." : "Reserve Agora"}
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
