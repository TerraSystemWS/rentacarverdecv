// FunFactsBlock.tsx
"use client";

import React from "react";
import CountUp from "react-countup";

interface FunFact {
	id: number;
	count: number;
	label: string;
}

const funFacts: FunFact[] = [
	{ id: 1, count: 250, label: "Caros na frota" },
	{ id: 2, count: 25845, label: "Clientes Satisfeitos" },
	{ id: 3, count: 245, label: "Condutores" },
	{ id: 4, count: 525, label: "Dias Na Atividade" },
];

const FunFactsBlock: React.FC = () => {
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
