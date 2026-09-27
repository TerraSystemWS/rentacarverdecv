"use client";

import { useTranslations } from "next-intl";
import type { Advertisement } from "@/lib/api/types";
import CvPhoto from "./CvPhoto";
import HeroBanner from "./HeroBanner";
import HeroSearch from "./HeroSearch";

// Topo da página inicial.
// - Com publicidades BANNER ativas: o banner em cima (imagem sempre inteira,
//   sem texto por cima) e, por baixo, uma faixa com o título e a pesquisa.
// - Sem publicidades: foto de Santiago em ecrã inteiro com o título e a
//   pesquisa por cima (a foto é decorativa, não um anúncio).
export default function HomeHero({ ads = [] }: { ads?: Advertisement[] }) {
	const t = useTranslations("v2.hero");

	if (ads.length > 0) {
		return (
			<section className="v2-hero-ads" id="reservar">
				<HeroBanner ads={ads} />
				<div className="v2-herodock">
					<div className="container">
						<div className="v2-herodock__text">
							<h1>{t("title")}</h1>
							<p className="v2-herodock__lead">{t("lead")}</p>
						</div>
						<HeroSearch />
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className="v2-hero" id="reservar">
			<CvPhoto photo="hero" alt={t("photoAlt")} eager />
			<div className="v2-hero__inner">
				<div className="container">
					<h1>{t("title")}</h1>
					<p className="v2-hero__lead">{t("lead")}</p>
					<HeroSearch />
				</div>
			</div>
		</section>
	);
}
