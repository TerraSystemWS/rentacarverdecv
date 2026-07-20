// FunFactsBlock.tsx
"use client";

import React from "react";
import CountUp from "react-countup";

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
	const funFacts = [
		{ id: 1, count: Number(content?.f1Num) || 0, label: content?.f1 || "Caros na frota" },
		{ id: 2, count: Number(content?.f2Num) || 0, label: content?.f2 || "Clientes Satisfeitos" },
		{ id: 3, count: Number(content?.f3Num) || 0, label: content?.f3 || "Condutores" },
		{ id: 4, count: Number(content?.f4Num) || 0, label: content?.f4 || "Dias Na Atividade" },
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
