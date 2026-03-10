// DriverBlock.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Link from "next/link";
import { endpoints, API_BASE_URL } from "@/lib/api/endpoints";
import { Driver } from "@/lib/api/types";
import "swiper/css";
import "swiper/css/navigation";

const DriverBlock: React.FC = () => {
	const [drivers, setDrivers] = useState<Driver[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch(`${API_BASE_URL}${endpoints.drivers.list}`)
			.then(res => res.json())
			.then(data => {
				setDrivers(data);
				setLoading(false);
			})
			.catch(err => {
				console.error("Error fetching drivers", err);
				setLoading(false);
			});
	}, []);

	const getImageSrc = (url: string) => {
		if (!url) return "";
		if (url.startsWith('/uploads')) {
			return `${API_BASE_URL}${url}`;
		}
		return url;
	};

	if (loading || drivers.length === 0) {
		return null; // or a loading spinner
	}

	return (
		<section className="driver-block py-24 bg-yellow-50">
			<div className="container mx-auto px-4">
				{/* Header */}
				<div className="row tb default-margin-bottom yellow-theme">
					<div className="col-md-9 block-title-area tb-cell">
						<div className="heading-content style-one border">
							<h3 className="subtitle">Tempo Integral e Parcial</h3>
							<h2 className="title">Nossos Motoristas</h2>
						</div>
					</div>

					<div className="col-md-3 hidden-xs block-navigation-area tb-cell">
						<div className="pull-right">
							<div className="item-navigation hidden-xs flex gap-2">
								<Link href="" className="previous-item">
									<i className="fa fa-angle-left"></i>
								</Link>
								<Link href="" className="next-item">
									<i className="fa fa-angle-right"></i>
								</Link>
							</div>
							<div className="view-all-item mt-2">
								<Link
									href="/motoristas"
									className="view-all-btn px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
								>
									Ver Todos
								</Link>
							</div>
						</div>
					</div>
				</div>

				{/* Slider */}
				<Swiper
					modules={[Navigation]}
					navigation={{
						prevEl: ".previous-item",
						nextEl: ".next-item",
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
					{drivers.map((driver) => (
						<SwiperSlide key={driver.id} className="h-auto">
							<div className="driver-content vehicle-content theme-yellow bg-yellow-100 rounded-lg overflow-hidden shadow hover:shadow-lg transition h-full flex flex-col">
								<div className="driver-thumb vehicle-thumbnail flex bg-zinc-100 min-h-[192px] w-full">
									<Link href="#" className="w-full h-full block">
										{driver.imageUrl ? (
											<img
												src={getImageSrc(driver.imageUrl)}
												alt={driver.name}
												className="w-full h-full object-cover"
											/>
										) : (
											<img
												src="/assets/images/driver/avatar-placeholder.png"
												alt="Motorista"
												className="w-full h-full object-cover"
											/>
										)}
									</Link>
								</div>
								<div className="vehicle-bottom-content p-4 text-center flex-grow">
									<h3 className="driver-name vehicle-title text-xl font-semibold">
										<Link href="#">{driver.name}</Link>
									</h3>
									<h4 className="driver-desc text-gray-700 mt-2">
										{driver.description}
									</h4>
								</div>
							</div>
						</SwiperSlide>
					))}
				</Swiper>

				{/* Mobile "View All" */}
				<div className="block mt-6 md:hidden text-center">
					<Link
						href="/motoristas"
						className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
					>
						Ver Todos
					</Link>
				</div>
			</div>
		</section>
	);
};

export default DriverBlock;
