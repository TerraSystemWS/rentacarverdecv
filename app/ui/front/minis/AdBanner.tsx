"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Advertisement } from "@/lib/api/types";
import { endpoints, API_BASE_URL } from "@/lib/api/endpoints";
import { useLocale, useTranslations } from "next-intl";
import { tr, trList } from "@/lib/i18n/translate";

// Banner da página principal com as campanhas BANNER criadas no dashboard.
// Substitui o Revolution Slider do template para estes banners porque:
//  - o Revolution usava data-bgfit="cover" com altura fixa e cortava a imagem
//    (as campanhas têm proporções muito diferentes — 16:9, 4:3, retrato);
//  - no computador às vezes nem arrancava (altura 0) quando os banners
//    chegavam da API depois do carregamento da página.
// Aqui a imagem aparece sempre inteira (object-fit: contain) e o espaço que
// sobra é preenchido com uma cópia desfocada da mesma imagem. O título fica
// discreto no canto inferior direito. Estilos em .hb-* (globals.css, sem
// @layer — o CSS legado do template mexe em img/a).
export default function AdBanner({ ads }: { ads: Advertisement[] }) {
	const t = useTranslations("ads");
	const locale = useLocale();
	const src = (url: string) => (url?.startsWith("/uploads") ? `${API_BASE_URL}${url}` : url);

	function registerClick(id?: number) {
		if (!id) return;
		fetch(`${API_BASE_URL}${endpoints.ads.click(id)}`, { method: "POST" }).catch(() => { /* clique não é crítico */ });
	}

	const many = ads.length > 1;

	return (
		<section className="hb-banner" aria-label={t("highlights")}>
			<Swiper
				modules={[Autoplay, Navigation, Pagination]}
				autoplay={many ? { delay: 7000, disableOnInteraction: false, pauseOnMouseEnter: true } : false}
				loop={many}
				navigation={many}
				pagination={many ? { clickable: true } : false}
				slidesPerView={1}
			>
				{ads.map((ad) => {
					const image = src(ad.imageUrl);
					const external = ad.linkUrl?.startsWith("http");
					const title = tr(ad, "title", locale).replace(/\s*\n\s*/g, " ").trim();
					return (
						<SwiperSlide key={ad.id}>
							<div className="hb-slide">
								<div className="hb-backdrop" style={{ backgroundImage: `url("${image}")` }} aria-hidden="true" />
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img className="hb-image" src={image} alt={title} loading={ads[0] === ad ? "eager" : "lazy"} />
								{title && (
									ad.linkUrl ? (
										<a
											className="hb-caption"
											href={ad.linkUrl}
											onClick={() => registerClick(ad.id)}
											target={external ? "_blank" : undefined}
											rel={external ? "noopener noreferrer" : undefined}
										>
											{title} <span aria-hidden="true">→</span>
										</a>
									) : (
										<span className="hb-caption">{title}</span>
									)
								)}
							</div>
						</SwiperSlide>
					);
				})}
			</Swiper>
		</section>
	);
}
