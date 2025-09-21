// PopularVehicleBlock.tsx
"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";

interface Vehicle {
	id: number;
	name: string;
	image: string;
	rent: number;
	kmPrice: number;
}

const vehicles: Vehicle[] = [
	{
		id: 1,
		name: "Toyota Aygo",
		image: "/assets/images/popular/popular-01.png",
		rent: 200,
		kmPrice: 12,
	},
	{
		id: 2,
		name: "Toyota Aygo",
		image: "/assets/images/popular/popular-02.png",
		rent: 200,
		kmPrice: 12,
	},
	{
		id: 3,
		name: "Toyota Aygo",
		image: "/assets/images/popular/popular-03.png",
		rent: 200,
		kmPrice: 12,
	},
	{
		id: 4,
		name: "Toyota Aygo",
		image: "/assets/images/popular/popular-04.png",
		rent: 200,
		kmPrice: 12,
	},
	{
		id: 5,
		name: "Toyota Aygo",
		image: "/assets/images/popular/popular-04.png",
		rent: 200,
		kmPrice: 12,
	},
	{
		id: 6,
		name: "Toyota Aygo",
		image: "/assets/images/popular/popular-04.png",
		rent: 200,
		kmPrice: 12,
	},
	{
		id: 7,
		name: "Toyota Aygo",
		image: "/assets/images/popular/popular-04.png",
		rent: 200,
		kmPrice: 12,
	},
	{
		id: 8,
		name: "Toyota Aygo",
		image: "/assets/images/popular/popular-04.png",
		rent: 200,
		kmPrice: 12,
	},
	{
		id: 9,
		name: "Toyota Aygo",
		image: "/assets/images/popular/popular-04.png",
		rent: 200,
		kmPrice: 12,
	},
];

export default function PopularVehicleBlock() {
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
								<Link href="" className="previous-item">
									<i className="fa fa-angle-left"></i>
								</Link>
								<Link href="" className="next-item">
									<i className="fa fa-angle-right"></i>
								</Link>
							</div>

							<div className="view-all-item">
								<Link href="/viaturas" className="view-all-btn">
									Ver Todas
								</Link>
							</div>
						</div>
					</div>
				</div>

				{/* Slider */}
				<Swiper
					modules={[Navigation]}
					navigation={{
						nextEl: ".previous-item",
						prevEl: ".next-item",
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
							<div className="vehicle-content bg-yellow-100 rounded-lg overflow-hidden shadow hover:shadow-lg transition">
								<div className="vehicle-thumbnail">
									<Link href="#">
										<img
											src={vehicle.image}
											alt={vehicle.name}
											className="w-full h-48 object-cover"
										/>
									</Link>
								</div>
								<div className="vehicle-bottom-content p-4">
									<h3 className="vehicle-title text-xl font-semibold">
										<Link href="#">{vehicle.name}</Link>
									</h3>
									<div className="vehicle-meta text-gray-700 mt-2">
										<span>
											Valor: ${vehicle.rent} / Dia - ${vehicle.kmPrice} / Km
										</span>
									</div>
								</div>
							</div>
						</SwiperSlide>
					))}
				</Swiper>

				{/* Mobile "View all" */}
				<div className="block mt-6 md:hidden text-center">
					<Link
						href="#"
						className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
					>
						Ver Todas
					</Link>
				</div>
			</div>
		</section>
	);
}
