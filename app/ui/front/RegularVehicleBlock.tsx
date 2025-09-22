// RegularVehicleBlock.tsx
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

// Lista de veículos
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
		image: "/assets/images/popular/popular-05.png",
		rent: 200,
		kmPrice: 12,
	},
	{
		id: 6,
		name: "Toyota Aygo",
		image: "/assets/images/popular/popular-06.png",
		rent: 200,
		kmPrice: 12,
	},
	{
		id: 7,
		name: "Toyota Aygo",
		image: "/assets/images/popular/popular-07.png",
		rent: 200,
		kmPrice: 12,
	},
	{
		id: 8,
		name: "Toyota Aygo",
		image: "/assets/images/popular/popular-08.png",
		rent: 200,
		kmPrice: 12,
	},
];

// Função para dividir veículos em grupos de 4 (uma linha)
const chunkVehicles = (array: Vehicle[], size: number) => {
	const chunks: Vehicle[][] = [];
	for (let i = 0; i < array.length; i += size) {
		chunks.push(array.slice(i, i + size));
	}
	return chunks;
};

const RegularVehicleBlock: React.FC = () => {
	const slides = chunkVehicles(vehicles, 8); // 8 veículos por slide (2 linhas de 4)

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
								<a href="#" className="previous-item">
									<i className="fa fa-angle-left"></i>
								</a>
								<a href="#" className="next-item">
									<i className="fa fa-angle-right"></i>
								</a>
							</div>

							<div className="view-all-item">
								<a href="#" className="view-all-btn">
									Ver Todas
								</a>
							</div>
						</div>
					</div>
				</div>

				<div className="" data-item="">
					<div className="item row">
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
					</div>
					<div className="item row">
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
					</div>
				</div>

				<div className="block-navigation-area visible-xs-block">
					<div className="view-all-item clearfix">
						<a href="#" className="view-all-btn">
							Ver Todas
						</a>
					</div>
				</div>
			</div>
		</div>
	);
};

export default RegularVehicleBlock;
