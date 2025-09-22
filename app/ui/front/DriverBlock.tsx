// DriverBlock.tsx
"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";

interface Driver {
	id: number;
	name: string;
	description: string;
	image: string;
}

const drivers: Driver[] = [
	{
		id: 1,
		name: "Johan Silva",
		description: "Trabalho em tempo integral, 27 anos",
		image: "/assets/images/driver/driver-01.jpg",
	},
	{
		id: 2,
		name: "Maria Fernandes",
		description: "Trabalho em tempo parcial, 32 anos",
		image: "/assets/images/driver/driver-02.jpg",
	},
	{
		id: 3,
		name: "Carlos Sousa",
		description: "Trabalho em tempo integral, 29 anos",
		image: "/assets/images/driver/driver-03.jpg",
	},
	{
		id: 4,
		name: "Ana Costa",
		description: "Trabalho em tempo parcial, 25 anos",
		image: "/assets/images/driver/driver-04.jpg",
	},
	{
		id: 5,
		name: "Carlos Sousa",
		description: "Trabalho em tempo integral, 29 anos",
		image: "/assets/images/driver/driver-03.jpg",
	},
	{
		id: 6,
		name: "Ana Costa",
		description: "Trabalho em tempo parcial, 25 anos",
		image: "/assets/images/driver/driver-04.jpg",
	},
];

const DriverBlock: React.FC = () => {
	return (
		<section className="driver-block py-24 bg-yellow-50">
			<div className="container mx-auto px-4">
				{/* Header */}
				<div className="row tb default-margin-bottom yellow-theme">
					<div className="col-md-9 block-title-area tb-cell">
						<div className="heading-content style-one border">
							<h3 className="subtitle">Tempo Integral e Parcial</h3>
							<h2 className="title">Motoristas Connosco</h2>
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
						<SwiperSlide key={driver.id}>
							<div className="driver-content vehicle-content theme-yellow bg-yellow-100 rounded-lg overflow-hidden shadow hover:shadow-lg transition">
								<div className="driver-thumb vehicle-thumbnail">
									<Link href="#">
										<img
											src={driver.image}
											alt={driver.name}
											className="w-full h-48 object-cover"
										/>
									</Link>
								</div>
								<div className="vehicle-bottom-content p-4 text-center">
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
