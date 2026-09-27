// AppBlock.tsx
"use client";

import React from "react";
import { useTranslations } from "next-intl";

interface AppBlockProps {
	content?: {
		topSubtitle: string;
		title: string;
		subtitle: string;
	};
}

export default function AppBlock({ content }: AppBlockProps) {
	const t = useTranslations("appBlock");
	const data = {
		topSubtitle: content?.topSubtitle || t("topSubtitle"),
		title: content?.title || t("title"),
		subtitle: content?.subtitle || t("subtitle"),
	};

	return (
		<div className="app-block bg-gray-color mr-top-35 mr-btm-5">
			<div className="container-large-device">
				<div className="container">
					<div className="row tb">
						<div className="col-md-6 tb-cell">
							<div className="mobile-app-details">
								<h4 className="top-subtitle">{data.topSubtitle}</h4>
								<h2 className="title yellow-color">{data.title}</h2>
								<h3 className="subtitle">
									{data.subtitle}
								</h3>
								<div className="app-location-link">
									<img src="/assets/images/app-logo-one.png" alt={t("appStoreAlt")} />
									<img src="/assets/images/app-logo-two.png" alt={t("googlePlayAlt")} />
								</div>
							</div>
						</div>
						<div className="col-md-6 tb-cell">
							<div className="app-mokeup">
								<img src="/assets/images/mobile.png" alt={t("mockupAlt")} />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
