// components/AboutMainContent.jsx
"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { API_BASE_URL } from "@/lib/api/endpoints";

interface AboutMainContentProps {
	content?: {
		mainTitle: string;
		mainSubtitle: string;
		bigTitle: string;
		text?: string;
		p1: string;
		p2: string;
		images?: string[];
	};
}

export default function AboutMainContent({ content }: AboutMainContentProps) {
	const t = useTranslations("about");
	// Textos de recurso (se a API de conteúdos falhar).
	const data = {
		mainTitle: content?.mainTitle || t("mainTitle"),
		mainSubtitle: content?.mainSubtitle || t("mainSubtitle"),
		bigTitle: content?.bigTitle || t("bigTitle"),
		// Um só bloco de texto; se ainda não foi gravado, os dois parágrafos antigos.
		text: content?.text || [content?.p1 || t("p1"), content?.p2 || t("p2")].map(asHtml).join(""),
	};
	const images = (content?.images ?? []).filter(Boolean);
	const src = (url: string) => (url.startsWith("/uploads") ? `${API_BASE_URL}${url}` : url);

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
										<div dangerouslySetInnerHTML={{ __html: asHtml(data.text) }} />
									</div>
								</div>
								<div className="col-md-6">
									{images.length === 0 ? (
										<Image
											src="/assets/images/about/rentcv_art.png"
											alt={t("imageAlt")}
											width={555}
											height={350}
											className="img-fluid rounded-3xl object-cover shadow-lg shadow-black/10"
										/>
									) : (
										// Imagens escolhidas no painel: a primeira grande, as outras em grelha por baixo.
										<div className="flex flex-col gap-3">
											<img
												src={src(images[0])}
												alt={t("imageAlt")}
												className="w-full aspect-[16/10] rounded-3xl object-cover shadow-lg shadow-black/10"
											/>
											{images.length > 1 && (
												<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
													{images.slice(1).map((url, i) => (
														<img key={url + i} src={src(url)} alt="" loading="lazy" className="w-full aspect-[4/3] rounded-2xl object-cover shadow-md shadow-black/10" />
													))}
												</div>
											)}
										</div>
									)}
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
