"use client";
import React, { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PageHeader from "../../ui/front/PageHeader";
import Carro from "../../ui/front/veiculos/carro";
import SideSearch, { CarFilters, emptyFilters } from "../../ui/front/veiculos/sideSearch";
import { Vehicle } from "@/lib/api/types";
import { authFetch } from "@/app/auth/api";
import { endpoints } from "@/lib/api/endpoints";
import { sameVehicleTerm } from "@/lib/i18n/useVehicleTerms";

const PAGE_SIZE = 9;

function CarsContent() {
	const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const searchParams = useSearchParams();

	// Estado inicial dos filtros a partir dos parâmetros de URL — permite que
	// a pesquisa da homepage (CheckVehicleArea) e do cabeçalho (Header, campo
	// "q") continuem a funcionar como pontos de entrada para esta página.
	const [filters, setFilters] = useState<CarFilters>(() => ({
		...emptyFilters,
		q: searchParams.get("q") || "",
		maxPrice: searchParams.get("budget") || "",
		classTypes: searchParams.get("class") ? [searchParams.get("class") as string] : [],
		fuelTypes: searchParams.get("fuel") ? [searchParams.get("fuel") as string] : [],
	}));

	useEffect(() => {
		const fetchVehicles = async () => {
			try {
				const res = await authFetch(endpoints.vehicles.list(), { auth: false });
				if (res.ok) {
					setAllVehicles(await res.json());
				}
			} catch (error) {
				console.error("Error fetching vehicles:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchVehicles();
	}, []);

	const vehicles = useMemo(() => {
		return allVehicles.filter((v) => {
			if (filters.q) {
				const q = filters.q.toLowerCase();
				const haystack = `${v.make} ${v.model}`.toLowerCase();
				if (!haystack.includes(q)) return false;
			}
			if (filters.minPrice && v.pricePerDay < parseFloat(filters.minPrice)) return false;
			if (filters.maxPrice && v.pricePerDay > parseFloat(filters.maxPrice)) return false;
			// Compara pelo termo normalizado: "Diesel" (pesquisa) encontra "DISEL" (BD).
			if (filters.classTypes.length > 0 && !filters.classTypes.some((c) => sameVehicleTerm(c, v.classType))) return false;
			if (filters.fuelTypes.length > 0 && !filters.fuelTypes.some((f) => sameVehicleTerm(f, v.fuelType))) return false;
			if (filters.gearboxes.length > 0 && !filters.gearboxes.some((g) => sameVehicleTerm(g, v.gearbox))) return false;
			return true;
		});
	}, [allVehicles, filters]);

	// Volta sempre à página 1 quando os filtros mudam, para nunca ficar numa
	// página vazia depois de um filtro reduzir os resultados.
	useEffect(() => {
		setPage(1);
	}, [filters]);

	const totalPages = Math.max(1, Math.ceil(vehicles.length / PAGE_SIZE));
	const pageVehicles = vehicles.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

	return (
		<>
			<PageHeader titulo="Home / Carros" descricao="Todos os Nossos Carros" />

			<div className="available-block vehicle-padding bg-gray-color">
				<div className="container">
					<div className="row">
						<div className="col-md-9">
							<div className="row">
								<div className="col-md-9 col-sm-9 clearfix">
									<h2 className="available-title">Veículos Disponíveis</h2>
								</div>
								<div className="col-md-3 col-sm-3">
									<div className="vehicle-category pull-right text-sm text-muted-foreground pt-2">
										{loading ? "" : `${vehicles.length} veículo(s) encontrado(s)`}
									</div>
								</div>
							</div>

							<div className="row">
								{loading ? (
									<div className="col-md-12 text-center py-20">
										<div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
											<span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
										</div>
									</div>
								) : pageVehicles.length > 0 ? (
									pageVehicles.map((car) => (
										<div className="col-md-4 col-sm-6" key={car.id}>
											<Carro car={car} />
										</div>
									))
								) : (
									<div className="col-md-12 text-center py-20 text-muted-foreground">
										Nenhum veículo encontrado com estes filtros.
									</div>
								)}
							</div>

							{totalPages > 1 && (
								<div className="row">
									<div className="col-md-12 clearfix">
										<div className="pagination-link">
											<ul className="pagination">
												<li className={page === 1 ? "disabled" : ""}>
													<button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
														<i className="fa fa-angle-left"></i>
													</button>
												</li>
												{Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
													<li key={p} className={p === page ? "active" : ""}>
														<button type="button" onClick={() => setPage(p)}>
															{String(p).padStart(2, "0")}
														</button>
													</li>
												))}
												<li className={page === totalPages ? "disabled" : ""}>
													<button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
														<i className="fa fa-angle-right"></i>
													</button>
												</li>
											</ul>
										</div>
									</div>
								</div>
							)}
						</div>

						<div className="col-md-3">
							<SideSearch vehicles={allVehicles} filters={filters} onChange={setFilters} />
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default function CarsPage() {
	return (
		<Suspense fallback={
			<div className="min-h-screen flex justify-center items-center">
				<div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-500 border-r-transparent align-[-0.125em]" role="status">
					<span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
				</div>
			</div>
		}>
			<CarsContent />
		</Suspense>
	);
}
