"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

interface FormData {
	localRetirada: string;
	dataRetirada: string;
	horaRetirada: string;
	localDevolucao: string;
	dataDevolucao: string;
	horaDevolucao: string;
	orcamento: string;
	classe: string;
	combustivel: string;
}

const CheckVehicleArea = () => {
	const [formData, setFormData] = useState<FormData>({
		localRetirada: "",
		dataRetirada: "",
		horaRetirada: "",
		localDevolucao: "",
		dataDevolucao: "",
		horaDevolucao: "",
		orcamento: "",
		classe: "",
		combustivel: "",
	});
	const router = useRouter();
	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		setFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const hasValue = Object.values(formData).some((value) => value.trim() !== "");
		if (!hasValue) {
			Swal.fire({
				icon: "warning",
				title: "Atenção",
				text: "Por favor, preencha pelo menos um campo para pesquisar.",
				confirmButtonColor: "#ffcc00"
			});
			return;
		}

		const params = new URLSearchParams();

		if (formData.localRetirada) params.append("loc", formData.localRetirada);
		if (formData.dataRetirada) params.append("date", formData.dataRetirada);
		if (formData.orcamento) params.append("budget", formData.orcamento);
		if (formData.classe && formData.classe !== "0") params.append("class", formData.classe);
		if (formData.combustivel && formData.combustivel !== "X") params.append("fuel", formData.combustivel);

		router.push(`/cars?${params.toString()}`);
	};

	return (
		<div className="check-vehicle-block gray-20">
			<div className="container">
				<div className="row">
					<div className="col-md-4">
						<div className="check-content">
							<h4 className="top-subtitle">Procure seu Veículo</h4>
							<h2 className="title yellow-color">
								Para tarifas & Disponibilidade
							</h2>
							<h3 className="subtitle">Encontre o Melhor Carro</h3>
						</div>
					</div>

					<div className="col-md-8">
						<form
							onSubmit={handleSubmit}
							className="advance-search-query input-night-rider yellow-theme"
						>
							<div className="regular-search">
								<div className="row">
									<div className="col-md-4">
										<label>Local de retirada</label>
										<div className="input">
											<i className="fa fa-map-marker"></i>
											<input
												type="text"
												name="localRetirada"
												placeholder="Seu local"
												className="pick-location form-controller"
												value={formData.localRetirada}
												onChange={handleChange}
											/>
										</div>
									</div>

									<div className="col-md-4">
										<label>Data de retirada</label>
										<div className="input">
											<i className="fa fa-calendar"></i>
											<input
												type="text"
												name="dataRetirada"
												className="date-start date-selector form-controller"
												placeholder="dd/mm/aa"
												value={formData.dataRetirada}
												onChange={handleChange}
											/>
										</div>
									</div>

									<div className="col-md-4">
										<label>Hora de retirada</label>
										<div className="input">
											<i className="fa fa-clock-o"></i>
											<input
												type="text"
												name="horaRetirada"
												className="time-selector form-controller"
												placeholder="15:00"
												value={formData.horaRetirada}
												onChange={handleChange}
											/>
										</div>
									</div>

									<div className="clearfix"></div>

									<div className="col-md-4">
										<label>Local de devolução</label>
										<div className="input">
											<i className="fa fa-map-marker"></i>
											<input
												type="text"
												name="localDevolucao"
												placeholder="Local de devolução"
												className="drop-location form-controller"
												value={formData.localDevolucao}
												onChange={handleChange}
											/>
										</div>
									</div>

									<div className="col-md-4">
										<label>Data de devolução</label>
										<div className="input">
											<i className="fa fa-calendar"></i>
											<input
												type="text"
												name="dataDevolucao"
												className="date-end date-selector form-controller"
												placeholder="dd/mm/aa"
												value={formData.dataDevolucao}
												onChange={handleChange}
											/>
										</div>
									</div>

									<div className="col-md-4">
										<label>Hora de devolução</label>
										<div className="input">
											<i className="fa fa-clock-o"></i>
											<input
												type="text"
												name="horaDevolucao"
												className="time-selector form-controller"
												placeholder="12:00"
												value={formData.horaDevolucao}
												onChange={handleChange}
											/>
										</div>
									</div>
								</div>
							</div>

							<div className="advance-search">
								<div className="row">
									<div className="col-md-4">
										<label>Seu Orçamento</label>
										<div className="input">
											<i className="fa fa-money"></i>
											<input
												type="text"
												name="orcamento"
												className="budget-fields form-controller"
												placeholder="A partir de R$ 20"
												value={formData.orcamento}
												onChange={handleChange}
											/>
										</div>
									</div>
									<div className="col-md-4">
										<label>Classe</label>
										<div className="input">
											<select
												name="classe"
												value={formData.classe}
												onChange={handleChange}
											>
												<option value="">Todas</option>
												<option value="Intermediário">Intermediário</option>
												<option value="Compacto">Compacto</option>
												<option value="Station Wagon">Station Wagon</option>
												<option value="SUV">SUV</option>
												<option value="Micro-ônibus">Micro-ônibus</option>
											</select>
										</div>
									</div>
									<div className="col-md-4">
										<label>Combustível</label>
										<div className="input">
											<select
												name="combustivel"
												value={formData.combustivel}
												onChange={handleChange}
											>
												<option value="X">Qualquer</option>
												<option value="Gasolina">Gasolina</option>
												<option value="Diesel">Diesel</option>
												<option value="Etanol">Etanol</option>
												<option value="Híbrido">Híbrido</option>
												<option value="Elétrico">Elétrico</option>
											</select>
										</div>
									</div>
								</div>
							</div>

							<div className="check-vehicle-footer">
								<div className="row flex justify-end">
									<button type="submit" className="button">
										Encontrar carro
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CheckVehicleArea;
