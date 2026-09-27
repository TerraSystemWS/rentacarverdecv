"use client";

import React, { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { tr } from "@/lib/i18n/translate";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { Advertisement } from "@/lib/api/types";
import { endpoints, API_BASE_URL } from "@/lib/api/endpoints";

interface AdSlotProps {
	placement: "SIDEBAR" | "POPUP";
	className?: string;
}

// Mostra a(s) campanha(s) ativas de um "placement" — se houver mais do que
// uma, faz carrossel automático em vez de esconder as restantes (tasks.md:
// "carrossel para múltiplas campanhas ativas no mesmo placement").
const AdSlot: React.FC<AdSlotProps> = ({ placement, className }) => {
	const [ads, setAds] = useState<Advertisement[]>([]);
	const locale = useLocale();

	useEffect(() => {
		let cancelled = false;
		fetch(`${API_BASE_URL}${endpoints.ads.list(placement)}`)
			.then((res) => (res.ok ? res.json() : []))
			.then((data: Advertisement[]) => {
				if (!cancelled) setAds(data || []);
			})
			.catch(() => { /* sem anúncio se falhar — não bloqueia a página */ });
		return () => { cancelled = true; };
	}, [placement]);

	const getImageSrc = (url: string) => {
		if (!url) return "";
		if (url.startsWith("/uploads")) return `${API_BASE_URL}${url}`;
		return url;
	};

	function registerClick(id?: number) {
		if (!id) return;
		fetch(`${API_BASE_URL}${endpoints.ads.click(id)}`, { method: "POST" }).catch(() => { /* clique não é crítico */ });
	}

	if (ads.length === 0) return null;

	return (
		<div className={className}>
			<Swiper
				modules={[Autoplay]}
				autoplay={ads.length > 1 ? { delay: 5000, disableOnInteraction: false } : false}
				loop={ads.length > 1}
				slidesPerView={1}
			>
				{ads.map((ad) => (
					<SwiperSlide key={ad.id}>
						<a
							href={ad.linkUrl || "#"}
							onClick={() => registerClick(ad.id)}
							target={ad.linkUrl?.startsWith("http") ? "_blank" : undefined}
							rel={ad.linkUrl?.startsWith("http") ? "noopener noreferrer" : undefined}
						>
							<img src={getImageSrc(ad.imageUrl)} alt={tr(ad, "title", locale)} style={{ width: "100%", height: "auto", display: "block" }} />
						</a>
					</SwiperSlide>
				))}
			</Swiper>
		</div>
	);
};

export default AdSlot;
