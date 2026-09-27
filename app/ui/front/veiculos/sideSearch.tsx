import React from "react";
import { Vehicle } from "@/lib/api/types";
import { useTranslations } from "next-intl";
import { useVehicleTerms } from "@/lib/i18n/useVehicleTerms";

export interface CarFilters {
	q: string;
	minPrice: string;
	maxPrice: string;
	classTypes: string[];
	fuelTypes: string[];
	gearboxes: string[];
}

export const emptyFilters: CarFilters = {
	q: "",
	minPrice: "",
	maxPrice: "",
	classTypes: [],
	fuelTypes: [],
	gearboxes: [],
};

interface SideSearchProps {
	vehicles: Vehicle[];
	filters: CarFilters;
	onChange: (filters: CarFilters) => void;
}

// Filtros reais, derivados dos dados existentes — antes disto era um
// template estático (marcas/modelos fictícios, botão "Filtrar" que não fazia
// nada, action="#").
const SideSearch: React.FC<SideSearchProps> = ({ vehicles, filters, onChange }) => {
	const t = useTranslations("filters");
	const term = useVehicleTerms();
	const distinct = (values: (string | undefined)[]) =>
		Array.from(new Set(values.filter((v): v is string => !!v && v.trim().length > 0))).sort();

	const classTypes = distinct(vehicles.map((v) => v.classType));
	const fuelTypes = distinct(vehicles.map((v) => v.fuelType));
	const gearboxes = distinct(vehicles.map((v) => v.gearbox));

	function toggle(list: string[], value: string): string[] {
		return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
	}

	return (
		<div className="vehicle-sidebar">
			<form onSubmit={handleSubmit} className="advance-search-query">
				<h2 className="form-title">{t("title")}</h2>
				<div className="form-content available-filter">
					{/* Pesquisa Rápida */}
					<div className="form-group">
						<div className="input">
							<input
								type="text"
								placeholder={t("quickSearch")}
								aria-label={t("quickSearch")}
								className="calendar form-controller"
								value={filters.q}
								onChange={(e) => onChange({ ...filters, q: e.target.value })}
							/>
						</div>
					</div>

					{/* Preço */}
					<div className="form-group">
						<label>{t("pricePerDay")}</label>
						<div className="input">
							<div className="row">
								<div className="col-xs-6">
									<input
										type="number"
										min={0}
										placeholder={t("min")}
										aria-label={`${t("pricePerDay")} ${t("min")}`}
										className="calendar form-controller min"
										value={filters.minPrice}
										onChange={(e) => onChange({ ...filters, minPrice: e.target.value })}
									/>
								</div>
								<div className="col-xs-6">
									<input
										type="number"
										min={0}
										placeholder={t("max")}
										aria-label={`${t("pricePerDay")} ${t("max")}`}
										className="calendar form-controller"
										value={filters.maxPrice}
										onChange={(e) => onChange({ ...filters, maxPrice: e.target.value })}
									/>
								</div>
							</div>
						</div>
					</div>

					{/* Filtros Avançados */}
					<div className="advance-filters">
						{classTypes.length > 0 && (
							<>
								<label>{t("category")}</label>
								<ul className="checkbox-content">
									{classTypes.map((c) => (
										<li key={c}>
											<input
												type="checkbox"
												id={`class-${c}`}
												checked={filters.classTypes.includes(c)}
												onChange={() => onChange({ ...filters, classTypes: toggle(filters.classTypes, c) })}
											/>
											<label htmlFor={`class-${c}`}>{term(c)}</label>
										</li>
									))}
								</ul>
							</>
						)}

						{fuelTypes.length > 0 && (
							<>
								<label>{t("fuel")}</label>
								<ul className="checkbox-content">
									{fuelTypes.map((f) => (
										<li key={f}>
											<input
												type="checkbox"
												id={`fuel-${f}`}
												checked={filters.fuelTypes.includes(f)}
												onChange={() => onChange({ ...filters, fuelTypes: toggle(filters.fuelTypes, f) })}
											/>
											<label htmlFor={`fuel-${f}`}>{term(f)}</label>
										</li>
									))}
								</ul>
							</>
						)}

						{gearboxes.length > 0 && (
							<>
								<label>{t("gearbox")}</label>
								<ul className="checkbox-content">
									{gearboxes.map((g) => (
										<li key={g}>
											<input
												type="checkbox"
												id={`gearbox-${g}`}
												checked={filters.gearboxes.includes(g)}
												onChange={() => onChange({ ...filters, gearboxes: toggle(filters.gearboxes, g) })}
											/>
											<label htmlFor={`gearbox-${g}`}>{term(g)}</label>
										</li>
									))}
								</ul>
							</>
						)}
					</div>

					{/* Botões */}
					<div className="filter-button">
						<button type="button" className="button nevy-bg" onClick={() => onChange({ ...filters })}>
							{t("apply")}
						</button>
						<button type="button" className="button nevy-bg" onClick={() => onChange({ ...emptyFilters })}>
							{t("reset")}
						</button>
					</div>
				</div>
			</form>
		</div>
	);
};

export default SideSearch;
