"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { Advertisement } from "@/lib/api/types";
import { API_BASE_URL, endpoints } from "@/lib/api/endpoints";
import { tr } from "@/lib/i18n/translate";

// Banners das publicidades (Marketing → Publicidade, BANNER) no topo da
// página inicial. Nada por cima das imagens: a imagem aparece sempre inteira
// (fundo desfocado da mesma imagem nas sobras, classes .hb-* de globals.css)
// e as setas, os pontos e o nome da promoção ficam numa barra por baixo.
const src = (url: string) => (url?.startsWith("/uploads") ? `${API_BASE_URL}${url}` : url);

function registerClick(id?: number) {
	if (!id) return;
	fetch(`${API_BASE_URL}${endpoints.ads.click(id)}`, { method: "POST" }).catch(() => { /* clique não é crítico */ });
}

export default function HeroBanner({ ads }: { ads: Advertisement[] }) {
	const t = useTranslations("v2.hero");
	const locale = useLocale();
	const [swiper, setSwiper] = useState<SwiperType | null>(null);
	const [active, setActive] = useState(0);
	const [reduceMotion, setReduceMotion] = useState(false);
	const many = ads.length > 1;

	useEffect(() => {
		setReduceMotion(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);
	}, []);

	const current = ads[active] ?? ads[0];
	const title = (ad: Advertisement) => tr(ad, "title", locale).replace(/\s*\n\s*/g, " ").trim();
	const linkProps = (ad: Advertisement) => {
		const external = ad.linkUrl?.startsWith("http");
		return {
			href: ad.linkUrl,
			onClick: () => registerClick(ad.id),
			target: external ? "_blank" : undefined,
			rel: external ? "noopener noreferrer" : undefined,
		};
	};

	return (
		<div className="v2-herobanner" aria-roledescription="carousel" aria-label={t("promosLabel")}>
			<div className="hb-banner v2-herobanner__stage">
				<Swiper
					modules={[Autoplay]}
					autoplay={many && !reduceMotion ? { delay: 7000, disableOnInteraction: false, pauseOnMouseEnter: true } : false}
					loop={many}
					slidesPerView={1}
					onSwiper={setSwiper}
					onSlideChange={(s) => setActive(s.realIndex)}
				>
					{ads.map((ad, i) => {
						const image = src(ad.imageUrl);
						const slide = (
							<div className="hb-slide v2-herobanner__slide">
								<div className="hb-backdrop" style={{ backgroundImage: `url("${image}")` }} aria-hidden="true" />
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img className="hb-image" src={image} alt={title(ad)} loading={i === 0 ? "eager" : "lazy"} />
							</div>
						);
						return (
							<SwiperSlide key={ad.id ?? i} aria-label={t("slide", { n: i + 1, total: ads.length })}>
								{ad.linkUrl ? <a className="v2-herobanner__link" {...linkProps(ad)}>{slide}</a> : slide}
							</SwiperSlide>
						);
					})}
				</Swiper>
			</div>

			<div className="v2-herobanner__bar">
				<div className="container v2-herobanner__barinner">
					{many && (
						<div className="v2-herobanner__controls">
							<button type="button" className="v2-herobanner__arrow" onClick={() => swiper?.slidePrev()} aria-label={t("prev")}>
								<ChevronLeft size={18} aria-hidden="true" />
							</button>
							<button type="button" className="v2-herobanner__arrow" onClick={() => swiper?.slideNext()} aria-label={t("next")}>
								<ChevronRight size={18} aria-hidden="true" />
							</button>
							<div className="v2-herobanner__dots">
								{ads.map((ad, i) => (
									<button
										key={ad.id ?? i}
										type="button"
										className={`v2-herobanner__dot${i === active ? " is-active" : ""}`}
										onClick={() => swiper?.slideToLoop(i)}
										aria-label={t("slide", { n: i + 1, total: ads.length })}
										aria-current={i === active ? "true" : undefined}
									/>
								))}
							</div>
						</div>
					)}
					{current && title(current) && (
						current.linkUrl ? (
							<a className="v2-herobanner__title" {...linkProps(current)} aria-live="polite">
								{title(current)} <span aria-hidden="true">→</span>
							</a>
						) : (
							<span className="v2-herobanner__title" aria-live="polite">{title(current)}</span>
						)
					)}
				</div>
			</div>
		</div>
	);
}
