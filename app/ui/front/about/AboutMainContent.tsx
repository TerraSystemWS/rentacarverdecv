// components/AboutMainContent.jsx
"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

interface AboutMainContentProps {
	content?: {
		mainTitle: string;
		mainSubtitle: string;
		bigTitle: string;
		p1: string;
		p2: string;
	};
}

export default function AboutMainContent({ content }: AboutMainContentProps) {
	const t = useTranslations("about");
	// Textos de recurso (se a API de conteúdos falhar).
	const data = {
		mainTitle: content?.mainTitle || t("mainTitle"),
		mainSubtitle: content?.mainSubtitle || t("mainSubtitle"),
		bigTitle: content?.bigTitle || t("bigTitle"),
		p1: content?.p1 || t("p1"),
		p2: content?.p2 || t("p2"),
	};

	return (
		<div className="about-main-content mr-top-90">
			<div className="container">
				<div className="row">
					<div className="col-md-12">
						<div className="about-top-content">
							<div className="row">
								<div className="col-md-12">
									<div className="heading-content-three">
										<h2 className="title" dangerouslySetInnerHTML={{ __html: data.mainTitle.replace(/\n/g, '<br />') }}>
										</h2>
										<h4 className="sub-title">
											{data.mainSubtitle}
										</h4>
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col-md-12">
									<h2 className="extra-big-title">
										{data.bigTitle}
									</h2>
								</div>
								<div className="col-md-6">
									<div className="about-content-left">
										{/* HTML do editor de texto rico (sanitizado no backend); valores
										    antigos em texto simples continuam a funcionar. */}
										<div dangerouslySetInnerHTML={{ __html: asHtml(data.p1) }} />
										<div dangerouslySetInnerHTML={{ __html: asHtml(data.p2) }} />
									</div>
								</div>
								<div className="col-md-6">
									<Image
										src="/assets/images/about/rentcv_art.png"
										alt={t("imageAlt")}
										width={555}
										height={350}
										className="img-fluid rounded-3xl object-cover shadow-lg shadow-black/10"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function asHtml(value: string | undefined): string {
	if (!value) return "";
	if (/<[a-z][\s\S]*>/i.test(value)) return value;
	const escaped = value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
	return `<p>${escaped}</p>`;
}
