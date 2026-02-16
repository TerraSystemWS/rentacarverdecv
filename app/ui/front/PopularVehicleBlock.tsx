// PopularVehicleBlock.tsx
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

import { API_BASE_URL } from "@/lib/api/endpoints";

export default function PopularVehicleBlock() {
	const [vehicles, setVehicles] = useState<Vehicle[]>([]);
	const [loading, setLoading] = useState(true);

	const getImageSrc = (url: string) => {
		if (!url) return "";
		if (url.startsWith('/uploads')) {
			return `${API_BASE_URL}${url}`;
		}
		return url;
	};

	useEffect(() => {
		const fetchVehicles = async () => {
			try {
				const res = await authFetch(endpoints.vehicles.list(8), { auth: false });
				if (res.ok) {
					const data = await res.json();
					setVehicles(data);
				}
			} catch (error) {
				console.error("Error fetching popular vehicles:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchVehicles();
	}, []);

	return (
		<section className="popular-vehicle-block py-24 bg-yellow-50">
			<div className="container mx-auto px-4">
				{/* Header */}
				<div className="row tb default-margin-bottom yellow-theme">
					<div className="col-md-9 col-sm-8 block-title-area tb-cell">
						<div className="heading-content style-one border">
							<h3 className="subtitle">Serviços Mais Populares</h3>
							<h2 className="title">Veiculos populares</h2>
						</div>
					</div>

					<div className="col-md-3 col-sm-4 hidden-xs block-navigation-area tb-cell">
						<div className="pull-right">
							<div className="item-navigation hidden-xs">
								<button className="previous-item bg-white w-10 min-w-[2.5rem] h-10 border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition mr-2">
									<i className="fa fa-angle-left"></i>
								</button>
								<button className="next-item bg-white w-10 min-w-[2.5rem] h-10 border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition">
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

				{/* Slider */}
				{loading ? (
					<div className="flex justify-center py-20">
						<div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-yellow-500 border-r-transparent"></div>
					</div>
				) : (
					<Swiper
						modules={[Navigation]}
						navigation={{
							nextEl: ".next-item",
							prevEl: ".previous-item",
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
							<SwiperSlide key={vehicle.id} className="h-auto">
								<div className="vehicle-content bg-yellow-100 rounded-lg overflow-hidden shadow hover:shadow-lg transition h-full flex flex-col">
									<div className="vehicle-thumbnail">
										<Link href={`/cars/${vehicle.id}`}>
											<img
												src={vehicle.images && vehicle.images.length > 0 ? getImageSrc(vehicle.images[0].url) : ""}
												alt={`${vehicle.make} ${vehicle.model}`}
												className="w-full !h-48 !object-cover"
											/>
										</Link>
									</div>
									<div className="vehicle-bottom-content p-4 flex-grow">
										<h3 className="vehicle-title text-xl font-semibold">
											<Link href={`/cars/${vehicle.id}`}>{vehicle.make} {vehicle.model}</Link>
										</h3>
										<div className="vehicle-meta text-gray-700 mt-2">
											<span className="font-bold">
												{vehicle.pricePerDay?.toLocaleString('pt-CV', { style: 'currency', currency: 'CVE' })} / Dia
											</span>
										</div>
									</div>
								</div>
							</SwiperSlide>
						))}
					</Swiper>
				)}

				{/* Mobile "View all" */}
				<div className="block mt-6 md:hidden text-center">
					<Link
						href="/cars"
						className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
					>
						Ver Todas
					</Link>
				</div>
			</div>
		</section>
	);
}
