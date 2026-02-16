// FunFactsBlock.tsx
"use client";

import React from "react";
import CountUp from "react-countup";

interface FunFactsBlockProps {
	content?: {
		f1: string;
		f2: string;
		f3: string;
		f4: string;
	};
}

const FunFactsBlock: React.FC<FunFactsBlockProps> = ({ content }) => {
	const labels = content || {
		f1: "Caros na frota",
		f2: "Clientes Satisfeitos",
		f3: "Condutores",
		f4: "Dias Na Atividade",
	};

	const funFacts = [
		{ id: 1, count: 50, label: labels.f1 },
		{ id: 2, count: 1200, label: labels.f2 },
		{ id: 3, count: 2500, label: labels.f3 },
		{ id: 4, count: 365, label: labels.f4 },
	];

	return (
		<section
			className="fun-facts-block relative bg-cover bg-center py-24 fun-facts-block background-overlay"
			style={{ backgroundImage: "url('/assets/images/fun-fect-image.png')" }}
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
