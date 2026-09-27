// FunFactsBlock.tsx
"use client";

import React from "react";
import CountUp from "react-countup";
import { API_BASE_URL, endpoints } from "@/lib/api/endpoints";
import { useTranslations } from "next-intl";

interface FunFactsBlockProps {
	content?: {
		f1: string;
		f1Num: number | string;
		f2: string;
		f2Num: number | string;
		f3: string;
		f3Num: number | string;
		f4: string;
		f4Num: number | string;
	};
}

const FunFactsBlock: React.FC<FunFactsBlockProps> = ({ content }) => {
	const t = useTranslations("funFacts");
	// Facto 1 (veículos), 2 (clientes) e 3 (condutores) vêm sempre da contagem
	// real no backend. Facto 4 continua a ser editável manualmente no dashboard.
	const [liveStats, setLiveStats] = React.useState({
		vehiclesCount: 0,
		clientsCount: 0,
		driversCount: 0,
	});

	React.useEffect(() => {
		let cancelled = false;
		fetch(`${API_BASE_URL}${endpoints.content.stats}`)
			.then((res) => (res.ok ? res.json() : null))
			.then((data) => {
				if (cancelled || !data) return;
				setLiveStats({
					vehiclesCount: data.vehiclesCount ?? 0,
					clientsCount: data.clientsCount ?? 0,
					driversCount: data.driversCount ?? 0,
				});
			})
			.catch(() => { /* mantém os valores em 0 se a chamada falhar */ });
		return () => {
			cancelled = true;
		};
	}, []);

	const funFacts = [
		{ id: 1, count: liveStats.vehiclesCount, label: content?.f1 || t("vehicles") },
		{ id: 2, count: liveStats.clientsCount, label: content?.f2 || t("customers") },
		{ id: 3, count: liveStats.driversCount, label: content?.f3 || t("drivers") },
		{ id: 4, count: Number(content?.f4Num) || 0, label: content?.f4 || t("days") },
	];

	return (
		<section
			className="fun-facts-block relative bg-cover bg-center py-24 fun-facts-block background-overlay"
			style={{ backgroundImage: "url('/assets/images/fun-fect-image.jpg')" }}
		>
			<div className="absolute inset-0 bg-black/50"></div> {/* overlay */}
			<div className="container mx-auto relative z-10">
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
					{funFacts.map((fact) => (
						<div key={fact.id} className="milestone-counter">
							<h3 className="stat-count text-4xl font-bold mb-2 stat-count highlight">
								<CountUp
									start={0}
									end={fact.count}
									duration={2.5}
									separator=","
								/>
							</h3>
							<div className="milestone-details text-lg">{fact.label}</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default FunFactsBlock;
