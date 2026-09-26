"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ptBR } from "date-fns/locale";
import { localDateString, parseLocalDate } from "@/lib/utils/cvTime";
import { useRentalLocations } from "@/lib/api/useRentalLocations";

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
	const { locations, loading: locationsLoading } = useRentalLocations();
	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		setFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	// Datas guardadas como "YYYY-MM-DD" (dia local, sem fuso — ver cvTime).
	// Se a retirada passar para depois da devolução, limpa a devolução.
	const setDate = (field: "dataRetirada" | "dataDevolucao", date: Date | null) => {
		setFormData((prev) => {
			const next = { ...prev, [field]: date ? localDateString(date) : "" };
			if (field === "dataRetirada" && next.dataRetirada && next.dataDevolucao && next.dataDevolucao < next.dataRetirada) {
				next.dataDevolucao = "";
			}
			return next;
		});
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const hasValue = Object.values(formData).some((value) => value.trim() !== "");
		if (!hasValue) {
			Swal.fire({
				icon: "warning",
				title: "Atenção",
				text: "Por favor, preencha pelo menos um campo para pesquisar.",
				confirmButtonColor: "#3baa4e"
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
		<div className="check-vehicle-block gray-20" id="reservar">
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
											<select
												name="localRetirada"
												className="form-controller"
												value={formData.localRetirada}
												onChange={handleChange}
												disabled={locationsLoading}
											>
												<option value="">{locationsLoading ? "A carregar locais..." : "Escolha o local"}</option>
												{locations.map((l) => (
													<option key={l.id} value={l.id}>{l.name}</option>
												))}
											</select>
										</div>
									</div>

									<div className="col-md-4">
										<label>Data de retirada</label>
										<div className="input">
											<i className="fa fa-calendar"></i>
											<DatePicker
												selected={parseLocalDate(formData.dataRetirada)}
												onChange={(date: Date | null) => setDate("dataRetirada", date)}
												dateFormat="dd/MM/yyyy"
												locale={ptBR}
												minDate={new Date()}
												name="dataRetirada"
												className="form-controller"
												placeholderText="dd/mm/aaaa"
												autoComplete="off"
											/>
										</div>
									</div>

									<div className="col-md-4">
										<label>Hora de retirada</label>
										<div className="input">
											<i className="fa fa-clock-o"></i>
											<input
												type="time"
												name="horaRetirada"
												className="form-controller"
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
											<select
												name="localDevolucao"
												className="form-controller"
												value={formData.localDevolucao}
												onChange={handleChange}
												disabled={locationsLoading}
											>
												<option value="">{locationsLoading ? "A carregar locais..." : "Igual ao levantamento"}</option>
												{locations.map((l) => (
													<option key={l.id} value={l.id}>{l.name}</option>
												))}
											</select>
										</div>
									</div>

									<div className="col-md-4">
										<label>Data de devolução</label>
										<div className="input">
											<i className="fa fa-calendar"></i>
											<DatePicker
												selected={parseLocalDate(formData.dataDevolucao)}
												onChange={(date: Date | null) => setDate("dataDevolucao", date)}
												dateFormat="dd/MM/yyyy"
												locale={ptBR}
												minDate={parseLocalDate(formData.dataRetirada) ?? new Date()}
												name="dataDevolucao"
												className="form-controller"
												placeholderText="dd/mm/aaaa"
												autoComplete="off"
											/>
										</div>
									</div>

									<div className="col-md-4">
										<label>Hora de devolução</label>
										<div className="input">
											<i className="fa fa-clock-o"></i>
											<input
												type="time"
												name="horaDevolucao"
												className="form-controller"
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
