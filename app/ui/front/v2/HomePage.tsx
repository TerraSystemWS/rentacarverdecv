"use client";

import PopularVehicleBlock from "../PopularVehicleBlock";
import DriverBlock from "../DriverBlock";
import CompanyBrandBlock from "../CompanyBrandBlock";
import BlogArea from "../BlogArea";
import { useContent } from "@/app/context/ContentContext";
import type { Advertisement, PublicReviews } from "@/lib/api/types";
import HomeHero from "./HomeHero";
import Places from "./Places";
import WhyUs from "./WhyUs";
import FactsStrip from "./FactsStrip";
import Testimonials from "./Testimonials";

// Página inicial do novo visual (newUI). No topo, os banners das publicidades
// (Marketing → Publicidade, carregados no servidor em app/(front)/page.tsx)
// com o título e a pesquisa por baixo — nenhum texto por cima das imagens;
// sem publicidades, fica a foto de Santiago. Depois: números da empresa,
// viaturas, destinos da ilha, porquê nós e as avaliações dos clientes. Os números vêm de /public/stats +
// Conteúdo → home.funFacts; o bloco da app (AppBlock) fica fora por agora.
export default function HomePage({ bannerAds, reviews }: { bannerAds: Advertisement[]; reviews: PublicReviews | null }) {
	const { content } = useContent();
	return (
		<>
			<HomeHero ads={bannerAds} />
			<FactsStrip content={content?.home.funFacts} />
			<PopularVehicleBlock />
			<Places />
			<WhyUs />
			<Testimonials data={reviews} />
			<DriverBlock />
			<CompanyBrandBlock />
			<BlogArea />
		</>
	);
}
