// AppBlock.tsx
"use client";

import React from "react";

interface AppBlockProps {
	content?: {
		topSubtitle: string;
		title: string;
		subtitle: string;
	};
}

export default function AppBlock({ content }: AppBlockProps) {
	const data = content || {
		topSubtitle: "Todos os descontos só para si",
		title: "A Nossa App Gratuita",
		subtitle: "Procure Rentacarverde na App Store & Google Play",
	};

	return (
		<div className="app-block bg-gray-color mr-top-35 mr-btm-5">
			<div className="container-large-device">
				<div className="container">
					<div className="row tb">
						<div className="col-md-6 tb-cell">
							<div className="mobile-app-details">
								<h4 className="top-subtitle">{data.topSubtitle}</h4>
								<h2 className="title red-color">{data.title}</h2>
								<h3 className="subtitle">
									{data.subtitle}
								</h3>
								<div className="app-location-link">
									<a href="#">
										<img src="assets/images/app-logo-one.png" alt="mobile" />
									</a>
									<a href="#">
										<img src="assets/images/app-logo-two.png" alt="mobile" />
									</a>
								</div>
							</div>
						</div>
						<div className="col-md-6 tb-cell">
							<div className="app-mokeup">
								<img src="assets/images/mobile.png" alt="mobile" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
