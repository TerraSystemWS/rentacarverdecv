// FunFactsBlock.tsx
"use client";

import React from "react";
import CountUp from "react-countup";
import { API_BASE_URL, endpoints } from "@/lib/api/endpoints";

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
	const [stats, setStats] = React.useState({
		vehiclesCount: Number(content?.f1Num) || 50,
		driversCount: Number(content?.f3Num) || 2500,
		clientsCount: Number(content?.f2Num) || 1200,
		daysInActivity: Number(content?.f4Num) || 365,
	});

	React.useEffect(() => {
		const fetchStats = async () => {
			try {
				const res = await fetch(`${API_BASE_URL}${endpoints.content.stats}`);
				if (res.ok) {
					const data = await res.json();
					setStats({
						vehiclesCount: data.vehiclesCount || stats.vehiclesCount,
						driversCount: data.driversCount || stats.driversCount,
						clientsCount: data.clientsCount || stats.clientsCount,
						daysInActivity: data.daysInActivity || stats.daysInActivity,
					});
				}
			} catch (error) {
				console.error("Error fetching fun facts stats:", error);
			}
		};
		fetchStats();
	}, []);

	const labels = {
		f1: content?.f1 || "Caros na frota",
		f2: content?.f2 || "Clientes Satisfeitos",
		f3: content?.f3 || "Condutores",
		f4: content?.f4 || "Dias Na Atividade",
	};

	const funFacts = [
		{ id: 1, count: stats.vehiclesCount, label: labels.f1 },
		{ id: 2, count: stats.clientsCount, label: labels.f2 },
		{ id: 3, count: stats.driversCount, label: labels.f3 },
		{ id: 4, count: stats.daysInActivity, label: labels.f4 },
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
