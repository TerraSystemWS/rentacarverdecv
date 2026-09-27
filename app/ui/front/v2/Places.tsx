"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { API_BASE_URL, endpoints } from "@/lib/api/endpoints";
import type { GalleryItem } from "@/lib/api/types";
import { tr } from "@/lib/i18n/translate";
import CvPhoto from "./CvPhoto";
import type { CvPhotoKey } from "./photos";

// "Para onde ir a partir da Praia": destinos de Santiago com o tempo de
// carro desde a agência. As imagens vêm da galeria (categoria "Destinos",
// com local e tempo — geridas no dashboard); em cada visita mostra até 4 ao
// acaso, de locais diferentes sempre que possível. Cada cartão abre a
// galeria já filtrada por esse local. Sem imagens de Destinos na galeria,
// ficam os 4 destinos fixos abaixo.
const DESTINATIONS = "Destinos";
const MAX_CARDS = 4;
const FALLBACK: CvPhotoKey[] = ["tarrafal", "cidadeVelha", "serraMalagueta", "assomada"];

function shuffle<T>(list: T[]): T[] {
	const a = [...list];
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

/** Até `max` imagens ao acaso: primeiro uma por local, depois completa com as restantes. */
function pickDestinations(items: GalleryItem[], max: number): GalleryItem[] {
	const shuffled = shuffle(items);
	const seen = new Set<string>();
	const firstPerPlace: GalleryItem[] = [];
	const rest: GalleryItem[] = [];
	for (const item of shuffled) {
		const key = (item.place || "").toLowerCase();
		if (seen.has(key)) rest.push(item);
		else {
			seen.add(key);
			firstPerPlace.push(item);
		}
	}
	return [...firstPerPlace, ...rest].slice(0, max);
}

const galleryHref = (place?: string) =>
	`/gallery?category=${encodeURIComponent(DESTINATIONS)}${place ? `&place=${encodeURIComponent(place)}` : ""}`;

export default function Places() {
	const t = useTranslations("v2.places");
	const locale = useLocale();
	// null = ainda a carregar (mostra os destinos fixos, sem saltos na página).
	const [cards, setCards] = useState<GalleryItem[] | null>(null);

	useEffect(() => {
		let cancelled = false;
		fetch(`${API_BASE_URL}${endpoints.gallery.list}?category=${encodeURIComponent(DESTINATIONS)}`)
			.then((res) => (res.ok ? res.json() : []))
			.then((data: GalleryItem[]) => {
				if (!cancelled) setCards(pickDestinations(Array.isArray(data) ? data.filter((i) => i.place) : [], MAX_CARDS));
			})
			.catch(() => {
				if (!cancelled) setCards([]);
			});
		return () => {
			cancelled = true;
		};
	}, []);

	const fromGallery = cards && cards.length > 0 ? cards : null;
	const count = fromGallery ? fromGallery.length : FALLBACK.length;

	return (
		<section className="v2-section v2-section--sea">
			<div className="container">
				<div className="v2-places__top">
					<div className="v2-head">
						<h2>{t("title")}</h2>
						<p>{t("lead")}</p>
					</div>
					{fromGallery && (
						<Link href={galleryHref()} className="v2-places__all">
							{t("seeAll")}
						</Link>
					)}
				</div>
				<div className={`v2-places v2-places--${count}`}>
					{fromGallery
						? fromGallery.map((item) => {
								const text = tr(item, "description", locale) || tr(item, "title", locale);
								return (
									<Link
										key={item.id}
										href={galleryHref(item.place)}
										className="v2-place"
										aria-label={t("openGallery", { place: item.place ?? "" })}
									>
										<div className="v2-photo">
											{/* eslint-disable-next-line @next/next/no-img-element */}
											<img src={`${API_BASE_URL}${item.imageUrl}`} alt={tr(item, "title", locale) || item.place || ""} loading="lazy" />
										</div>
										<div className="v2-place__body">
											{item.travelTime && (
												<span className="v2-place__time">
													<Clock size={14} aria-hidden="true" /> {t("about", { time: item.travelTime })}
												</span>
											)}
											<h3>{item.place}</h3>
											{text && <p>{text}</p>}
										</div>
									</Link>
								);
							})
						: FALLBACK.map((key) => (
								<article key={key} className="v2-place">
									<CvPhoto photo={key} alt={t(`${key}.name`)} />
									<div className="v2-place__body">
										<span className="v2-place__time">
											<Clock size={14} aria-hidden="true" /> {t(`${key}.time`)}
										</span>
										<h3>{t(`${key}.name`)}</h3>
										<p>{t(`${key}.text`)}</p>
									</div>
								</article>
							))}
				</div>
				<p className="v2-places__note">{t("note")}</p>
			</div>
		</section>
	);
}
