// AppBlock.tsx
"use client";

import React from "react";

export default function AppBlock() {
	return (
		<div className="app-block bg-gray-color mr-top-35 mr-btm-5">
			<div className="container-large-device">
				<div className="container">
					<div className="row tb">
						<div className="col-md-6 tb-cell">
							<div className="mobile-app-details">
								<h4 className="top-subtitle">Todos os descontos só para si</h4>
								<h2 className="title red-color">A Nossa App Gratuita</h2>
								<h3 className="subtitle">
									Procure Rentacarverde na App Store &amp; Google Play
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
