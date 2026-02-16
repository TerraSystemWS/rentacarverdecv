// CompanyBrandBlock.tsx
"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import { useState, useEffect } from "react";
import { endpoints, API_BASE_URL } from "@/lib/api/endpoints";
import { Partner } from "@/lib/api/types";

const CompanyBrandBlock: React.FC = () => {
	const [partners, setPartners] = useState<Partner[]>([]);

	useEffect(() => {
		const fetchPartners = async () => {
			try {
				const res = await fetch(`${API_BASE_URL}${endpoints.partners.list}`);
				if (res.ok) {
					const data = await res.json();
					setPartners(data);
				}
			} catch (error) {
				console.error("Error fetching partners:", error);
			}
		};
		fetchPartners();
	}, []);

	const getImageSrc = (url: string | undefined | null) => {
		if (!url) return "/assets/images/logo/logo-one.png";
		if (url.startsWith('blob:') || url.startsWith('data:')) return url;
		if (url.startsWith('/uploads')) {
			return `${API_BASE_URL}${url}`;
		}
		return url;
	};

	if (partners.length === 0) return null;

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
						{partners.map((partner) => (
							<SwiperSlide
								key={partner.id}
								className="flex justify-center items-center"
							>
								{partner.websiteUrl ? (
									<a href={partner.websiteUrl} target="_blank" rel="noopener noreferrer">
										<img
											src={getImageSrc(partner.logoUrl)}
											alt={partner.name}
											className="h-16 object-contain"
										/>
									</a>
								) : (
									<img
										src={getImageSrc(partner.logoUrl)}
										alt={partner.name}
										className="h-16 object-contain"
									/>
								)}
							</SwiperSlide>
						))}
					</Swiper>
				</div>
			</div>
		</div>
	);
};

export default CompanyBrandBlock;
