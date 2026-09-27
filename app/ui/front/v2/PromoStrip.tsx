"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Advertisement } from "@/lib/api/types";
import { endpoints, API_BASE_URL } from "@/lib/api/endpoints";
import AdBanner from "../minis/AdBanner";

// Campanhas BANNER do dashboard (Marketing → Publicidade), agora numa faixa
// abaixo do herói em vez de ocuparem o topo da página. Sem campanhas, não
// aparece nada.
export default function PromoStrip() {
	const t = useTranslations("v2");
	const [ads, setAds] = useState<Advertisement[]>([]);

	useEffect(() => {
		let cancelled = false;
		fetch(`${API_BASE_URL}${endpoints.ads.list("BANNER")}`)
			.then((res) => (res.ok ? res.json() : []))
			.then((data: Advertisement[]) => { if (!cancelled) setAds(data || []); })
			.catch(() => { /* sem promoções se falhar */ });
		return () => { cancelled = true; };
	}, []);

	if (ads.length === 0) return null;
	return (
		<section className="v2-promos" aria-label={t("promos")}>
			<div className="container">
				<AdBanner ads={ads} />
			</div>
		</section>
	);
}
