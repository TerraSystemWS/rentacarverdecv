"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLocale, useTranslations } from "next-intl";
import { dateFnsLocale, PICKER_DATE_FORMAT } from "@/lib/i18n/dateLocale";
import { useVehicleTerms } from "@/lib/i18n/useVehicleTerms";
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
	const t = useTranslations("search");
	const locale = useLocale();
	const term = useVehicleTerms();
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
				title: t("warningTitle"),
				text: t("fillOneField"),
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
							<h4 className="top-subtitle">{t("topSubtitle")}</h4>
							<h2 className="title yellow-color">{t("title")}</h2>
							<h3 className="subtitle">{t("subtitle")}</h3>
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
										<label>{t("pickupLocation")}</label>
										<div className="input">
											<i className="fa fa-map-marker"></i>
											<select
												name="localRetirada"
												className="form-controller"
												value={formData.localRetirada}
												onChange={handleChange}
												disabled={locationsLoading}
											>
												<option value="">{locationsLoading ? t("loadingLocations") : t("chooseLocation")}</option>
												{locations.map((l) => (
													<option key={l.id} value={l.id}>{l.name}</option>
												))}
											</select>
										</div>
									</div>

									<div className="col-md-4">
										<label>{t("pickupDate")}</label>
										<div className="input">
											<i className="fa fa-calendar"></i>
											<DatePicker
												selected={parseLocalDate(formData.dataRetirada)}
												onChange={(date: Date | null) => setDate("dataRetirada", date)}
												dateFormat={PICKER_DATE_FORMAT}
												locale={dateFnsLocale(locale)}
												minDate={new Date()}
												name="dataRetirada"
												className="form-controller"
												placeholderText={t("datePlaceholder")}
												autoComplete="off"
											/>
										</div>
									</div>

									<div className="col-md-4">
										<label>{t("pickupTime")}</label>
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
										<label>{t("returnLocation")}</label>
										<div className="input">
											<i className="fa fa-map-marker"></i>
											<select
												name="localDevolucao"
												className="form-controller"
												value={formData.localDevolucao}
												onChange={handleChange}
												disabled={locationsLoading}
											>
												<option value="">{locationsLoading ? t("loadingLocations") : t("sameAsPickup")}</option>
												{locations.map((l) => (
													<option key={l.id} value={l.id}>{l.name}</option>
												))}
											</select>
										</div>
									</div>

									<div className="col-md-4">
										<label>{t("returnDate")}</label>
										<div className="input">
											<i className="fa fa-calendar"></i>
											<DatePicker
												selected={parseLocalDate(formData.dataDevolucao)}
												onChange={(date: Date | null) => setDate("dataDevolucao", date)}
												dateFormat={PICKER_DATE_FORMAT}
												locale={dateFnsLocale(locale)}
												minDate={parseLocalDate(formData.dataRetirada) ?? new Date()}
												name="dataDevolucao"
												className="form-controller"
												placeholderText={t("datePlaceholder")}
												autoComplete="off"
											/>
										</div>
									</div>

									<div className="col-md-4">
										<label>{t("returnTime")}</label>
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
										<label>{t("budget")}</label>
										<div className="input">
											<i className="fa fa-money"></i>
											<input
												type="text"
												name="orcamento"
												className="budget-fields form-controller"
												placeholder={t("budgetPlaceholder")}
												inputMode="numeric"
												value={formData.orcamento}
												onChange={handleChange}
											/>
										</div>
									</div>
									<div className="col-md-4">
										<label>{t("class")}</label>
										<div className="input">
											<select
												name="classe"
												value={formData.classe}
												onChange={handleChange}
											>
												<option value="">{t("allClasses")}</option>
												{/* Valores em PT (como na BD); o rótulo segue a língua. */}
												{["Compacto", "Económico", "SUV", "Luxo", "Carrinha"].map((c) => (
													<option key={c} value={c}>{term(c)}</option>
												))}
											</select>
										</div>
									</div>
									<div className="col-md-4">
										<label>{t("fuel")}</label>
										<div className="input">
											<select
												name="combustivel"
												value={formData.combustivel}
												onChange={handleChange}
											>
												<option value="X">{t("anyFuel")}</option>
												{["Gasolina", "Diesel", "Híbrido", "Elétrico"].map((f) => (
													<option key={f} value={f}>{term(f)}</option>
												))}
											</select>
										</div>
									</div>
								</div>
							</div>

							<div className="check-vehicle-footer">
								<div className="row flex justify-end">
									<button type="submit" className="button">
										{t("submit")}
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
