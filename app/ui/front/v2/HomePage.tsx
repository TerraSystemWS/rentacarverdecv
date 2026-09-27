"use client";

import PopularVehicleBlock from "../PopularVehicleBlock";
import DriverBlock from "../DriverBlock";
import CompanyBrandBlock from "../CompanyBrandBlock";
import BlogArea from "../BlogArea";
import { useContent } from "@/app/context/ContentContext";
import type { Advertisement } from "@/lib/api/types";
import HomeHero from "./HomeHero";
import Places from "./Places";
import WhyUs from "./WhyUs";
import FactsStrip from "./FactsStrip";

// Página inicial do novo visual (newUI). No topo, os banners das publicidades
// (Marketing → Publicidade, carregados no servidor em app/(front)/page.tsx)
// com o título e a pesquisa por baixo — nenhum texto por cima das imagens;
// sem publicidades, fica a foto de Santiago. Depois: números da empresa,
// viaturas, destinos da ilha e porquê nós. Os números vêm de /public/stats +
// Conteúdo → home.funFacts; o bloco da app (AppBlock) fica fora por agora.
export default function HomePage({ bannerAds }: { bannerAds: Advertisement[] }) {
	const { content } = useContent();
	return (
		<>
			<HomeHero ads={bannerAds} />
			<FactsStrip content={content?.home.funFacts} />
			<PopularVehicleBlock />
			<Places />
			<WhyUs />
			<DriverBlock />
			<CompanyBrandBlock />
			<BlogArea />
		</>
	);
}
