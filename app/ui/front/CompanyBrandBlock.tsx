// CompanyBrandBlock.tsx
"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const logos = [
	"/assets/images/logo/logo-one.png",
	"/assets/images/logo/logo-two.png",
	"/assets/images/logo/logo-three.png",
	"/assets/images/logo/logo-four.png",
	"/assets/images/logo/logo-five.png",
	"/assets/images/logo/logo-six.png",
	"/assets/images/logo/logo-seven.png",
];

const CompanyBrandBlock: React.FC = () => {
	return (
		<div className="company-brand-block">
			<div className="container">
				<div className="row tb default-margin-bottom yellow-theme">
					<div className="col-md-9 block-title-area tb-cell">
						<div className="heading-content style-one border">
							<h3 className="subtitle">Algumas das maiores empresas conosco</h3>
							<h2 className="title">Parceiros</h2>
						</div>
					</div>

					<div className="col-md-3 hidden-xs block-navigation-area tb-cell">
						<div className="item-navigation nav-right">
							<a href="#" className="previous-item">
								<i className="fa fa-angle-left"></i>
							</a>

							<a href="#" className="next-item">
								<i className="fa fa-angle-right"></i>
							</a>
						</div>
					</div>
				</div>

				<div className="">
					{/* Logo Slider */}
					<Swiper
						modules={[Navigation]}
						navigation={{
							nextEl: ".next-item",
							prevEl: ".previous-item",
						}}
						spaceBetween={24}
						slidesPerView={2}
						breakpoints={{
							640: { slidesPerView: 3 },
							768: { slidesPerView: 4 },
							1024: { slidesPerView: 5 },
							1280: { slidesPerView: 6 },
						}}
					>
						{logos.map((logo, index) => (
							<SwiperSlide
								key={index}
								className="flex justify-center items-center"
							>
								<img
									src={logo}
									alt={`Logo ${index + 1}`}
									className="h-16 object-contain"
								/>
							</SwiperSlide>
						))}
					</Swiper>
				</div>
			</div>
		</div>
	);
};

export default CompanyBrandBlock;
