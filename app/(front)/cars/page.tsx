"use client";
import React, { useEffect, useState } from "react";
import PageHeader from "../../ui/front/PageHeader";
import Carro from "../../ui/front/veiculos/carro";
import SideSearch from "../../ui/front/veiculos/sideSearch";
import { Vehicle } from "@/lib/api/types";
import { authFetch } from "@/app/auth/api";
import { endpoints } from "@/lib/api/endpoints";

export default function CarsPage() {
	const [vehicles, setVehicles] = useState<Vehicle[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchVehicles = async () => {
			try {
				const res = await authFetch(endpoints.vehicles.list(), { auth: false });
				if (res.ok) {
					const data = await res.json();
					setVehicles(data);
				}
			} catch (error) {
				console.error("Error fetching vehicles:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchVehicles();
	}, []);

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
								{loading ? (
									<div className="col-md-12 text-center py-20">
										<div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-yellow-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
											<span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
										</div>
									</div>
								) : vehicles.length > 0 ? (
									vehicles.map((car) => (
										<div className="col-md-4 col-sm-6" key={car.id}>
											<Carro car={car} />
										</div>
									))
								) : (
									<div className="col-md-12 text-center py-20 text-muted-foreground">
										Nenhum veículo disponível no momento.
									</div>
								)}
							</div>

							{vehicles.length > 0 && (
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
													<a href="#">
														<i className="fa fa-angle-right"></i>
													</a>
												</li>
											</ul>
										</div>
									</div>
								</div>
							)}
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
