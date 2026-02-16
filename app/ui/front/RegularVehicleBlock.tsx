// RegularVehicleBlock.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";
import { Vehicle } from "@/lib/api/types";
import { authFetch } from "@/app/auth/api";
import { endpoints } from "@/lib/api/endpoints";

const RegularVehicleBlock: React.FC = () => {
	const [vehicles, setVehicles] = useState<Vehicle[]>([]);
	const [loading, setLoading] = useState(true);

	const getImageSrc = (url: string) => {
		if (!url) return "";
		if (url.startsWith('/uploads')) {
			return `http://localhost:8090${url}`;
		}
		return url;
	};

	useEffect(() => {
		const fetchVehicles = async () => {
			try {
				const res = await authFetch(endpoints.vehicles.list(16), { auth: false });
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
		<div className="regular-vehicle-block pd-90 bg-gray-color">
			<div className="container">
				<div className="row tb default-margin-bottom yellow-theme">
					<div className="col-md-9 col-sm-8 block-title-area tb-cell">
						<div className="heading-content style-one border">
							<h3 className="subtitle">
								Encontre o carro perfeito para sua viagem segura
							</h3>
							<h2 className="title">Nossos Carros Disponíveis</h2>
						</div>
					</div>
					<div className="col-md-3 col-sm-4 hidden-xs block-navigation-area tb-cell">
						<div className="pull-right">
							<div className="item-navigation">
								<button className="previous-item-reg bg-white w-10 min-w-[2.5rem] h-10 border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition mr-2">
									<i className="fa fa-angle-left"></i>
								</button>
								<button className="next-item-reg bg-white w-10 min-w-[2.5rem] h-10 border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition">
									<i className="fa fa-angle-right"></i>
								</button>
							</div>

							<div className="view-all-item">
								<Link href="/cars" className="view-all-btn">
									Ver Todas
								</Link>
							</div>
						</div>
					</div>
				</div>

				<div className="">
					{loading ? (
						<div className="flex justify-center py-20">
							<div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-yellow-500 border-r-transparent"></div>
						</div>
					) : (
						<div className="item row">
							<Swiper
								modules={[Navigation]}
								navigation={{
									nextEl: ".next-item-reg",
									prevEl: ".previous-item-reg",
								}}
								spaceBetween={24}
								slidesPerView={1}
								breakpoints={{
									640: { slidesPerView: 1 },
									768: { slidesPerView: 2 },
									1024: { slidesPerView: 3 },
									1280: { slidesPerView: 4 },
								}}
							>
								{vehicles.map((vehicle) => (
									<SwiperSlide key={vehicle.id}>
										<div className="vehicle-content bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition h-full">
											<div className="vehicle-thumbnail">
												<Link href={`/cars/${vehicle.id}`}>
													<img
														src={vehicle.images && vehicle.images.length > 0 ? getImageSrc(vehicle.images[0].url) : ""}
														alt={`${vehicle.make} ${vehicle.model}`}
														className="w-full h-48 object-cover"
													/>
												</Link>
											</div>
											<div className="vehicle-bottom-content p-4 text-center">
												<h3 className="vehicle-title text-xl font-semibold">
													<Link href={`/cars/${vehicle.id}`}>{vehicle.make} {vehicle.model}</Link>
												</h3>
												<div className="vehicle-meta text-gray-700 mt-2">
													<span className="font-bold text-yellow-600">
														{vehicle.pricePerDay?.toLocaleString('pt-CV', { style: 'currency', currency: 'CVE' })} / Dia
													</span>
												</div>
											</div>
										</div>
									</SwiperSlide>
								))}
							</Swiper>
						</div>
					)}
				</div>

				<div className="block-navigation-area visible-xs-block">
					<div className="view-all-item clearfix">
						<Link href="/cars" className="view-all-btn">
							Ver Todas
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default RegularVehicleBlock;
